import UserRating from '../models/UserRating.js';

export const createOrUpdateRating = async (req, res) => {
  const { contentId, contentType, rating } = req.body;
  try {
    const existingRating = await UserRating.findOne({ contentId, contentType, user: req.user._id });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json(existingRating);
    }
    const newRating = new UserRating({
      contentId,
      contentType,
      user: req.user._id,
      rating,
    });
    await newRating.save();
    res.json(newRating);
  } catch (error) {
    res.status(500).json({ error: `Failed to save rating: ${error.message}` });
  }
};

export const getRatings = async (req, res) => {
  const { contentId, contentType } = req.params;
  try {
    const ratings = await UserRating.find({ contentId, contentType })
      .populate('user', 'username')
      .lean();
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ratings: ${error.message}` });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const ratings = await UserRating.find({ user: req.user._id })
      .lean();
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch user ratings: ${error.message}` });
  }
};

export const getAverageRating = async (req, res) => {
  const { contentId, contentType } = req.params;
  try {
    const result = await UserRating.aggregate([
      { $match: { contentId, contentType } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (result.length === 0) {
      return res.json({ contentId, contentType, averageRating: null, count: 0 });
    }
    res.json({
      contentId,
      contentType,
      averageRating: Number(result[0].averageRating.toFixed(2)),
      count: result[0].count,
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch average rating: ${error.message}` });
  }
};