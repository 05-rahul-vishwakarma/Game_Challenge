import { Server } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/socket';

export const initSocketServer = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Starting socket.io server');
    const io = new Server(res.socket.server as any, {
      path: '/api/socket',
      addTrailingSlash: false,
       cors: {
        origin: process.env.RENDER_EXTERNAL_URL || "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    res.socket.server.io = io;
  }
  return res;
};
