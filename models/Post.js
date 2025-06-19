import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  votes: { type: Map, of: String, default: {} }, // Maps userId to 'up' or 'down'
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', PostSchema);