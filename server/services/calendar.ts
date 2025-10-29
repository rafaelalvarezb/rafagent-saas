import { google } from 'googleapis';
import { getOAuth2Client } from '../auth';

/**
 * Convert a date to a specific timezone
 */
function convertToTimezone(date: Date, timezone: string): Date {
  // Create a new date in the target timezone
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const targetTime = new Date(utc);
  
  // Get timezone offset for the target timezone
  const targetOffset = getTimezoneOffset(timezone, targetTime);
  const localOffset = date.getTimezoneOffset();
  const diff = (localOffset - targetOffset) * 60000;
  
  return new Date(utc + diff);
}

/**
 * Get timezone offset in minutes
 */
function getTimezoneOffset(timezone: string, date: Date): number {
  // This is a simplified version - in production you'd want to use a proper timezone library
  const timezoneOffsets: Record<string, number> = {
    'America/Mexico_City': -360, // UTC-6
    'America/New_York': -300,    // UTC-5
    'America/Los_Angeles': -480, // UTC-8
    'Europe/London': 0,          // UTC+0
    'Europe/Paris': 60,          // UTC+1
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

    return {
      ...result.data,
      meetLink
    };
  } catch (error: any) {
    console.error('❌ Error scheduling meeting:', {
      attendee: params.attendeeEmail,
      startTime: params.startTime,
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
  
  // Convert dates to user's timezone for proper comparison
  const userStartDate = convertToTimezone(startDate, timezone);
  const userEndDate = convertToTimezone(endDate, timezone);
  
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: userStartDate.toISOString(),
    timeMax: userEndDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const busySlots = (events.data.items || []).map(event => ({
    start: new Date(event.start?.dateTime || event.start?.date || ''),
    end: new Date(event.end?.dateTime || event.end?.date || ''),
  }));

  const availableSlots: Date[] = [];
  const currentDate = new Date(userStartDate);

  // Convert workingDays to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMap: Record<string, number> = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6
  };
  
  const workingDayNumbers = workingDays 
    ? workingDays.map(day => dayMap[day.toLowerCase()]).filter(n => n !== undefined)
    : [1, 2, 3, 4, 5]; // Default: Monday-Friday

  console.log(`🕐 Working hours: ${workStartHour}:00 - ${workEndHour}:00 in ${timezone}`);
  console.log(`📅 Working days: ${workingDayNumbers.join(', ')}`);

  while (currentDate < userEndDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Check if this day is a working day based on user's configuration
    if (workingDayNumbers.includes(dayOfWeek)) {
      // Create day start and end times in user's timezone
      const dayStart = new Date(currentDate);
      dayStart.setHours(workStartHour, 0, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(workEndHour, 0, 0, 0);
      
      let slotTime = new Date(dayStart);
      
      while (slotTime < dayEnd) {
        const slotEnd = new Date(slotTime.getTime() + 30 * 60000);
        
        const isConflict = busySlots.some(busy => {
          return slotTime < busy.end && slotEnd > busy.start;
        });
        
        // Only add slots that are at least 24 hours in the future
        const minTime = new Date();
        minTime.setHours(minTime.getHours() + 24);
        
        if (!isConflict && slotTime > minTime) {
          // Convert back to UTC for storage
          const utcSlot = new Date(slotTime.getTime() - (slotTime.getTimezoneOffset() * 60000));
          availableSlots.push(utcSlot);
        }
        
        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`📅 Found ${availableSlots.length} available slots`);
  return availableSlots;
}

export function findNextAvailableSlot(
  availableSlots: Date[],
  preferredDays?: string[],
  preferredTime?: string,
  preferredWeek?: string
): Date | null {
  console.log(`🔍 Finding slot with:`, { preferredDays, preferredTime, preferredWeek, totalSlots: availableSlots.length });
  
  if (availableSlots.length === 0) return null;

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
      dayFilteredSlots = filteredSlots.filter(slot => 
        preferredDayNumbers.includes(slot.getDay())
      );
      console.log(`📅 After day filter: ${dayFilteredSlots.length} slots (was ${beforeFilter})`);
      
      // FALLBACK: If no slots on preferred day, use any weekday (Mon-Fri)
      if (dayFilteredSlots.length === 0) {
        console.log(`⚠️ No slots available on preferred day(s): ${preferredDays.join(', ')}`);
        console.log(`🔄 FALLBACK: Looking for slots on any weekday (Mon-Fri)`);
        
        dayFilteredSlots = filteredSlots.filter(slot => {
          const day = slot.getDay();
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
    console.log(`🕐 Looking for preferred time: ${hours}:${minutes}`);
    
    // First try exact match
    let exactMatch = dayFilteredSlots.filter(slot => 
      slot.getHours() === hours && slot.getMinutes() === minutes
    );
    
    console.log(`🎯 Exact time matches: ${exactMatch.length}`);
    if (exactMatch.length > 0) {
      console.log(`✅ Found exact match: ${exactMatch[0].toISOString()}`);
      if (usedFallbackForDay) {
        console.log(`⚠️ Note: Used fallback day (preferred day was not available)`);
      }
      return exactMatch[0];
    }
    
    // If no exact match, try to find the closest time within 1 hour
    const beforeTimeFilter = dayFilteredSlots.length;
    timeFilteredSlots = dayFilteredSlots.filter(slot => {
      const slotHours = slot.getHours();
      const slotMinutes = slot.getMinutes();
      const slotTimeInMinutes = slotHours * 60 + slotMinutes;
      const preferredTimeInMinutes = hours * 60 + minutes;
      const timeDiff = Math.abs(slotTimeInMinutes - preferredTimeInMinutes);
      return timeDiff <= 60; // Within 1 hour
    });
    
    console.log(`📅 After time filter (±1h): ${timeFilteredSlots.length} slots (was ${beforeTimeFilter})`);
    
    // Sort by closest to preferred time
    timeFilteredSlots.sort((a, b) => {
      const aTimeInMinutes = a.getHours() * 60 + a.getMinutes();
      const bTimeInMinutes = b.getHours() * 60 + b.getMinutes();
      const preferredTimeInMinutes = hours * 60 + minutes;
      const aDiff = Math.abs(aTimeInMinutes - preferredTimeInMinutes);
      const bDiff = Math.abs(bTimeInMinutes - preferredTimeInMinutes);
      return aDiff - bDiff;
    });
  }

  const result = timeFilteredSlots.length > 0 ? timeFilteredSlots[0] : null;
  console.log(`🎯 Final selected slot: ${result ? result.toISOString() : 'NONE'}`);
  
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
