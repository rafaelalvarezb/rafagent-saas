/**
 * RafAgent Persistent Backend Server
 * 
 * This server handles:
 * - All API routes (authentication, prospects, templates, etc.)
 * - Automated email sequences
 * - AI response analysis
 * - Meeting scheduling
 * - Cron jobs and schedulers
 * 
 * Runs continuously on Railway
 */

import "dotenv/config";
import express from "express";
import { registerRoutes } from "./routes";
import { sessionMiddleware } from "./middleware/session";
import { startAgentScheduler } from "./automation/scheduler";
import { startReminderScheduler } from "./automation/reminderScheduler";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration for Vercel frontend
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://rafagent-saas.vercel.app',
    'https://rafagent-saas-git-main-rafael-alvarezs-projects-43d604b9.vercel.app',
    'https://rafagent-saas-ngni33pe8-rafael-alvarezs-projects-43d604b9.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Session management
app.use(sessionMiddleware);

// Register all API routes (auth, prospects, templates, etc.)
async function setupRoutes() {
  const server = await registerRoutes(app);
  return server;
}

// Start the automation engine
async function startEngine() {
  try {
    console.log("🚀 Starting RafAgent Persistent Automation Engine...");
    
    // Test database connection
    const users = await storage.getAllUsers();
    console.log(`✅ Database connected - ${users.length} users found`);
    
    // Start schedulers
    startAgentScheduler();
    startReminderScheduler();
    
    console.log("✅ All schedulers started successfully");
    console.log("🤖 RafAgent Engine is now running persistently");
    
  } catch (error) {
    console.error("❌ Failed to start engine:", error);
    process.exit(1);
  }
}

// Start the server
const PORT = parseInt(process.env.PORT || '3001', 10);

(async () => {
  // Setup all routes first
  const server = await setupRoutes();
  
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 RafAgent Backend server running on port ${PORT}`);
    startEngine();
  });
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
