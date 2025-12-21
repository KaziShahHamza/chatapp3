// server/models/Post.js
import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    votes: [voteSchema],
  },
  { timestamps: true }
);

// 🔹 comment vote count
commentSchema.virtual('voteCount').get(function () {
  return this.votes.reduce((sum, v) => sum + v.value, 0);
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'hostel', 'administration', 'facilities', 'general'],
      required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    votes: [voteSchema],
    comments: [commentSchema],
    solved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔹 post vote count
postSchema.virtual('voteCount').get(function () {
  return this.votes.reduce((sum, v) => sum + v.value, 0);
});

// IMPORTANT
postSchema.set('toJSON', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Post', postSchema);
