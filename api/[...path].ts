/**
 * Vercel API Proxy - Catch-all route
 * 
 * This proxies ALL /api/* requests to Railway backend
 * Solves cookie/session issues by making everything same-origin
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = process.env.VITE_API_URL || 'https://rafagent-engine-production.up.railway.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { method, url } = req;
    
    // Build target URL
    const path = url || '/';
    const targetUrl = `${BACKEND_URL}${path}`;
    
    console.log(`[Proxy] ${method} ${path}`);
    
    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Forward important headers
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'] as string;
    }
    if (req.headers['authorization']) {
      headers['Authorization'] = req.headers['authorization'] as string;
    }
    if (req.headers['cookie']) {
      headers['Cookie'] = req.headers['cookie'] as string;
    }
    
    // Prepare body
    let body: string | undefined;
    if (method !== 'GET' && method !== 'HEAD' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
    
    // Make request to Railway
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });
    
    // Forward Set-Cookie headers
    const setCookieHeaders = response.headers.get('set-cookie');
    if (setCookieHeaders) {
      // Parse and modify cookies to be same-site
      const cookies = setCookieHeaders.split(',').map(cookie => {
        // Remove SameSite=None and Secure flags for same-origin
        return cookie
          .replace(/SameSite=None/gi, 'SameSite=Lax')
          .replace(/;\s*Secure/gi, '');
      });
      res.setHeader('Set-Cookie', cookies);
    }
    
    // Forward other important headers
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Get response body
    const responseText = await response.text();
    
    // Set status and send response
    res.status(response.status);
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(responseText);
      res.json(json);
    } catch {
      res.send(responseText);
    }
    
  } catch (error: any) {
    console.error('[Proxy Error]:', error);
    res.status(500).json({ 
      error: 'Proxy error',
      message: error.message,
      details: error.toString()
    });
  }
}

