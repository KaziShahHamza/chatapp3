// server/routes/post.routes.js
import express from 'express';
import Post from '../models/Post.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// create post
router.post('/', auth, async (req, res) => {
	try {
		const post = await Post.create({
			...req.body,
			author: req.user.id
		});
		res.status(201).json(post);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// get all posts (filters)
router.get('/', async (req, res) => {
	const { category, solved, sort } = req.query;
	const query = {};
	if (category) query.category = category;
	if (solved !== undefined) query.solved = solved === 'true';

	const posts = await Post.find(query)
		.populate('author', 'name')
		.sort(sort === 'top' ? { 'votes.length': -1 } : { createdAt: -1 });

	res.json(posts);
});

// get single post
router.get('/:id', async (req, res) => {
	const post = await Post.findById(req.params.id)
		.populate('author', 'name')
		.populate('comments.author', 'name');
	res.json(post);
});

// vote post
router.patch('/:id/vote', auth, async (req, res) => {
	const { value } = req.body;
	const post = await Post.findById(req.params.id);

	post.votes = post.votes.filter(v => v.user.toString() !== req.user.id);
	post.votes.push({ user: req.user.id, value });

	await post.save();
	res.json(post);
});

// add comment
router.post('/:id/comments', auth, async (req, res) => {
	const post = await Post.findById(req.params.id);
	post.comments.push({
		author: req.user.id,
		content: req.body.content
	});
	await post.save();
	res.json(post);
});

// vote comment
router.patch('/:id/comments/:commentId/vote', auth, async (req, res) => {
	const { value } = req.body;
	const post = await Post.findById(req.params.id);
	const comment = post.comments.id(req.params.commentId);

	comment.votes = comment.votes.filter(v => v.user.toString() !== req.user.id);
	comment.votes.push({ user: req.user.id, value });

	await post.save();
	res.json(post);
});

// mark solved
router.patch('/:id/solve', auth, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (post.author.toString() !== req.user.id)
		return res.status(403).json({ message: 'Forbidden' });

	post.solved = !post.solved;
	await post.save();
	res.json(post);
});

export default router;

