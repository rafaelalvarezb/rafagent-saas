import React, { useState, useEffect } from 'react';

interface TimezoneOption {
  id: string;
  name: string;
  offset: string;
  region: string;
}

interface TimezoneSelectorProps {
  currentTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // Americas - North
  { id: 'America/New_York', name: 'Eastern Time (US & Canada)', offset: 'GMT-5', region: 'North America' },
  { id: 'America/Chicago', name: 'Central Time (US & Canada)', offset: 'GMT-6', region: 'North America' },
  { id: 'America/Denver', name: 'Mountain Time (US & Canada)', offset: 'GMT-7', region: 'North America' },
  { id: 'America/Los_Angeles', name: 'Pacific Time (US & Canada)', offset: 'GMT-8', region: 'North America' },
  { id: 'America/Mexico_City', name: 'Central Time (Mexico)', offset: 'GMT-6', region: 'North America' },
  { id: 'America/Toronto', name: 'Eastern Time (Canada)', offset: 'GMT-5', region: 'North America' },
  { id: 'America/Vancouver', name: 'Pacific Time (Canada)', offset: 'GMT-8', region: 'North America' },

  // Americas - Central & South
  { id: 'America/Argentina/Buenos_Aires', name: 'Argentina Time', offset: 'GMT-3', region: 'South America' },
  { id: 'America/Sao_Paulo', name: 'Brasilia Time', offset: 'GMT-3', region: 'South America' },
  { id: 'America/Santiago', name: 'Chile Time', offset: 'GMT-3', region: 'South America' },
  { id: 'America/Bogota', name: 'Colombia Time', offset: 'GMT-5', region: 'South America' },
  { id: 'America/Lima', name: 'Peru Time', offset: 'GMT-5', region: 'South America' },
  { id: 'America/Caracas', name: 'Venezuela Time', offset: 'GMT-4', region: 'South America' },

  // Europe
  { id: 'Europe/London', name: 'Greenwich Mean Time', offset: 'GMT+0', region: 'Europe' },
  { id: 'Europe/Paris', name: 'Central European Time', offset: 'GMT+1', region: 'Europe' },
  { id: 'Europe/Madrid', name: 'Central European Time (Spain)', offset: 'GMT+1', region: 'Europe' },
  { id: 'Europe/Berlin', name: 'Central European Time (Germany)', offset: 'GMT+1', region: 'Europe' },
  { id: 'Europe/Rome', name: 'Central European Time (Italy)', offset: 'GMT+1', region: 'Europe' },

  // Asia
  { id: 'Asia/Tokyo', name: 'Japan Standard Time', offset: 'GMT+9', region: 'Asia' },
  { id: 'Asia/Shanghai', name: 'China Standard Time', offset: 'GMT+8', region: 'Asia' },
  { id: 'Asia/Kolkata', name: 'India Standard Time', offset: 'GMT+5:30', region: 'Asia' },
  { id: 'Asia/Singapore', name: 'Singapore Time', offset: 'GMT+8', region: 'Asia' },

  // Australia
  { id: 'Australia/Sydney', name: 'Australian Eastern Time', offset: 'GMT+10', region: 'Australia' },
];

export default function TimezoneSelector({ currentTimezone, onTimezoneChange }: TimezoneSelectorProps) {
  const [selectedTimezone, setSelectedTimezone] = useState(currentTimezone);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Sync internal state when currentTimezone prop changes (e.g., after saving)
  useEffect(() => {
    setSelectedTimezone(currentTimezone);
  }, [currentTimezone]);

  // Group timezones by region
  const groupedTimezones = TIMEZONE_OPTIONS.reduce((acc, timezone) => {
    if (!acc[timezone.region]) {
      acc[timezone.region] = [];
    }
    acc[timezone.region].push(timezone);
    return acc;
  }, {} as Record<string, TimezoneOption[]>);

  // Filter timezones based on search term
  const filteredTimezones = Object.keys(groupedTimezones).reduce((acc, region) => {
    const filtered = groupedTimezones[region].filter(timezone =>
      timezone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timezone.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[region] = filtered;
    }
    return acc;
  }, {} as Record<string, TimezoneOption[]>);

  const handleTimezoneSelect = (timezone: string) => {
    setSelectedTimezone(timezone);
    onTimezoneChange(timezone);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getCurrentTimezoneInfo = () => {
    return TIMEZONE_OPTIONS.find(tz => tz.id === selectedTimezone);
  };

  const currentInfo = getCurrentTimezoneInfo();

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2 dark:text-foreground">
        Active Timezone
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-muted dark:border-border dark:text-foreground transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground dark:text-foreground">{currentInfo?.name || selectedTimezone}</div>
              <div className="text-sm text-muted-foreground dark:text-muted-foreground">{currentInfo?.offset || ''}</div>
            </div>
            <svg
              className={`w-5 h-5 text-muted-foreground dark:text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-auto dark:bg-muted dark:border-border">
            {/* Search input */}
            <div className="p-3 border-b border-border dark:border-border">
              <input
                type="text"
                placeholder="Search timezones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground dark:bg-muted dark:text-foreground dark:border-border"
              />
            </div>

            {/* Timezone options grouped by region */}
            {Object.keys(filteredTimezones).map(region => (
              <div key={region}>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted border-b border-border dark:bg-background dark:text-muted-foreground dark:border-border">
                  {region}
                </div>
                {filteredTimezones[region].map((timezone) => (
                  <button
                    key={timezone.id}
                    onClick={() => handleTimezoneSelect(timezone.id)}
                    className={`w-full px-3 py-2 text-left hover:bg-muted focus:outline-none focus:bg-muted transition-colors dark:hover:bg-background dark:focus:bg-background ${
                      selectedTimezone === timezone.id 
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' 
                        : 'text-foreground dark:text-foreground'
                    }`}
                  >
                    <div className="font-medium">{timezone.name}</div>
                    <div className="text-sm text-muted-foreground dark:text-muted-foreground">{timezone.offset}</div>
                  </button>
                ))}
              </div>
            ))}

            {Object.keys(filteredTimezones).length === 0 && (
              <div className="px-3 py-2 text-muted-foreground dark:text-muted-foreground text-center">
                No timezones found
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
        Times below are set in this timezone
      </p>
    </div>
  );
}
