import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(server: any) {
  if (io) return io;

  io = new Server(server);
  
  console.log("Socket.IO server initialized");

  return io;
}
export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
}
export function emitMessageRefresh() {
  getIO().emit("message-refresh");
}
