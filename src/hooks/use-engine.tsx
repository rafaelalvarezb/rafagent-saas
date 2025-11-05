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
      const response = await fetch('/api/engine/status', {
        credentials: 'include', // Important for cookies/JWT
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('rafagent_token') || ''}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Forbidden: Admin access required');
        }
        throw new Error(`Failed to fetch engine status: ${response.statusText}`);
      }
      
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
      const response = await fetch('/api/engine/health', {
        credentials: 'include', // Important for cookies/JWT
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('rafagent_token') || ''}`
        }
      });
      
      if (!response.ok) {
        // If 401 or 403, user might not have access (non-admin)
        if (response.status === 401 || response.status === 403) {
          setHealth({
            isHealthy: false,
            lastCheck: new Date(),
            error: 'Unauthorized: Admin access required'
          });
          return;
        }
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      
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
