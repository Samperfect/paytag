// importing the required modules
const { User } = require('../models/user');
const { Transaction } = require('../models/transaction');
const bcrypt = require('bcrypt');
const { Auth } = require('../middlewares/auth');
const { Utils } = require('../middlewares/utils');
const mongoose = require('mongoose');
const { Tag } = require('../models/tag');
// instantiationg internal middlewares
const auth = new Auth();
const utils = new Utils();

// generate a paytag controller
const generateTag = async (req, res) => {
  // defining the error object
  var error;

  // getting the body of the request object
  const body = req.body;

  //  checking whethehr necessary data was sent
  if (!body.amount) {
    error = 'An amount is required';
    res.json({
      status: false,
      error: error,
    });

    return;
  }

  if (req.user.wallet < body.amount) {
    error = 'Insufficient wallet balance';
    res.json({
      status: false,
      error: error,
    });

    return;
  }

  // creating the tag object
  const tag = await utils.generateTag();

  const data = {
    tag: tag,
    amount: body.amount,
    amountLeft: body.amount,
    author: req.user._id,
    _id: new mongoose.Types.ObjectId(),
  };

  // validating that a pin was set
  if (body.pin) {
    data.pin = body.pin;
  }

  try {
    // generating a new tag object
    const tag = new Tag(data);

    await tag.save();

    transact = {
      tag: tag.tag,
      amount: tag.amount,
      description: 'Generated a Paytag',
      sign: '-',
      author: req.user._id,
      _id: new mongoose.Types.ObjectId(),
    };

    // generating the transaction object
    const transaction = new Transaction(transact);

    await transaction.save();

    // adding the tag to the user object
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          tags: {
            tagId: tag._id,
          },
          $position: 0,
        },
        wallet: req.user.wallet - Number(body.amount),
        spent: req.user.spent + Number(body.amount),
      }
    );

    // adding the transaction to the user object
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          transactions: {
            transactionId: transaction._id,
          },
          $position: 0,
        },
      }
    );

    res.json({
      status: true,
      message: 'Success',
      data: tag,
    });

    return;
  } catch (error) {
    error = 'Something went wrong!';
    res.json({
      status: false,
      error: error,
    });

    return;
  }
};

// redeeem a paytag controller
const redeemTag = async (req, res) => {
  // defining the error object
  var error;

  // getting the body of the request object
  const body = req.body;

  //  checking whethehr necessary data was sent
  if (!body.paytag) {
    error = 'An Paytag is required!';
    res.json({
      status: false,
      error: error,
    });

    return;
  }

  // validating the the Paytag exists
  const tag = await Tag.findOne({ tag: body.paytag, isActive: true });

  if (!tag) {
    error = "That's an invalid Paytag";
    res.json({
      status: false,
      error: error,
    });

    return;
  }

  if (tag.pin) {
    if (!body.pin) {
      error = 'Paytag pin required!';
      res.json({
        status: false,
        error: error,
      });

      return;
    }

    if (String(body.pin) !== String(tag.pin)) {
      error = 'Invalid Paytag pin!';
      res.json({
        status: false,
        error: error,
      });

      return;
    }
  }

  try {
    if (tag.amountLeft < 0) {
      error = 'Paytag has no funds!';
      res.json({
        status: false,
        error: error,
      });

      return;
    }

    // computing transaction
    transact = {
      tag: tag.tag,
      amount: tag.amountLeft,
      description: 'Redeemed a Paytag',
      sign: '+',
      author: req.user._id,
      _id: new mongoose.Types.ObjectId(),
    };

    // generating the transaction object
    const transaction = new Transaction(transact);

    await transaction.save();

    // rendering the paytag inactive
    tag.isActive = false;
    await tag.save();

    // updating the user balance with the Paytag funds and adding the transaction to the user object
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          transactions: {
            transactionId: transaction._id,
          },
          $position: 0,
        },
        wallet: req.user.wallet + Number(tag.amountLeft),
        income: req.user.income + Number(tag.amountLeft),
      }
    );

    res.json({
      status: true,
      message: 'Success',
      data: tag,
    });

    return;
  } catch (error) {
    console.log(error);
    error = 'Something went wrong!';
    res.json({
      status: false,
      error: error,
    });

    return;
  }
};

// get all paytags controller
const paytags = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('tags.tagId')
    .populate('transactions.transactionId');

  const tags = user.tags.reverse();
  // const transactions = user.transactions;

  res.render('paytags', {
    user: req.user,
    tags: tags,
  });
};

module.exports = { generateTag, paytags, redeemTag };
