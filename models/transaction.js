const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    tag: {
      type: String,
    },
    amount: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    sign: {
      type: String,
      require: true,
    },
    media: {
      type: String,
      require: true,
      default: 'assets/img/favicon.png',
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = { Transaction };
