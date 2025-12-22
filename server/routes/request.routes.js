// server/routes/request.routes.js
import express from 'express';
import Request from '../models/Request.js';
import auth from '../middlewares/auth.js';
import authOptional from '../middlewares/authOptional.js';

const router = express.Router();

/**
 * CREATE request
 */
router.post('/', auth, async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      author: req.user.id,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET all requests (filters)
 */
router.get('/', async (req, res) => {
  const { category, resolved, sort } = req.query;
  const query = {};

  if (category) query.category = category;
  if (resolved !== undefined) query.resolved = resolved === 'true';

  const requests = await Request.find(query)
    .populate('author', 'name')
    .sort(
      sort === 'top'
        ? { 'votes.length': -1 }
        : { createdAt: -1 }
    );

  res.json(requests);
});

/**
 * GET single request
 */
router.get('/:id', authOptional, async (req, res) => {
  const request = await Request.findById(req.params.id)
    .populate('author', 'name')
    .populate('comments.author', 'name');

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (req.user) {
    attachMyVote(request, req.user.id);
    request.comments.forEach(c =>
      attachMyVote(c, req.user.id)
    );
  }

  res.json(request);
});

/**
 * VOTE request
 */
router.patch('/:id/vote', auth, async (req, res) => {
  const { value } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const existing = request.votes.find(
    v => v.user.toString() === req.user.id
  );

  if (existing) {
    if (existing.value === value) {
      request.votes = request.votes.filter(
        v => v.user.toString() !== req.user.id
      );
    } else {
      existing.value = value;
    }
  } else {
    request.votes.push({ user: req.user.id, value });
  }

  await request.save();
  res.json(request);
});

/**
 * ADD comment
 */
router.post('/:id/comments', auth, async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  request.comments.push({
    author: req.user.id,
    content: req.body.content,
  });

  await request.save();
  res.json(request);
});

/**
 * VOTE comment
 */
router.patch('/:id/comments/:commentId/vote', auth, async (req, res) => {
  const { value } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const comment = request.comments.id(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  const existing = comment.votes.find(
    v => v.user.toString() === req.user.id
  );

  if (existing) {
    if (existing.value === value) {
      comment.votes = comment.votes.filter(
        v => v.user.toString() !== req.user.id
      );
    } else {
      existing.value = value;
    }
  } else {
    comment.votes.push({ user: req.user.id, value });
  }

  await request.save();
  res.json(request);
});

/**
 * TOGGLE resolved
 */
router.patch('/:id/resolve', auth, async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (request.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  request.resolved = !request.resolved;
  await request.save();
  res.json(request);
});

export default router;
