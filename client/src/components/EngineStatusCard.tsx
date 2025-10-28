import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Server, Users, Clock, AlertCircle } from "lucide-react";
import { useEngineStatus, useEngineHealth } from "@/hooks/use-engine";

export function EngineStatusCard() {
  const { status, loading, error, refetch } = useEngineStatus();
  const { health } = useEngineHealth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-red-500';
      case 'starting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthBadge = () => {
    if (health.isHealthy) {
      return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
    } else {
      return <Badge variant="destructive">Unhealthy</Badge>;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading && !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Automation Engine
          </CardTitle>
          <CardDescription>Loading engine status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Automation Engine
          </div>
          <div className="flex items-center gap-2">
            {getHealthBadge()}
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Persistent automation engine status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Failed to connect to engine</span>
          </div>
        ) : status ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.status)}`}></div>
                <span className="text-sm capitalize">{status.status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{status.activeUsers}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Users</span>
              <span className="text-sm">{status.totalUsers}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uptime</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm">{formatUptime(status.uptime)}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <span className="text-xs text-gray-500">
                Last updated: {new Date(status.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No engine data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
