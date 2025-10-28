// Configuration for RafAgent Hybrid Architecture
// This file manages the connection between frontend and persistent engine

export const ENGINE_CONFIG = {
  // URL of the persistent engine (Railway/Render)
  BASE_URL: process.env.ENGINE_URL || 'http://localhost:3001',
  
  // API endpoints for engine communication
  ENDPOINTS: {
    HEALTH: '/health',
    STATUS: '/api/status',
    RUN_AGENT: '/api/agent/run',
    WEBSOCKET: '/ws'
  },
  
  // Retry configuration for engine calls
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};

// Helper function to get full engine URL
export function getEngineUrl(endpoint: string): string {
  return `${ENGINE_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to check if engine is available
export async function checkEngineHealth(): Promise<boolean> {
  try {
    const response = await fetch(getEngineUrl(ENGINE_CONFIG.ENDPOINTS.HEALTH));
    return response.ok;
  } catch (error) {
    console.error('Engine health check failed:', error);
    return false;
  }
}

// Helper function to call engine API with retry logic
export async function callEngineAPI(endpoint: string, options: RequestInit = {}): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= ENGINE_CONFIG.RETRY.MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(getEngineUrl(endpoint), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (response.ok) {
        return response;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Engine API call attempt ${attempt} failed:`, error);
      
      if (attempt < ENGINE_CONFIG.RETRY.MAX_ATTEMPTS) {
        const delay = ENGINE_CONFIG.RETRY.DELAY_MS * Math.pow(ENGINE_CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Engine API call failed after all retries');
}
