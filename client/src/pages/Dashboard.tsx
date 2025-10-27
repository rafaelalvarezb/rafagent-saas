import { DashboardStats } from "@/components/DashboardStats";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, UserPlus, Mail, Calendar, BarChart3, Settings, Play, Eye, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface Prospect {
  id: string;
  contactName: string;
  contactEmail: string;
  companyName?: string;
  status?: string;
  touchpointsSent?: number;
  lastContactDate?: string;
  threadLink?: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();

  // Fetch real prospects
  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ["prospects"],
    queryFn: async () => {
      const response = await fetch("/api/prospects");
      if (!response.ok) throw new Error("Failed to fetch prospects");
      return response.json();
    },
  });

  // Get recent prospects (last 5 with activity)
  const recentProspects = prospects
    .filter(p => p.touchpointsSent && p.touchpointsSent > 0)
    .sort((a, b) => {
      const dateA = a.lastContactDate ? new Date(a.lastContactDate).getTime() : 0;
      const dateB = b.lastContactDate ? new Date(b.lastContactDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your sales overview</p>
        </div>
        <Button 
          onClick={() => setLocation('/prospects?add=true')}
          size="lg"
          className="gap-2"
          data-testid="button-add-prospect"
        >
          <UserPlus className="h-5 w-5" />
          Add Prospect
        </Button>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation('/prospects')}
              data-testid="button-view-all-prospects"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentProspects.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No recent activity. Start by adding prospects!
                  </p>
                </CardContent>
              </Card>
            ) : (
              recentProspects.map((prospect) => (
                <Card key={prospect.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {prospect.contactName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {prospect.companyName || prospect.contactEmail}
                        </p>
                      </div>
                      {prospect.status && (
                        <Badge variant={
                          prospect.status.includes('Interested') ? 'default' :
                          prospect.status.includes('Following') ? 'secondary' :
                          prospect.status.includes('Scheduled') ? 'default' :
                          'outline'
                        }>
                          {prospect.status}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>{prospect.touchpointsSent || 0} touchpoints sent</span>
                        {prospect.lastContactDate && (
                          <span>
                            Last: {format(new Date(prospect.lastContactDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                      {prospect.threadLink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(prospect.threadLink, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          <div className="grid gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20 transition-all"
              onClick={() => setLocation('/prospects?add=true')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Add New Prospect</div>
                  <div className="text-xs text-muted-foreground">Start a new outreach sequence</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20 transition-all"
              onClick={() => setLocation('/prospects')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Execute AI Agent</div>
                  <div className="text-xs text-muted-foreground">Process responses & send follow-ups</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20 transition-all"
              onClick={() => setLocation('/templates')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Manage Templates</div>
                  <div className="text-xs text-muted-foreground">Edit email sequences & content</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20 transition-all"
              onClick={() => setLocation('/configuration')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">Configure working hours & preferences</div>
                </div>
              </div>
            </Button>
          </div>

          {/* Performance Summary */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                This Week's Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {prospects.filter(p => p.touchpointsSent && p.touchpointsSent > 0).length}
                  </div>
                  <div className="text-xs text-green-600 font-medium">Active Sequences</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {prospects.filter(p => p.status?.includes('Interested')).length}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Interested Prospects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
