import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initSocket } from './utils/socket.js';
import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import friendRoutes from './routes/friends.js';
import forumRoutes from './routes/forums.js';
import playlistRoutes from './routes/playlists.js';
import aiRoutes from './routes/ai.js';
import commentRoutes from './routes/comments.js';
import ratingRoutes from './routes/ratings.js';

config();

const app = express();
const server = createServer(app);
const io = initSocket(server);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

connectDB();
connectRedis();

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});