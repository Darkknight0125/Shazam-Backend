import Thread from '../models/Thread.js';
import Post from '../models/Post.js';

export const createThread = async (req, res) => {
  const { contentId, title, contentType } = req.body;
  try {
    const thread = new Thread({
      contentId,
      contentType,
      title,
      creator: req.user._id,
    });
    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: `Failed to create thread: ${error.message}` });
  }
};

export const createPost = async (req, res) => {
  const { threadId } = req.params;
  const { content } = req.body;
  try {
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    const post = new Post({
      thread: threadId,
      author: req.user._id,
      content,
    });
    await post.save();
    thread.posts.push(post._id);
    await thread.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: `Failed to create post: ${error.message}` });
  }
};

export const getThread = async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findById(threadId)
      .populate('creator', 'username')
      .populate({
        path: 'posts',
        populate: { path: 'author', select: 'username' },
      })
      .lean();
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch thread: ${error.message}` });
  }
};

export const upvotePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id.toString();
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const currentVote = post.votes.get(userId);
    let upvotesChange = 0;
    let downvotesChange = 0;

    if (currentVote === 'up') {
      post.votes.delete(userId);
      upvotesChange = -1;
      // Removing the current upvote
    } else if (currentVote === 'down') {
      post.votes.set(userId, 'up');
      downvotesChange = -1;
      upvotesChange = 1;
    } else {
      post.votes.set(userId, 'up');
      upvotesChange = 1;
    }

    post.upvotes += upvotesChange;
    post.downvotes += downvotesChange;
    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate('author', 'username')
      .lean();
    res.json(populatedPost);
  } 
  catch (error) {
    res.status(500).json({ error: `Failed to upvote post: ${error.message}` });
  }
};

export const downvotePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id.toString();
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const currentVote = post.votes.get(userId);
    let upvotesChange = 0;
    let downvotesChange = 0;

    if (currentVote === 'down') {
      // Removing current downvote
      post.votes.delete(userId);
      downvotesChange = -1;
    } else if (currentVote === 'up') {
      post.votes.set(userId, 'down');
      upvotesChange = -1;
      downvotesChange = 1;
    } else {
      post.votes.set(userId, 'down');
      downvotesChange = 1;
    }

    post.upvotes += upvotesChange;
    post.downvotes += downvotesChange;
    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate('author', 'username')
      .lean();
    res.json(populatedPost);
  } 
  catch (error) {
    res.status(500).json({ error: `Failed to downvote post: ${error.message}` });
  }
};