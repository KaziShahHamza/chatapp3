// server/routes/message.routes.js
import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

export default router;
