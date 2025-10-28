import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Mail, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CampaignCardProps {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  totalProspects: number;
  sentEmails: number;
  responseRate: number;
  currentTouchpoint: number;
}

export function CampaignCard({
  id,
  name,
  status,
  totalProspects,
  sentEmails,
  responseRate,
  currentTouchpoint,
}: CampaignCardProps) {
  const progress = (sentEmails / (totalProspects * 4)) * 100;

  const statusConfig = {
    active: { label: "Active", className: "bg-success text-success-foreground border-success-border" },
    paused: { label: "Paused", className: "bg-warning text-warning-foreground border-warning-border" },
    completed: { label: "Completed", className: "bg-muted text-muted-foreground border-muted-border" },
  };

  return (
    <Card className="hover-elevate" data-testid={`card-campaign-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg" data-testid={`text-campaign-name-${id}`}>{name}</CardTitle>
          <Badge className={`border ${statusConfig[status].className}`}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Campaign Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Prospects</p>
              <p className="text-sm font-medium" data-testid={`text-prospects-${id}`}>{totalProspects}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Emails Sent</p>
              <p className="text-sm font-medium" data-testid={`text-emails-sent-${id}`}>{sentEmails}</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Response Rate</p>
              <p className="text-lg font-semibold text-success" data-testid={`text-response-rate-${id}`}>{responseRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Current Touchpoint</p>
              <p className="text-lg font-semibold" data-testid={`text-touchpoint-${id}`}>{currentTouchpoint}/4</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {status === "active" ? (
            <Button variant="outline" size="sm" className="flex-1" data-testid={`button-pause-${id}`}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1" data-testid={`button-resume-${id}`}>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
          <Button size="sm" className="flex-1" data-testid={`button-view-details-${id}`}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
