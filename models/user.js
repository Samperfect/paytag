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
    country: {
      type: String,
      require: true,
    },
    profileImg: {
      type: String,
      default: process.env.PUBLIC_URL,
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
    currency: {
      type: String,
      require: true,
      default: '₦',
    },
    tags: [
      {
        tagId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
        },
      },
    ],
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
    spent: {
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
