// server/index.js
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './config/db.js';
import messageRoutes from './routes/message.routes.js';
import authRouter from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import { Server } from 'socket.io';
import Message from './models/Message.js';
import userRoutes from './routes/user.routes.js';
import requestRoutes from './routes/request.routes.js';
import eventRoutes from './routes/event.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',   
  credentials: true, }));
app.use(express.json());

app.use('/api', authRouter);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/events', eventRoutes);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // Check if this prints in your terminal when you refresh the browser
  console.log(`⚡ User connected: ${socket.id}`);

socket.on('send_message', async (data) => {
  try {
    const { userId, username, text } = data;

    // VALIDATION: Don't try to save if userId is missing
    if (!userId || !text) {
      console.warn("Received incomplete message data:", data);
      return; 
    }

    const message = await Message.create({ userId, username, text });
    io.emit('receive_message', message);
  } catch (err) {
    console.error('MongoDB Save Error:', err.message);
  }
});

  // 2. Listen for typing (frontend sends 'typing', server emits 'user_typing')
  socket.on('typing', (username) => {
    socket.broadcast.emit('user_typing', username);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB();
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();

