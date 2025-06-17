import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
  contentId: String,
  contentType: String,
  title: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Thread', ThreadSchema);