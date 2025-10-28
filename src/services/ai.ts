const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ClassificationResult {
  category: 'INTERESTED' | 'NOT_INTERESTED' | 'REFERRAL' | 'WRONG_EMAIL' | 'OUT_OF_OFFICE' | 'GENERAL_QUESTION' | 'BOUNCE' | 'REVIEW_ANSWER';
  suggestedDays?: string[];
  suggestedTime?: string;
  suggestedTimezone?: string;
  suggestedWeek?: string;
  referredEmail?: string;
}

export async function callGeminiApi(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('❌ Gemini API Key is missing from environment variables');
    throw new Error("Gemini API Key is missing from environment variables.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Gemini API error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('❌ Gemini API returned empty or invalid response:', data);
      throw new Error("The AI response was empty or invalid.");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('❌ Error calling Gemini API:', error);
    throw error;
  }
}

export async function classifyResponse(emailBody: string): Promise<ClassificationResult> {
  const classificationPrompt = `
Analyze ONLY the LATEST customer reply in an email thread.
Perform FIVE tasks on the latest reply:
1. Classify it into ONE of the following categories: INTERESTED, NOT_INTERESTED, REFERRAL, WRONG_EMAIL, OUT_OF_OFFICE, GENERAL_QUESTION, BOUNCE, REVIEW_ANSWER.
2. If INTERESTED and they EXPLICITLY mention specific days/times, extract them IN ANY LANGUAGE.
3. If REFERRAL, extract the new email address.

CATEGORY DEFINITIONS:
- INTERESTED: Clear interest in meeting/call (e.g., "yes, let's talk", "I'm interested", "when can we meet")
- NOT_INTERESTED: Clear rejection (e.g., "not interested", "not a good fit", "no thanks")
- REFERRAL: Mentions someone else to contact (e.g., "talk to my colleague", "her email is...", "contact John instead")
- WRONG_EMAIL: Wrong person/email (e.g., "wrong person", "I don't work there")
- OUT_OF_OFFICE: OOO messages (e.g., "out of office", "vacation", "away until", "OOO")
- GENERAL_QUESTION: Questions seeking info (e.g., "what is this about?", "more information", "tell me more")
- BOUNCE: Email delivery failures (e.g., "undeliverable", "mailbox full", "invalid email")
- REVIEW_ANSWER: Unclear/ambiguous responses that don't fit other categories

VERY IMPORTANT RULES FOR DAY/TIME EXTRACTION:
- Extract days in ENGLISH lowercase (monday, tuesday, wednesday, thursday, friday, saturday, sunday)
- Convert ANY language to English: "viernes"→friday, "lunes"→monday, "jueves"→thursday, "miércoles"→wednesday, "martes"→tuesday
- Convert ANY time format to 24-hour HH:MM: "3pm"→15:00, "10am"→10:00, "noon"→12:00, "2:30pm"→14:30
- If timezone mentioned (e.g., "hora argentina", "PST", "GMT-3"), include it as TIMEZONE:Argentina or TIMEZONE:PST
- ALWAYS extract if mentioned, even in casual language

EXACT Output Format:
Line 1: The category in uppercase.
Line 2 (IF APPLIES): DAYS:friday
Line 3 (IF APPLIES): TIME:15:00
Line 4 (IF APPLIES): TIMEZONE:Argentina (or country/timezone name if mentioned)
Line 5 (IF APPLIES): WEEK:next
Line 6 (IF APPLIES): EMAIL:new.contact@company.com

COMPREHENSIVE EXAMPLES:
- "viernes a las 3pm" → DAYS:friday TIME:15:00
- "el jueves a las 10am" → DAYS:thursday TIME:10:00
- "martes 2pm" → DAYS:tuesday TIME:14:00
- "next Monday at 9am" → DAYS:monday TIME:09:00 WEEK:next
- "Friday at 3pm Argentina time" → DAYS:friday TIME:15:00 TIMEZONE:Argentina
- "miércoles 12pm hora de Argentina" → DAYS:wednesday TIME:12:00 TIMEZONE:Argentina
- "Thursday 2:30pm PST" → DAYS:thursday TIME:14:30 TIMEZONE:PST
- "el viernes 15:00 hora México" → DAYS:friday TIME:15:00 TIMEZONE:Mexico

Email to analyze:
---
${emailBody}
---
  `.trim();

  const aiResponse = await callGeminiApi(classificationPrompt);
  console.log(`🤖 Raw AI Response:\n${aiResponse}`);
  
  const lines = aiResponse.trim().split('\n');
  
  // Clean the first line to extract just the category
  const firstLine = lines[0].trim();
  const category = firstLine.includes(':') ? firstLine.split(':')[1].trim() : firstLine;
  
  const result: ClassificationResult = {
    category: category as any
  };

  lines.forEach(line => {
    // Clean "Line X:" prefix if present
    const cleanedLine = line.replace(/^Line \d+:\s*/i, '').trim();
    
    if (cleanedLine.startsWith('DAYS:')) {
      result.suggestedDays = cleanedLine.replace('DAYS:', '').trim().split(',').map(d => d.trim());
    }
    if (cleanedLine.startsWith('TIME:')) {
      result.suggestedTime = cleanedLine.replace('TIME:', '').trim();
    }
    if (cleanedLine.startsWith('TIMEZONE:')) {
      result.suggestedTimezone = cleanedLine.replace('TIMEZONE:', '').trim();
    }
    if (cleanedLine.startsWith('WEEK:')) {
      result.suggestedWeek = cleanedLine.replace('WEEK:', '').trim();
    }
    if (cleanedLine.startsWith('EMAIL:')) {
      result.referredEmail = cleanedLine.replace('EMAIL:', '').trim();
    }
  });

  console.log(`✅ Extracted data:`, {
    category: result.category,
    suggestedDays: result.suggestedDays,
    suggestedTime: result.suggestedTime,
    suggestedTimezone: result.suggestedTimezone,
    suggestedWeek: result.suggestedWeek,
    referredEmail: result.referredEmail
  });

  return result;
}

export function replaceTemplateVariables(
  text: string,
  variables: {
    externalCid?: string;
    contactName?: string;
    companyName?: string;
    contactTitle?: string;
    industry?: string;
    yourName?: string;
  }
): string {
  if (!text) return "";
  
  return text
    .replace(/\$\{externalCID\}/g, variables.externalCid || "")
    .replace(/\$\{contactName\}/g, variables.contactName || "")
    .replace(/\$\{companyName\}/g, variables.companyName || "")
    .replace(/\$\{contactTitle\}/g, variables.contactTitle || "")
    .replace(/\$\{industry\}/g, variables.industry || "")
    .replace(/\$\{yourName\}/g, variables.yourName || "");
}
