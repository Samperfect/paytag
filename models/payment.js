const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    method: {
      type: String,
    },
    amount: {
      type: Number,
      require: true,
    },
    rate: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },

    // amount received via LTC transfer
    received: {
      type: Number,
    },
    // amount credited to user wallet in local currency
    credited: {
      type: Number,
    },

    address: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    cryptoAmount: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('payment', paymentSchema);

module.exports = { Payment };
