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
      
      // Convert to UTC for Google Calendar API
      // For Mexico City (UTC-6), we need to add 6 hours to get UTC
      const timezoneOffset = getTimezoneOffset(timezone, dayStartInUserTz);
      const dayStartUTC = new Date(dayStartInUserTz.getTime() - (timezoneOffset * 60000));
      const dayEndUTC = new Date(dayEndInUserTz.getTime() - (timezoneOffset * 60000));
      
      // Debug: Show the conversion
      console.log(`🕐 Timezone offset: ${timezoneOffset} minutes`);
      console.log(`🕐 User time: ${dayStartInUserTz.toLocaleString()} -> UTC: ${dayStartUTC.toISOString()}`);
      
      console.log(`🕐 UTC times: ${dayStartUTC.toISOString()} to ${dayEndUTC.toISOString()}`);
      
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
  console.log(`🔍 Finding slot with:`, { 
    preferredDays, 
    preferredTime, 
    preferredWeek, 
    totalSlots: availableSlots.length,
    userTimezone: userTimezone || 'America/Mexico_City'
  });
  
  if (availableSlots.length === 0) return null;

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

  // STEP 1: Try to match preferred day(s) if specified
  let dayFilteredSlots = filteredSlots;
  let usedFallbackForDay = false;
  
  if (preferredDays && preferredDays.length > 0) {
    const preferredDayNumbers = preferredDays
      .map(d => dayMap[d.toLowerCase()])
      .filter(n => n !== undefined);
    
    console.log(`🗓️ Preferred day numbers: ${preferredDayNumbers} (${preferredDays.join(', ')})`);
    
    if (preferredDayNumbers.length > 0) {
      const beforeFilter = filteredSlots.length;
      
      // Convert slots to user timezone before checking day of week
      dayFilteredSlots = filteredSlots.filter(slot => {
        const slotInUserTz = new Date(slot.toLocaleString("en-US", { timeZone: timezone }));
        const dayOfWeek = slotInUserTz.getDay();
        const matches = preferredDayNumbers.includes(dayOfWeek);
        
        if (matches) {
          console.log(`✅ Day match: ${slotInUserTz.toLocaleString()} (${timezone}) - day ${dayOfWeek}`);
        }
        
        return matches;
      });
      
      console.log(`📅 After day filter: ${dayFilteredSlots.length} slots (was ${beforeFilter})`);
      
      // FALLBACK: If no slots on preferred day, use any weekday (Mon-Fri)
      if (dayFilteredSlots.length === 0) {
        console.log(`⚠️ No slots available on preferred day(s): ${preferredDays.join(', ')}`);
        console.log(`🔄 FALLBACK: Looking for slots on any weekday (Mon-Fri)`);
        
        dayFilteredSlots = filteredSlots.filter(slot => {
          const slotInUserTz = new Date(slot.toLocaleString("en-US", { timeZone: timezone }));
          const day = slotInUserTz.getDay();
          return day >= 1 && day <= 5; // Monday to Friday
        });
        
        console.log(`📅 After fallback filter (weekdays only): ${dayFilteredSlots.length} slots`);
        usedFallbackForDay = true;
      } else {
        console.log(`📅 First 3 matching days: ${dayFilteredSlots.slice(0, 3).map(s => s.toISOString()).join(', ')}`);
      }
    }
  }

  // STEP 2: Try to match preferred time if specified
  let timeFilteredSlots = dayFilteredSlots;
  
  if (preferredTime) {
    const [hours, minutes] = preferredTime.split(':').map(Number);
    console.log(`🕐 Looking for preferred time: ${hours}:${minutes} (${timezone})`);
    
    // First try exact match (within 30 minutes)
    let exactMatch = dayFilteredSlots.filter(slot => {
      const slotInUserTz = new Date(slot.toLocaleString("en-US", { timeZone: timezone }));
      const slotHours = slotInUserTz.getHours();
      const slotMinutes = slotInUserTz.getMinutes();
      const isExactMatch = slotHours === hours && Math.abs(slotMinutes - minutes) <= 30;
      
      if (isExactMatch) {
        console.log(`🎯 Found exact match: ${slotInUserTz.toLocaleString()} (${timezone})`);
      }
      
      return isExactMatch;
    });
    
    console.log(`🎯 Exact time matches: ${exactMatch.length}`);
    if (exactMatch.length > 0) {
      console.log(`✅ Using exact match: ${exactMatch[0].toISOString()}`);
      if (usedFallbackForDay) {
        console.log(`⚠️ Note: Used fallback day (preferred day was not available)`);
      }
      return exactMatch[0];
    }
    
    // If no exact match, try to find the closest time within 2 hours
    const beforeTimeFilter = dayFilteredSlots.length;
    timeFilteredSlots = dayFilteredSlots.filter(slot => {
      const slotInUserTz = new Date(slot.toLocaleString("en-US", { timeZone: timezone }));
      const slotHours = slotInUserTz.getHours();
      const slotMinutes = slotInUserTz.getMinutes();
      const slotTimeInMinutes = slotHours * 60 + slotMinutes;
      const preferredTimeInMinutes = hours * 60 + minutes;
      const timeDiff = Math.abs(slotTimeInMinutes - preferredTimeInMinutes);
      
      const isWithinRange = timeDiff <= 120; // Within 2 hours
      
      if (isWithinRange) {
        console.log(`🕐 Found close match: ${slotInUserTz.toLocaleString()} (${timezone}) - diff: ${timeDiff} minutes`);
      }
      
      return isWithinRange;
    });
    
    console.log(`📅 After time filter (±2h): ${timeFilteredSlots.length} slots (was ${beforeTimeFilter})`);
    
    // Sort by closest to preferred time
    timeFilteredSlots.sort((a, b) => {
      const aInUserTz = new Date(a.toLocaleString("en-US", { timeZone: timezone }));
      const bInUserTz = new Date(b.toLocaleString("en-US", { timeZone: timezone }));
      const aTimeInMinutes = aInUserTz.getHours() * 60 + aInUserTz.getMinutes();
      const bTimeInMinutes = bInUserTz.getHours() * 60 + bInUserTz.getMinutes();
      const preferredTimeInMinutes = hours * 60 + minutes;
      const aDiff = Math.abs(aTimeInMinutes - preferredTimeInMinutes);
      const bDiff = Math.abs(bTimeInMinutes - preferredTimeInMinutes);
      return aDiff - bDiff;
    });
  }

  const result = timeFilteredSlots.length > 0 ? timeFilteredSlots[0] : null;
  console.log(`🎯 Final selected slot: ${result ? result.toISOString() : 'NONE'}`);
  
  if (result) {
    const resultInUserTz = new Date(result.toLocaleString("en-US", { timeZone: timezone }));
    console.log(`🕐 Selected slot in user timezone: ${resultInUserTz.toLocaleString()} (${timezone})`);
  }
  
  if (usedFallbackForDay && result) {
    console.log(`⚠️ Used fallback logic: preferred day not available, selected ${getDayName(result.getDay())} instead`);
  }
  
  return result;
}

// Helper function to get day name from number
function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
}
