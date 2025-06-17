import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: String,
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: [{ contentId: String, type: String }],
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Playlist', PlaylistSchema);