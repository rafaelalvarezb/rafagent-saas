/**
 * RafAgent Persistent Automation Engine
 * 
 * This is the persistent server that handles:
 * - Automated email sequences
 * - AI response analysis
 * - Meeting scheduling
 * - Cron jobs and schedulers
 * 
 * Runs continuously on Railway/Render to avoid serverless timeout limits
 */

import "dotenv/config";
import express from "express";
import { startAgentScheduler } from "./automation/scheduler";
import { startReminderScheduler } from "./automation/reminderScheduler";
import { storage } from "./storage";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "rafagent-engine"
  });
});

// API endpoint to manually trigger agent run for a user
app.post("/api/agent/run/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Import here to avoid circular dependencies
    const { runAgent } = await import("./automation/agent");
    
    const result = await runAgent(userId);
    res.json({ success: true, result });
  } catch (error: any) {
    console.error("Manual agent run error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get engine status
app.get("/api/status", async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    const activeUsers = users.filter(u => u.googleAccessToken);
    
    res.json({
      status: "running",
      activeUsers: activeUsers.length,
      totalUsers: users.length,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 RafAgent Engine server running on port ${PORT}`);
  startEngine();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
