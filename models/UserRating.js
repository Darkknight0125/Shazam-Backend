import mongoose from 'mongoose';

const UserRatingSchema = new mongoose.Schema({
  contentId: { type: String, required: true },
  contentType: { type: String, enum: ['movie', 'series', 'anime'], required: true },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserRatingSchema.index({ contentId: 1, contentType: 1, user: 1 }, { unique: true });

UserRatingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('UserRating', UserRatingSchema);