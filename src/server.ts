// src/server.ts
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { initChatSocket } from './sockets/chatSocket';

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

initChatSocket(io);

server.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`);
});
