import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Request from '../models/Request.js';
import Event from '../models/Event.js'; 

const router = express.Router();

// GET public user profile
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // user basic info
    const user = await User.findById(userId).select('name createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // user's posts
    const posts = await Post.find({ author: userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    // user's requests
    const requests = await Request.find({ author: userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    // user's events
    const events = await Event.find({ organizer: userId })
      .populate('organizer', 'name')
      .populate('comments.author', 'name')
      .sort({ startAt: 1 });

    // comments by user (SAFE way)
    const postsWithComments = await Post.find(
      { 'comments.author': userId },
      { comments: 1 }
    ).populate('comments.author', 'name');

    const comments = postsWithComments.flatMap(post =>
      post.comments
        .filter(c => c.author._id.toString() === userId)
        .map(c => ({
          _id: c._id,
          content: c.content,
          createdAt: c.createdAt,
          voteCount: c.voteCount,
          postId: post._id,
        }))
    );

    res.json({
      user,
      posts,
      requests,
      events,
      comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
});

export default router;
