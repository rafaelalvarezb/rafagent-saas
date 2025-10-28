import { useState, useEffect } from 'react';
import { ENGINE_CONFIG, checkEngineHealth, callEngineAPI } from '@/lib/engineConfig';

interface EngineStatus {
  status: string;
  activeUsers: number;
  totalUsers: number;
  uptime: number;
  timestamp: string;
}

interface EngineHealth {
  isHealthy: boolean;
  lastCheck: Date | null;
  error: string | null;
}

export function useEngineStatus() {
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use frontend server endpoint that redirects to engine
      const response = await fetch('/api/engine/status');
      const data = await response.json();
      
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch engine status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { status, loading, error, refetch: fetchStatus };
}

export function useEngineHealth() {
  const [health, setHealth] = useState<EngineHealth>({
    isHealthy: false,
    lastCheck: null,
    error: null
  });

  const checkHealth = async () => {
    try {
      // Use frontend server endpoint that redirects to engine
      const response = await fetch('/api/engine/health');
      const data = await response.json();
      
      setHealth({
        isHealthy: data.status === 'healthy',
        lastCheck: new Date(),
        error: null
      });
    } catch (error) {
      setHealth({
        isHealthy: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Health check failed'
      });
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { health, checkHealth };
}

export function useEngineAgent() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAgent = async (userId: string) => {
    try {
      setRunning(true);
      setError(null);
      
      // Use frontend server endpoint that redirects to engine
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to run agent');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run agent';
      setError(errorMessage);
      throw err;
    } finally {
      setRunning(false);
    }
  };

  return { runAgent, running, error };
}
