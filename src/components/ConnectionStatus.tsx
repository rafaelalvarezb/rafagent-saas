import { useWebSocket } from "@/hooks/use-websocket";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export function ConnectionStatus() {
  const socket = useWebSocket();
  const isConnected = socket?.connected || false;
  const isProduction = import.meta.env.PROD;

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <Wifi className="w-3 h-3 mr-1" />
          Live
        </Badge>
      ) : isProduction ? (
        <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
          <RefreshCw className="w-3 h-3 mr-1" />
          Polling
        </Badge>
      ) : (
        <Badge variant="destructive">
          <WifiOff className="w-3 h-3 mr-1" />
          Offline
        </Badge>
      )}
    </div>
  );
}
