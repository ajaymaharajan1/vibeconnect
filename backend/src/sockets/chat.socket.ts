import { Server, Socket } from "socket.io";

export function initSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`👤 User joined room: ${roomId}`);
    });

    // Handle incoming chat message
    socket.on("send_message", (data: any) => {
      // Broadcast to everyone in the room except sender
      socket.to(data.roomId).emit("receive_message", data);
    });

    // Handle game state update
    socket.on("game_choice", (data: any) => {
      io.to(data.roomId).emit("game_updated", data);
    });

    // Typing status
    socket.on("typing", (data: { roomId: string; userName: string; isTyping: boolean }) => {
      socket.to(data.roomId).emit("user_typing", data);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}
