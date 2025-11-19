# Email Threading Flow - Visual Diagram

## 🔄 Complete Email Threading Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INITIAL EMAIL (Day 0)                            │
└─────────────────────────────────────────────────────────────────────────┘

1. User checks "Send Sequence" ✅
   │
   ├─> Agent: sendInitialEmail()
   │   │
   │   ├─> Get "Initial" template
   │   ├─> Replace variables (${contactName}, ${companyName}, etc.)
   │   └─> Call: sendEmail(subject, body, threadId=undefined)
   │
   └─> Gmail API: users.messages.send()
       │
       └─> Response:
           ├─> threadId: "abc123xyz"
           └─> messageId: "<msg1@mail.gmail.com>"
       
2. Save to Database:
   ├─> threadId: "abc123xyz"
   ├─> lastMessageId: "<msg1@mail.gmail.com>"
   ├─> touchpointsSent: 1
   └─> status: "Following up"

┌─────────────────────────────────────────────────────────────────────────┐
│                    FOLLOW-UP EMAIL #1 (Day 4)                            │
└─────────────────────────────────────────────────────────────────────────┘

1. Agent runs (every 30 minutes)
   │
   ├─> Check: daysSinceLastContact >= 4? ✅
   │   └─> Agent: sendFollowUpEmail()
   │
   ├─> Get "Second Touch" template (body only)
   ├─> Get "Initial" template (subject - SAME as before)
   └─> Replace variables
   
2. Call: sendEmail(subject, body, threadId="abc123xyz")
   │
   ├─> Gmail API: users.threads.get(threadId)
   │   │
   │   └─> Retrieve ALL messages in thread:
   │       └─> messages[0].Message-ID: "<msg1@mail.gmail.com>"
   │
   └─> Build email with headers:
       ├─> To: prospect@company.com
       ├─> Subject: [SAME as Initial]
       ├─> In-Reply-To: <msg1@mail.gmail.com>
       ├─> References: <msg1@mail.gmail.com>
       └─> Body: [Second Touch content]

3. Gmail API: users.messages.send(threadId="abc123xyz")
   │
   └─> Response:
       ├─> threadId: "abc123xyz" (SAME thread!)
       └─> messageId: "<msg2@mail.gmail.com>"

4. Save to Database:
   ├─> lastMessageId: "<msg2@mail.gmail.com>" (updated)
   ├─> touchpointsSent: 2
   └─> lastContactDate: [now]

┌─────────────────────────────────────────────────────────────────────────┐
│                    FOLLOW-UP EMAIL #2 (Day 8)                            │
└─────────────────────────────────────────────────────────────────────────┘

1. Agent runs
   │
   └─> Agent: sendFollowUpEmail()
       └─> Get "Third Touch" template

2. Call: sendEmail(subject, body, threadId="abc123xyz")
   │
   ├─> Gmail API: users.threads.get(threadId)
   │   │
   │   └─> Retrieve ALL messages in thread:
   │       ├─> messages[0].Message-ID: "<msg1@mail.gmail.com>"
   │       └─> messages[1].Message-ID: "<msg2@mail.gmail.com>"
   │
   └─> Build email with headers:
       ├─> To: prospect@company.com
       ├─> Subject: [SAME as Initial]
       ├─> In-Reply-To: <msg2@mail.gmail.com> (last message)
       ├─> References: <msg1@mail.gmail.com> <msg2@mail.gmail.com> (ALL previous)
       └─> Body: [Third Touch content]

3. Gmail groups it in SAME thread because:
   ✅ Same threadId
   ✅ Same subject
   ✅ In-Reply-To points to last message
   ✅ References includes all previous messages

4. Save to Database:
   ├─> lastMessageId: "<msg3@mail.gmail.com>"
   ├─> touchpointsSent: 3
   └─> lastContactDate: [now]

┌─────────────────────────────────────────────────────────────────────────┐
│                    FOLLOW-UP EMAIL #3 (Day 12)                           │
└─────────────────────────────────────────────────────────────────────────┘

[Same process as above, now with 4 messages in References]

Result: ALL 4 emails in ONE thread! 🎉
```

## 📧 Email Headers Comparison

### ❌ BEFORE FIX (Broken Threading)

```
Email 1 (Initial):
Subject: Growth Opportunities for Acme Corp with Google
Message-ID: <msg1@mail.gmail.com>

Email 2 (Follow-up):
Subject: Growth Opportunities for Acme Corp with Google
Message-ID: <msg2@mail.gmail.com>
In-Reply-To: <msg1@mail.gmail.com>
References: <msg1@mail.gmail.com>
threadId: "abc123xyz" (sent via API)

Problem: Gmail sees proper headers but sometimes creates new thread
because the References weren't being retrieved dynamically.
```

### ✅ AFTER FIX (Proper Threading)

```
Email 1 (Initial):
Subject: Growth Opportunities for Acme Corp with Google
Message-ID: <msg1@mail.gmail.com>
threadId: abc123xyz

Email 2 (Follow-up):
Subject: Growth Opportunities for Acme Corp with Google
Message-ID: <msg2@mail.gmail.com>
In-Reply-To: <msg1@mail.gmail.com>
References: <msg1@mail.gmail.com>
threadId: abc123xyz

Email 3 (Follow-up):
Subject: Growth Opportunities for Acme Corp with Google
Message-ID: <msg3@mail.gmail.com>
In-Reply-To: <msg2@mail.gmail.com>
References: <msg1@mail.gmail.com> <msg2@mail.gmail.com>
threadId: abc123xyz

Email 4 (Follow-up):
Subject: Growth Opportunities for Acme Corp with Google
Message-ID: <msg4@mail.gmail.com>
In-Reply-To: <msg3@mail.gmail.com>
References: <msg1@mail.gmail.com> <msg2@mail.gmail.com> <msg3@mail.gmail.com>
threadId: abc123xyz

Result: Perfect threading! Gmail groups all 4 emails in one conversation.
```

## 🔧 Code Flow

```typescript
// server/services/gmail.ts (AFTER FIX)

export async function sendEmail(..., threadId?: string) {
  
  if (threadId) {
    // 🔑 KEY FIX: Dynamically fetch ALL Message-IDs from thread
    const thread = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
      format: 'metadata',
      metadataHeaders: ['Message-ID']
    });
    
    const allMessageIds: string[] = [];
    for (const msg of thread.data.messages) {
      const msgId = msg.payload?.headers?.find(
        h => h.name?.toLowerCase() === 'message-id'
      )?.value;
      if (msgId) {
        allMessageIds.push(msgId);
      }
    }
    
    // In-Reply-To = last message
    headers.push(`In-Reply-To: ${allMessageIds[allMessageIds.length - 1]}`);
    
    // References = ALL previous messages (space-separated)
    headers.push(`References: ${allMessageIds.join(' ')}`);
  }
  
  // Send email with threadId
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
      threadId: threadId  // 🔑 Critical: tells Gmail to add to existing thread
    }
  });
}
```

## 🆚 Google Sheets MVP vs Web Platform

### Google Sheets MVP Method
```javascript
// Uses GmailApp.forward() which handles threading automatically
const thread = GmailApp.getThreadById(threadId);
const firstMessage = thread.getMessages()[0];

firstMessage.forward(contactEmail, {
  htmlBody: fullHtmlBody,
  from: config.YOUR_EMAIL,
  name: config.YOUR_NAME
});

// Pros: Simple, automatic threading
// Cons: Only works in Google Apps Script
```

### Web Platform Method (After Fix)
```typescript
// Manual threading using Gmail API with proper headers
const thread = await gmail.users.threads.get({ id: threadId });
const allMessageIds = extractAllMessageIds(thread);

await gmail.users.messages.send({
  requestBody: {
    raw: buildEmailWithHeaders({
      inReplyTo: allMessageIds[allMessageIds.length - 1],
      references: allMessageIds.join(' ')
    }),
    threadId: threadId
  }
});

// Pros: Works anywhere with Gmail API access
// Cons: More complex, must manage headers manually
```

## 🎯 Why Threading Works Now

Gmail threads emails when:

1. ✅ **Same threadId** (Gmail API parameter)
2. ✅ **Same subject** (or starts with "Re:")
3. ✅ **In-Reply-To** header points to a message in the thread
4. ✅ **References** header contains previous Message-IDs

**Before fix**: Only #1 and #2 were correct
**After fix**: All 4 criteria are met ✨

## 🔍 Debugging Tips

### Check Threading in Database
```sql
SELECT 
  contact_email,
  touchpoints_sent,
  thread_id,
  last_message_id,
  status
FROM prospects
WHERE send_sequence = true
ORDER BY last_contact_date DESC;
```

### Check Thread in Gmail
```
URL format:
https://mail.google.com/mail/u/0/#thread/[thread_id]

Example:
https://mail.google.com/mail/u/0/#thread/18c4a2b3f5e6d7c8
```

### Console Logs to Add
```typescript
// In sendFollowUpEmail()
console.log('🧵 Threading info:', {
  threadId: prospect.threadId,
  lastMessageId: prospect.lastMessageId,
  touchpoint: nextTouchpoint
});

// In gmail.ts sendEmail()
console.log('📧 Sending with headers:', {
  threadId,
  inReplyTo: lastMessageId,
  referencesCount: allMessageIds.length
});
```

