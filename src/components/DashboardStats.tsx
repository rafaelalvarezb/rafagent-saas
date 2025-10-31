import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Eye, MessageCircle, Calendar, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api";
import { AnimatedNumber } from "@/components/AnimatedNumber";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`} className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-10 rounded-full -mr-10 -mt-10`}></div>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`${color.replace('bg-', 'text-')} opacity-80`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <AnimatedNumber 
            value={parseInt(value) || 0} 
            duration={800}
            className="inline-block"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface Analytics {
  totalSent: number;
  totalOpened: number;
  totalReplied: number;
  totalMeetingsScheduled: number;
}

export function DashboardStats() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await apiCall("/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Sent",
      value: analytics?.totalSent.toString() || "0",
      icon: <Send className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      title: "Total Opened",
      value: analytics?.totalOpened.toString() || "0",
      icon: <Eye className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Replied",
      value: analytics?.totalReplied.toString() || "0",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      title: "Meetings Scheduled",
      value: analytics?.totalMeetingsScheduled.toString() || "0",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
