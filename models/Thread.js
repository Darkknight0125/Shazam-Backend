import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
  contentId: String,
  contentType: { type: String, enum: ['movie', 'series', 'anime'] },
  title: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Thread', ThreadSchema);