const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    //   USER INFORMATION
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      //   require: true,
    },
    password: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    //   USER INFORMATION END

    // VERIFICATION DATA
    email: {
      type: String,
      require: true,
    },
    emailVerified: {
      type: Boolean,
      require: true,
      default: false,
    },
    otp: {
      type: String,
    },
    otpTime: {
      type: Date,
    },
    bvn: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      require: true,
      default: false,
    },
    // VERIFICATION DATA END

    // TRANSACTION AND CASH INFO
    transactions: [
      {
        transactionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'transaction',
        },
      },
    ],
    withdrawals: [
      {
        withdrawalId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'payment',
        },
      },
    ],
    wallet: {
      type: Number,
      require: true,
      default: 0,
    },
    withdrawn: {
      type: Number,
      require: true,
      default: 0,
    },
    income: {
      type: Number,
      require: true,
      default: 0,
    },
    // TRANSACTION AND CASH INFO END
  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = { User };
