import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface MeetingSchedulerProps {
  prospectName: string;
}

export function MeetingScheduler({ prospectName }: MeetingSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");

  //todo: remove mock functionality - these would come from Google Calendar API
  const availableSlots = [
    "09:00 AM",
    "10:30 AM",
    "02:00 PM",
    "03:30 PM",
    "04:00 PM",
  ];

  const handleSchedule = () => {
    console.log("Scheduling meeting for", prospectName, "on", date, "at", selectedTime);
  };

  return (
    <Card data-testid="card-meeting-scheduler">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Schedule Meeting with {prospectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return date < tomorrow;
              }}
              data-testid="calendar-meeting-date"
            />
          </div>
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Times
              </h3>
              <p className="text-xs text-muted-foreground">
                24-hour preparation gap enforced
              </p>
            </div>
            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTime(slot)}
                    data-testid={`button-time-slot-${slot.replace(/\s+/g, '-')}`}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-md">
          <p className="text-xs font-medium mb-1">Meeting Description:</p>
          <p className="text-xs text-muted-foreground">
            "Thanks for the response, I am sending this space as a proposal to talk and share what we are doing with companies from your industry"
          </p>
        </div>

        <Button
          onClick={handleSchedule}
          disabled={!date || !selectedTime}
          className="w-full"
          data-testid="button-confirm-meeting"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Confirm Meeting
        </Button>
      </CardContent>
    </Card>
  );
}
