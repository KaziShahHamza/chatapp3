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

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startAt: { type: Date, required: true },
    place: { type: String, required: true },
    department: {
      type: String,
      enum: ['Central','CSE & CSIT', 'GDM', 'FDT', 'BBA', 'AMMT', 'ENGLISH'],
      required: true,
    },
    votes: { type: [voteSchema], default: [] },
    comments: [commentSchema],
  },
  { timestamps: true }
);

eventSchema.virtual('likeCount').get(function () {
  return this.votes.filter(v => v.value === 1).length;
});

eventSchema.virtual('dislikeCount').get(function () {
  return this.votes.filter(v => v.value === -1).length;
});

eventSchema.set('toJSON', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Event', eventSchema);
