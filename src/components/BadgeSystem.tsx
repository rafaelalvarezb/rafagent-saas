import { Trophy, Target, Zap, Calendar, Mail, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface BadgeSystemProps {
  analytics?: {
    totalSent?: number;
    totalOpened?: number;
    totalReplied?: number;
    totalMeetingsScheduled?: number;
  };
}

/**
 * Badge/Achievement system component
 */
export function BadgeSystem({ analytics }: BadgeSystemProps) {
  const achievements: Achievement[] = [
    {
      id: "first-email",
      name: "First Steps",
      description: "Send your first email",
      icon: <Mail className="h-4 w-4" />,
      unlocked: (analytics?.totalSent || 0) >= 1,
    },
    {
      id: "email-master",
      name: "Email Master",
      description: "Send 10 emails",
      icon: <Mail className="h-4 w-4" />,
      unlocked: (analytics?.totalSent || 0) >= 10,
      progress: analytics?.totalSent || 0,
      maxProgress: 10,
    },
    {
      id: "response-king",
      name: "Response King",
      description: "Get 5 replies",
      icon: <Star className="h-4 w-4" />,
      unlocked: (analytics?.totalReplied || 0) >= 5,
      progress: analytics?.totalReplied || 0,
      maxProgress: 5,
    },
    {
      id: "meeting-guru",
      name: "Meeting Guru",
      description: "Schedule 3 meetings",
      icon: <Calendar className="h-4 w-4" />,
      unlocked: (analytics?.totalMeetingsScheduled || 0) >= 3,
      progress: analytics?.totalMeetingsScheduled || 0,
      maxProgress: 3,
    },
    {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Send 50 emails",
      icon: <Zap className="h-4 w-4" />,
      unlocked: (analytics?.totalSent || 0) >= 50,
      progress: analytics?.totalSent || 0,
      maxProgress: 50,
    },
    {
      id: "target-hit",
      name: "Target Hit",
      description: "Get 10 opens",
      icon: <Target className="h-4 w-4" />,
      unlocked: (analytics?.totalOpened || 0) >= 10,
      progress: analytics?.totalOpened || 0,
      maxProgress: 10,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <Badge variant="secondary" className="gap-1">
            {unlockedCount}/{achievements.length}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "p-3 rounded-lg border transition-all",
                achievement.unlocked
                  ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                  : "bg-muted border-border opacity-60"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={cn(
                    achievement.unlocked ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"
                  )}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-xs font-semibold truncate",
                      achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {achievement.name}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{achievement.description}</p>
              {achievement.progress !== undefined && achievement.maxProgress && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {Math.min(achievement.progress, achievement.maxProgress)}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        achievement.unlocked
                          ? "bg-yellow-500"
                          : "bg-primary"
                      )}
                      style={{
                        width: `${Math.min(
                          (achievement.progress / achievement.maxProgress) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

