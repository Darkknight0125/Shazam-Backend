import Comment from '../models/Comment.js';

export const createComment = async (req, res) => {
  const { contentId, contentType, content } = req.body;
  try {
    const comment = new Comment({
      contentId,
      contentType,
      user: req.user._id,
      content,
    });
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: `Failed to create comment: ${error.message}` });
  }
};

export const getComments = async (req, res) => {
  const { contentId, contentType } = req.params;
  try {
    const comments = await Comment.find({ contentId, contentType })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .lean();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch comments: ${error.message}` });
  }
};