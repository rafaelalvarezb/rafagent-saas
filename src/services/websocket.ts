import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Server } from "socket.io";

let io: Server | null = null;

export function initializeWebSocket(httpServer: HTTPServer): Server {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join user-specific room
    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`✅ User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initializeWebSocket first.");
  }
  return io;
}

// Emit events to specific user
export function emitToUser(userId: string, event: string, data: any) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    console.log(`📡 Emitted "${event}" to user ${userId}`);
  }
}

// Emit prospect update
export function emitProspectUpdate(userId: string, prospect: any) {
  emitToUser(userId, "prospect:update", prospect);
}

// Emit prospect status change
export function emitProspectStatusChange(userId: string, prospectId: string, status: string) {
  emitToUser(userId, "prospect:status", { prospectId, status });
}

// Emit meeting scheduled
export function emitMeetingScheduled(userId: string, prospectId: string, meetingData: any) {
  emitToUser(userId, "meeting:scheduled", { prospectId, ...meetingData });
}

