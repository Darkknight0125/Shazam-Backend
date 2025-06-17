import { Server } from 'socket.io';
import Message from '../models/Message.js';

export const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
    });
    socket.on('message', async ({ senderId, receiverId, content }) => {
      try {
        const message = new Message({ sender: senderId, receiver: receiverId, content });
        await message.save();
        io.to(receiverId).emit('message', message);
        socket.emit('message', message);
      } catch (error) {
        socket.emit('error', 'Failed to send message');
      }
    });
  });
  return io;
};