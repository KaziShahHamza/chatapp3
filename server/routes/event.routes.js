import express from 'express';
import Event from '../models/Event.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// CREATE event
router.post('/', auth, async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user.id
    });
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// GET all events
router.get('/', async (req, res) => {
  const { department, sort } = req.query;
  const query = {};
  if (department) query.department = department;

  const events = await Event.find(query)
    .populate('organizer', 'name')
    .populate('comments.author', 'name')
    .sort(sort === 'top' ? { 'votes.length': -1 } : { startAt: 1 });

  res.json(events);
});

// GET single event
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'name')
    .populate('comments.author', 'name');

  res.json(event);
});

// VOTE event
router.patch('/:id/vote', auth, async (req, res) => {
  const { value } = req.body; // 1 or -1
  const event = await Event.findById(req.params.id);

  const existing = event.votes.find(v => v.user.toString() === req.user.id);

  if (existing) {
    if (existing.value === value) {
      event.votes = event.votes.filter(v => v.user.toString() !== req.user.id);
    } else {
      existing.value = value;
    }
  } else {
    event.votes.push({ user: req.user.id, value });
  }

  await event.save();
  res.json(event);
});

// ADD comment
router.post('/:id/comments', auth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  event.comments.push({
    author: req.user.id,
    content: req.body.content
  });
  await event.save();
  res.json(event);
});

// VOTE comment
router.patch('/:id/comments/:commentId/vote', auth, async (req, res) => {
  const { value } = req.body;
  const event = await Event.findById(req.params.id);
  const comment = event.comments.id(req.params.commentId);

  const existing = comment.votes.find(v => v.user.toString() === req.user.id);

  if (existing) {
    if (existing.value === value) {
      comment.votes = comment.votes.filter(v => v.user.toString() !== req.user.id);
    } else {
      existing.value = value;
    }
  } else {
    comment.votes.push({ user: req.user.id, value });
  }

  await event.save();
  res.json(event);
});

export default router;
