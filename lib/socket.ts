import { Server } from "socket.io";

interface Cache {
  value?: Server;
}

let cached: Cache = (global as any).socket;
if (!cached) {
  cached = (global as any).socket = {};
}

export function initSocket(server: any) {
  if (cached.value) return cached.value;

  cached.value = new Server(server);
  
  console.log("Socket.IO server initialized");

  return cached.value;
}
export function getIO() {
  if (!cached.value) throw new Error("Socket.IO not initialized!");
  return cached.value;
}
export function emitMessageRefresh() {
  getIO().emit("message-refresh");
}
