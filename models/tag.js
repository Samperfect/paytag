const mongoose = require('mongoose');

const tagSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    tag: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    pin: {
      type: Number,
    },
    amountLeft: {
      type: Number,
    },
    hasExpired: {
      type: Boolean,
      require: true,
      default: false,
    },
    isTimed: {
      type: Boolean,
      require: true,
      default: false,
    },
    expireAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      require: true,
      default: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },

    media: {
      type: String,
      require: true,
      default: '',
    },

    history: [
      {
        type: Object,
      },
    ],
  },
  { timestamps: true }
);

const Tag = mongoose.model('tag', tagSchema);

module.exports = { Tag };
