import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Calendar, MessageSquare, Eye, Reply } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api";

interface TimelineItem {
  id: string;
  type: "email" | "call" | "meeting" | "note" | "opened" | "replied";
  title: string;
  description: string;
  timestamp: string;
}

interface Prospect {
  id: string;
  contactName: string;
  contactEmail: string;
  companyName: string;
  status: string;
  emailOpened: boolean;
  emailOpenedAt: string | null;
  lastContactDate: string | null;
  touchpointsSent: number;
  repliedAt: string | null;
  meetingTime: string | null;
}

const iconMap = {
  email: Mail,
  call: Phone,
  meeting: Calendar,
  note: MessageSquare,
  opened: Eye,
  replied: Reply,
};

const colorMap = {
  email: "text-primary",
  call: "text-success",
  meeting: "text-info",
  note: "text-warning",
  opened: "text-blue-500",
  replied: "text-green-500",
};

export function ActivityTimeline() {
  const { data: prospects, isLoading } = useQuery<Prospect[]>({
    queryKey: ["prospects"],
    queryFn: async () => {
      const response = await apiCall("/prospects");
      if (!response.ok) throw new Error("Failed to fetch prospects");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card data-testid="card-activity-timeline">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading activities...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate activities from prospects data
  const activities: TimelineItem[] = [];
  
  if (prospects) {
    prospects.forEach((prospect) => {
      // Add email sent activity
      if (prospect.touchpointsSent > 0 && prospect.lastContactDate) {
        activities.push({
          id: `${prospect.id}-email-sent`,
          type: "email",
          title: `Email sent to ${prospect.contactName}`,
          description: `${prospect.touchpointsSent} touchpoint(s) sent - ${prospect.companyName}`,
          timestamp: new Date(prospect.lastContactDate).toLocaleString(),
        });
      }

      // Add email opened activity
      if (prospect.emailOpened && prospect.emailOpenedAt) {
        activities.push({
          id: `${prospect.id}-email-opened`,
          type: "opened",
          title: `${prospect.contactName} opened email`,
          description: `Email opened at ${prospect.companyName}`,
          timestamp: new Date(prospect.emailOpenedAt).toLocaleString(),
        });
      }

      // Add reply activity
      if (prospect.repliedAt) {
        activities.push({
          id: `${prospect.id}-replied`,
          type: "replied",
          title: `${prospect.contactName} replied`,
          description: `Status: ${prospect.status} - ${prospect.companyName}`,
          timestamp: new Date(prospect.repliedAt).toLocaleString(),
        });
      }

      // Add meeting scheduled activity
      if (prospect.meetingTime) {
        activities.push({
          id: `${prospect.id}-meeting`,
          type: "meeting",
          title: `Meeting scheduled with ${prospect.contactName}`,
          description: `Google Meet - ${prospect.companyName}`,
          timestamp: new Date(prospect.meetingTime).toLocaleString(),
        });
      }
    });
  }

  // Sort by timestamp (most recent first)
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card data-testid="card-activity-timeline">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-muted-foreground">No recent activity</div>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = iconMap[activity.type];
                const colorClass = colorMap[activity.type];
                return (
                  <div key={activity.id} className="flex gap-3" data-testid={`timeline-item-${activity.id}`}>
                    <div className="relative">
                      <div className={`rounded-md p-2 bg-card border ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {index < activities.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium" data-testid={`text-activity-title-${activity.id}`}>{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
