// src/sockets/chatSocket.ts
import { Server } from 'socket.io';
import { Message } from '../models';

interface ServerEvents {
  'message:new': (payload: any) => void;
}

interface ClientEvents {
  'conversation:join': (data: { conversationId: number }) => void;
}

export function initChatSocket(io: Server<ClientEvents, ServerEvents>) {
  io.on('connection', (socket) => {
    socket.on('conversation:join', ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);
    });
  });
}

// helper to emit from controllers later if you store io globally
export function emitNewMessage(
  io: Server,
  conversationId: number,
  message: Message
) {
  io.to(`conversation:${conversationId}`).emit('message:new', message);
}
