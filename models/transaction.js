const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
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

    author: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      },
    ],
    // history: [
    //   {
    //     withdrawalId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'history',
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = { Transaction };
