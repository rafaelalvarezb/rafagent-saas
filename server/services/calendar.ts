import { google } from 'googleapis';
import { getOAuth2Client } from '../auth';

/**
 * Convert a date to a specific timezone using proper timezone handling
 */
function convertToTimezone(date: Date, timezone: string): Date {
  // Use Intl.DateTimeFormat to get proper timezone offset
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  
  // Get the timezone offset for the target timezone
  const targetOffset = getTimezoneOffset(timezone, utcDate);
  const localOffset = date.getTimezoneOffset();
  const diff = (localOffset - targetOffset) * 60000;
  
  return new Date(utcDate.getTime() + diff);
}

/**
 * Get timezone offset in minutes using proper timezone detection
 */
function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    // Use Intl.DateTimeFormat to get the actual timezone offset
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    
    if (offsetPart) {
      // Parse offset like "GMT-06:00" or "GMT+01:00"
      const offsetMatch = offsetPart.value.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (offsetMatch) {
        const sign = offsetMatch[1] === '+' ? 1 : -1;
        const hours = parseInt(offsetMatch[2]);
        const minutes = parseInt(offsetMatch[3]);
        return sign * (hours * 60 + minutes);
      }
    }
  } catch (error) {
    console.warn(`Failed to get timezone offset for ${timezone}:`, error);
  }
  
  // Fallback to known timezones
  const timezoneOffsets: Record<string, number> = {
    'America/Mexico_City': -360, // UTC-6
    'America/New_York': -300,    // UTC-5 (EST) / -240 (EDT)
    'America/Los_Angeles': -480, // UTC-8 (PST) / -420 (PDT)
    'Europe/London': 0,          // UTC+0 (GMT) / 60 (BST)
    'Europe/Paris': 60,          // UTC+1 (CET) / 120 (CEST)
    'America/Argentina/Buenos_Aires': -180, // UTC-3
  };
  
  return timezoneOffsets[timezone] || -360; // Default to Mexico City
}

/**
 * Get Calendar client with user's OAuth credentials
 * @param accessToken - User's access token
 * @param refreshToken - User's refresh token (optional, for auto-refresh)
 */
export function getCalendarClient(accessToken: string, refreshToken?: string) {
  const auth = getOAuth2Client(accessToken, refreshToken);
  return google.calendar({ version: 'v3', auth });
}

interface ScheduleMeetingParams {
  attendeeEmail: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

interface ScheduleMeetingParamsExtended extends ScheduleMeetingParams {
  accessToken: string;
  refreshToken?: string;
}

export async function scheduleMeeting(params: ScheduleMeetingParamsExtended & { userTimezone?: string }): Promise<any> {
  try {
    const calendar = getCalendarClient(params.accessToken, params.refreshToken);
    
    // Use user's timezone or default to Mexico City
    const timezone = params.userTimezone || 'America/Mexico_City';
    
    console.log(`🗓️ Scheduling meeting in timezone: ${timezone}`);
    console.log(`📅 Start time (UTC): ${params.startTime.toISOString()}`);
    console.log(`📅 End time (UTC): ${params.endTime.toISOString()}`);
    
    // Convert times to user's timezone for display
    const startInUserTz = new Date(params.startTime.toLocaleString("en-US", { timeZone: timezone }));
    const endInUserTz = new Date(params.endTime.toLocaleString("en-US", { timeZone: timezone }));
    
    console.log(`🕐 Start time (${timezone}): ${startInUserTz.toLocaleString()}`);
    console.log(`🕐 End time (${timezone}): ${endInUserTz.toLocaleString()}`);
    
    // Verify the times are in working hours
    const startHour = startInUserTz.getHours();
    const endHour = endInUserTz.getHours();
    
    console.log(`⏰ Meeting hours: ${startHour}:00 - ${endHour}:00 (${timezone})`);
    
    if (startHour < 9 || startHour > 22) {
      console.warn(`⚠️ Warning: Meeting scheduled outside typical working hours (${startHour}:00)`);
    }
    
    const event = {
      summary: params.title,
      description: params.description,
      start: {
        dateTime: params.startTime.toISOString(),
        timeZone: timezone,
      },
      end: {
        dateTime: params.endTime.toISOString(),
        timeZone: timezone,
      },
      attendees: [
        { email: params.attendeeEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      sendUpdates: 'all' as const
    };

    console.log(`📝 Creating event with timezone: ${timezone}`);
    console.log(`📝 Event start: ${params.startTime.toISOString()}`);
    console.log(`📝 Event end: ${params.endTime.toISOString()}`);

    const result = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all', // CRITICAL: Send email invitations to attendees
      requestBody: event,
    });

    // Extract Google Meet link
    const meetLink = result.data.conferenceData?.entryPoints?.[0]?.uri || 
                     result.data.hangoutLink || 
                     null;

    console.log(`✅ Meeting scheduled successfully: ${result.data.id}`);
    console.log(`🔗 Meet link: ${meetLink}`);
    console.log(`📅 Final meeting time: ${startInUserTz.toLocaleString()} (${timezone})`);

    return {
      ...result.data,
      meetLink
    };
  } catch (error: any) {
    console.error('❌ Error scheduling meeting:', {
      attendee: params.attendeeEmail,
      startTime: params.startTime,
      timezone: params.userTimezone,
      message: error.message,
      code: error.code
    });
    throw new Error(`Failed to schedule meeting: ${error.message}`);
  }
}

export async function getAvailableSlots(
  accessToken: string,
  startDate: Date,
  endDate: Date,
  workStartHour: number,
  workEndHour: number,
  timezone: string = 'America/Mexico_City',
  refreshToken?: string,
  workingDays?: string[]
): Promise<Date[]> {
  const calendar = getCalendarClient(accessToken, refreshToken);
  
  console.log(`🔍 Getting available slots for timezone: ${timezone}`);
  console.log(`📅 Search period: ${startDate.toISOString()} to ${endDate.toISOString()}`);
  console.log(`🕐 Working hours: ${workStartHour}:00 - ${workEndHour}:00`);
  
  // Get busy events from Google Calendar
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const busySlots = (events.data.items || []).map(event => ({
    start: new Date(event.start?.dateTime || event.start?.date || ''),
    end: new Date(event.end?.dateTime || event.end?.date || ''),
  }));

  console.log(`📊 Found ${busySlots.length} busy slots`);

  const availableSlots: Date[] = [];

  // Convert workingDays to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMap: Record<string, number> = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6
  };
  
  const workingDayNumbers = workingDays 
    ? workingDays.map(day => dayMap[day.toLowerCase()]).filter(n => n !== undefined)
    : [1, 2, 3, 4, 5]; // Default: Monday-Friday

  console.log(`📅 Working days: ${workingDayNumbers.join(', ')}`);

  // Ensure minimum 24-hour gap from now
  const minTime = new Date();
  minTime.setHours(minTime.getHours() + 24);
  console.log(`⏰ Minimum time (24h from now): ${minTime.toISOString()}`);

  // Create a date in the user's timezone for each day
  const currentDate = new Date(startDate);
  
  console.log(`📅 Starting date iteration from: ${currentDate.toISOString()}`);
  console.log(`📅 End date: ${endDate.toISOString()}`);
  
  while (currentDate < endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Check if this day is a working day based on user's configuration
    if (workingDayNumbers.includes(dayOfWeek)) {
      console.log(`📅 Checking ${currentDate.toDateString()} (day ${dayOfWeek})`);
      
      // Create start and end times in the user's timezone
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const date = currentDate.getDate();
      
      // Create dates in user's timezone
      const dayStartInUserTz = new Date(year, month, date, workStartHour, 0, 0, 0);
      const dayEndInUserTz = new Date(year, month, date, workEndHour, 0, 0, 0);
      
      console.log(`🕐 Working hours in user timezone: ${dayStartInUserTz.toLocaleString()} to ${dayEndInUserTz.toLocaleString()} (${timezone})`);
      
      // Convert to UTC for Google Calendar API using a simpler approach
      // Create the date in the user's timezone, then convert to UTC
      const dayStartUTC = new Date(dayStartInUserTz.toLocaleString("en-US", { timeZone: "UTC" }));
      const dayEndUTC = new Date(dayEndInUserTz.toLocaleString("en-US", { timeZone: "UTC" }));
      
      console.log(`🕐 User time: ${dayStartInUserTz.toLocaleString()} -> UTC: ${dayStartUTC.toISOString()}`);
      console.log(`🕐 User time: ${dayEndInUserTz.toLocaleString()} -> UTC: ${dayEndUTC.toISOString()}`);
      
      let slotTime = new Date(dayStartUTC);
      let slotsAddedForThisDay = 0;
      
      while (slotTime < dayEndUTC) {
        const slotEnd = new Date(slotTime.getTime() + 30 * 60000);
        
        const isConflict = busySlots.some(busy => {
          return slotTime < busy.end && slotEnd > busy.start;
        });
        
        // Only add slots that are at least 24 hours in the future
        if (!isConflict && slotTime > minTime) {
          availableSlots.push(new Date(slotTime));
          slotsAddedForThisDay++;
          
          // Log the slot in user's timezone for debugging
          const slotInUserTz = new Date(slotTime.toLocaleString("en-US", { timeZone: timezone }));
          console.log(`✅ Available slot: ${slotInUserTz.toLocaleString()} (${timezone})`);
        }
        
        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }
      
      console.log(`📊 Added ${slotsAddedForThisDay} slots for ${currentDate.toDateString()}`);
    } else {
      console.log(`⏭️ Skipping ${currentDate.toDateString()} (day ${dayOfWeek}) - not a working day`);
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`📅 Found ${availableSlots.length} available slots`);
  
  // Log first few available slots for debugging
  if (availableSlots.length > 0) {
    console.log(`🕐 First 3 available slots:`);
    availableSlots.slice(0, 3).forEach((slot, index) => {
      const localTime = new Date(slot.toLocaleString("en-US", { timeZone: timezone }));
      console.log(`  ${index + 1}. ${localTime.toLocaleString()} (${timezone})`);
    });
  }
  
  return availableSlots;
}

export function findNextAvailableSlot(
  availableSlots: Date[],
  preferredDays?: string[],
  preferredTime?: string,
  preferredWeek?: string,
  userTimezone?: string
): Date | null {
  console.log(`🔍 SIMPLIFIED SCHEDULING - Finding slot with:`, { 
    preferredDays, 
    preferredTime, 
    preferredWeek, 
    totalSlots: availableSlots.length,
    userTimezone: userTimezone || 'America/Mexico_City'
  });
  
  if (availableSlots.length === 0) {
    console.log(`❌ No available slots found`);
    return null;
  }

  const timezone = userTimezone || 'America/Mexico_City';
  const dayMap: Record<string, number> = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6
  };

  // Ensure minimum 24-hour gap from now
  const minTime = new Date();
  minTime.setHours(minTime.getHours() + 24);
  console.log(`⏰ Minimum time (24h from now): ${minTime.toISOString()}`);
  
  let filteredSlots = availableSlots.filter(slot => slot >= minTime);
  console.log(`📅 After 24h filter: ${filteredSlots.length} slots`);

  // STEP 1: Convert all slots to user timezone and sort by date
  const slotsInUserTz = filteredSlots.map(slot => {
    const slotInUserTz = new Date(slot.toLocaleString("en-US", { timeZone: timezone }));
    return {
      utc: slot,
      user: slotInUserTz,
      dayOfWeek: slotInUserTz.getDay(),
      hour: slotInUserTz.getHours(),
      minute: slotInUserTz.getMinutes()
    };
  }).sort((a, b) => a.utc.getTime() - b.utc.getTime());

  console.log(`📅 First 5 slots in user timezone:`);
  slotsInUserTz.slice(0, 5).forEach((slot, index) => {
    console.log(`  ${index + 1}. ${slot.user.toLocaleString()} (${timezone}) - day ${slot.dayOfWeek}`);
  });

  // STEP 2: Try to match preferred day(s) if specified
  let dayFilteredSlots = slotsInUserTz;
  
  if (preferredDays && preferredDays.length > 0) {
    const preferredDayNumbers = preferredDays
      .map(d => dayMap[d.toLowerCase()])
      .filter(n => n !== undefined);
    
    console.log(`🗓️ Preferred day numbers: ${preferredDayNumbers} (${preferredDays.join(', ')})`);
    
    if (preferredDayNumbers.length > 0) {
      const beforeFilter = slotsInUserTz.length;
      dayFilteredSlots = slotsInUserTz.filter(slot => {
        const matches = preferredDayNumbers.includes(slot.dayOfWeek);
        if (matches) {
          console.log(`✅ Day match: ${slot.user.toLocaleString()} (${timezone}) - day ${slot.dayOfWeek}`);
        }
        return matches;
      });
      
      console.log(`📅 After day filter: ${dayFilteredSlots.length} slots (was ${beforeFilter})`);
      
      // FALLBACK: If no slots on preferred day, use any weekday (Mon-Fri)
      if (dayFilteredSlots.length === 0) {
        console.log(`⚠️ No slots available on preferred day(s): ${preferredDays.join(', ')}`);
        console.log(`🔄 FALLBACK: Looking for slots on any weekday (Mon-Fri)`);
        
        dayFilteredSlots = slotsInUserTz.filter(slot => {
          return slot.dayOfWeek >= 1 && slot.dayOfWeek <= 5; // Monday to Friday
        });
        
        console.log(`📅 After fallback filter (weekdays only): ${dayFilteredSlots.length} slots`);
      } else {
        console.log(`📅 First 3 matching days: ${dayFilteredSlots.slice(0, 3).map(s => s.utc.toISOString()).join(', ')}`);
      }
    }
  }

  // STEP 3: Try to match preferred time if specified
  let timeFilteredSlots = dayFilteredSlots;
  
  if (preferredTime) {
    const [hours, minutes] = preferredTime.split(':').map(Number);
    console.log(`🕐 Looking for preferred time: ${hours}:${minutes} (${timezone})`);
    
    // First try exact match (within 30 minutes)
    let exactMatch = dayFilteredSlots.filter(slot => {
      const isExactMatch = slot.hour === hours && Math.abs(slot.minute - minutes) <= 30;
      if (isExactMatch) {
        console.log(`🎯 Found exact match: ${slot.user.toLocaleString()} (${timezone})`);
      }
      return isExactMatch;
    });
    
    console.log(`🎯 Exact time matches: ${exactMatch.length}`);
    if (exactMatch.length > 0) {
      console.log(`✅ Using exact match: ${exactMatch[0].utc.toISOString()}`);
      return exactMatch[0].utc;
    }
    
    // If no exact match, try to find the closest time within 2 hours
    const beforeTimeFilter = dayFilteredSlots.length;
    timeFilteredSlots = dayFilteredSlots.filter(slot => {
      const slotTimeInMinutes = slot.hour * 60 + slot.minute;
      const preferredTimeInMinutes = hours * 60 + minutes;
      const timeDiff = Math.abs(slotTimeInMinutes - preferredTimeInMinutes);
      
      const isWithinRange = timeDiff <= 120; // Within 2 hours
      
      if (isWithinRange) {
        console.log(`🕐 Found close match: ${slot.user.toLocaleString()} (${timezone}) - diff: ${timeDiff} minutes`);
      }
      
      return isWithinRange;
    });
    
    console.log(`📅 After time filter (±2h): ${timeFilteredSlots.length} slots (was ${beforeTimeFilter})`);
    
    // Sort by closest to preferred time
    timeFilteredSlots.sort((a, b) => {
      const aTimeInMinutes = a.hour * 60 + a.minute;
      const bTimeInMinutes = b.hour * 60 + b.minute;
      const preferredTimeInMinutes = hours * 60 + minutes;
      const aDiff = Math.abs(aTimeInMinutes - preferredTimeInMinutes);
      const bDiff = Math.abs(bTimeInMinutes - preferredTimeInMinutes);
      return aDiff - bDiff;
    });
  }

  const result = timeFilteredSlots.length > 0 ? timeFilteredSlots[0].utc : null;
  console.log(`🎯 Final selected slot: ${result ? result.toISOString() : 'NONE'}`);
  
  if (result) {
    const resultInUserTz = new Date(result.toLocaleString("en-US", { timeZone: timezone }));
    console.log(`🕐 Selected slot in user timezone: ${resultInUserTz.toLocaleString()} (${timezone})`);
  }
  
  return result;
}

// Helper function to get day name from number
function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
}
