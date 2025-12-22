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


const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40, // ✅ title limit
    },
    body: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.trim().split(/\s+/).length <= 100;
        },
        message: 'Post body cannot exceed 100 words',
      },
    },
    category: {
      type: String,
      enum: ['academic', 'hostel', 'faculty', 'transport', 'general'],
      required: true,
    },
    department: {
      type: String,
      enum: ['CSE & CSIT', 'GDM', 'FDT', 'BBA', 'AMMT', 'ENGLISH'],
      required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    votes: { type: [voteSchema], default: [] },
    comments: [commentSchema],
    solved: { type: Boolean, default: false },
  },
  { timestamps: true }
);


postSchema.virtual('likeCount').get(function () {
  return this.votes.filter(v => v.value === 1).length;
});

postSchema.virtual('dislikeCount').get(function () {
  return this.votes.filter(v => v.value === -1).length;
});


// IMPORTANT
postSchema.set('toJSON', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Post', postSchema);
