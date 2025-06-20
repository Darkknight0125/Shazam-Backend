import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  watchlist: [{ contentId: String, type: { type: String, enum: ['movie', 'series', 'anime'] } }],
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FriendRequest' }],
  moodHistory: [{ mood: String, timestamp: Date }],
});

export default mongoose.model('User', UserSchema);