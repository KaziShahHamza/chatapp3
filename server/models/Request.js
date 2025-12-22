// server/models/Request.js
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
    votes: { type: [voteSchema], default: [] },
  },
  { timestamps: true }
);

commentSchema.virtual('likeCount').get(function () {
  return this.votes.filter(v => v.value === 1).length;
});

commentSchema.virtual('dislikeCount').get(function () {
  return this.votes.filter(v => v.value === -1).length;
});

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['courses', 'syllabus', 'exam', 'general'],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    votes: {
      type: [voteSchema],
      default: [],
    },
    comments: [commentSchema],
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

requestSchema.virtual('likeCount').get(function () {
  return this.votes.filter(v => v.value === 1).length;
});

requestSchema.virtual('dislikeCount').get(function () {
  return this.votes.filter(v => v.value === -1).length;
});

requestSchema.set('toJSON', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Request', requestSchema);
