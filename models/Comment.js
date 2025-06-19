import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  contentId: { type: String, required: true },
  contentType: { type: String, enum: ['movie', 'series', 'anime'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', CommentSchema);