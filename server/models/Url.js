const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    shortUrlId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    customCode: {
      type: Boolean,
      default: false,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for faster user-specific queries
urlSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Url', urlSchema);
