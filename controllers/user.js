// importing the required modules
const { User } = require('../models/user');
const { Transaction } = require('../models/transaction');
const bcrypt = require('bcrypt');
const { Auth } = require('../middlewares/auth');
const mongoose = require('mongoose');
// instantiationg internal middlewares
const auth = new Auth();

// defining the register controller
const registerController = (req, res) => {
  res.render('register');
};

// defining the login controller
const loginController = (req, res) => {
  res.render('login');
};

// user dashboard controller
const dashboard = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('tags.tagId')
    .populate('transactions.transactionId');

  // const tags = user.tags;
  const transactions = user.transactions.reverse();
  res.render('dashboard', { user: req.user, transactions: transactions });
};

// register user controller
const registerUser = async (req, res) => {
  // creating the error object
  var error;
  // getting the form data
  const body = req.body;
  // checking for errors in user data
  if (
    !body.username ||
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.password ||
    !body.country
  ) {
    error = 'Please provide all required information';

    req.flash('error_msg', error);
    res.redirect('/user/signup');
    return;
  }
  if (body.password.length < 5) {
    error = 'Password must be a minimum of 6 characters';
    req.flash('error_msg', error);
    res.redirect('/user/signup');
    return;
  }
  // checking for errors in user data end

  // checking if the user exits already
  eMail = await User.findOne({ email: body.email.toLowerCase() });
  eUsername = await User.findOne({ email: body.username.toLowerCase() });
  //   ePhone = await User.findOne({ email: body.phone.toLowerCase() });

  if (eMail) {
    error = 'That email is already in use';
    req.flash('error_msg', error);
    res.redirect('/user/signup');
    return;
  }
  if (eUsername) {
    error = 'That username is already in use';
    req.flash('error_msg', error);
    res.redirect('/user/signup');
    return;
  }

  if (String(body.country.toLowerCase()) !== String('nigeria').toLowerCase()) {
    body.currency = '$';
  }

  // hashing the password
  try {
    bcrypt.hash(body.password, 10, async (error, hash) => {
      if (error) throw new Error();
      //   adding the password hash to the body object
      body.password = hash;
      // adding an id to the body object
      body._id = mongoose.Types.ObjectId();
      //   creating the user object and saving to the database
      const user = new User(body);
      try {
        await user.save();
      } catch (error) {
        error = 'Something completely went wrong!';
        req.flash('error_msg', error);
        res.redirect('/user/signup');
        return;
      }

      // generating and sending otp to the user
      const otp = await auth.generateOTP(user);

      console.log(otp);

      req.flash('success_msg', 'One final step to go! Check your mailbox.');
      res.redirect('/user/authenticate?next=/user&action=complete');
      return;
    });
  } catch (error) {
    error = 'Something completely went wrong!';
    req.flash('error_msg', error);
    res.redirect('/user/signup');
    return;
  }
};

// login user controller
const loginUser = async (req, res) => {
  // creating the error object
  var error;
  // getting the form data
  const body = req.body;

  // checking for errors in user data
  if (!body.email || !body.password) {
    error = 'Please provide all required information';
    req.flash('error_msg', error);
    res.redirect('/user/signin');
    return;
  }
  // checking for errors in user data end

  // checking if the user exits already
  var user = await User.findOne({ email: body.email.toLowerCase() });

  if (!user) {
    error = 'That account does not exist';
    req.flash('error_msg', error);
    res.redirect('/user/signin');
    return;
  }

  // checking if the user password matches
  const match = await bcrypt.compare(body.password, user.password);

  if (!match) {
    error = 'Invalid sign in credentials provided';
    req.flash('error_msg', error);
    res.redirect('/user/signin');
    return;
  }

  if (!user.emailVerified) {
    error = 'You acccount was not created!';
    await User.findOneAndDelete({ email: body.email.toLowerCase() });
    req.flash('error_msg', error);
    res.redirect('/user/signup');
    return;
  }

  try {
    // generating and sending otp to the user
    const otp = await auth.generateOTP(user);

    console.log(otp);
    res.redirect('/user/authenticate?next=/user');
    return;
  } catch (error) {
    error = 'Something completely went wrong!';
    req.flash('error_msg', error);
    res.redirect('/user/signin');
    return;
  }
};

// defining the auth user controller
const authController = (req, res) => {
  res.render('auth');
};

// auth user controller
const authenticate = async (req, res) => {
  // creating the error object
  var error;

  // getting the form data
  const body = req.body;
  const next = req.query.next;
  const action = req.query.action;

  // checking for errors in user data
  if (!body.otp) {
    error = 'Please provide all required information';
    req.flash('error_msg', error);
    res.redirect('/user/signin');
    return;
  }
  // checking for errors in user data end

  // checking if the user exits already
  var user = await User.findOne({ otp: body.otp });

  if (!user) {
    error = 'Invalid OTP Provided';
    req.flash('error_msg', error);
    res.redirect('/user/signin');
    return;
  }

  if (String(action) === 'complete') {
    user.emailVerified = true;
    // destroying the otp
    user.otp = null;
    await user.save();
    // creating the user session
    await auth.initSession(user._id, req.session);
    res.redirect(next);
    return;
  }

  // destroying the otp
  user.otp = null;
  await user.save();
  // creating the user session
  await auth.initSession(user._id, req.session);
  res.redirect(next);
  return;
};

// logout user controller
const logoutUser = (req, res) => {
  return;
};

// update user controller
const updateUser = async (req, res) => {
  // creating the error object
  var error;
  // getting the form data
  const body = req.body;
  // checking for errors in user data
  if (
    !body.fname ||
    !body.lname ||
    !body.email ||
    !body.phone ||
    !body.address
  ) {
    error = "This field can't be empty";
  }

  if (Object.keys(errors).length > 0) {
    res.redirect(`./register`);
    return;
  }
  // checking for errors in user data end

  // checking if the user exits already
  user = await User.findOne({ _id: req.user });

  if (user.email != body.email) {
    existing = await User.findOne({ email: body.email });
    if (existing) {
      error = 'That email is already in use';
      res.redirect(`/`);
      return;
    }
  }

  // updating the user information
  try {
    await User.findOneAndUpdate({ _id: req.user }, body, {
      useFindAndModify: false,
    });
    // user.save();
  } catch (error) {
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/');
    return;
  }
  req.flash('success_msg', 'Profile updated successfully!');
  res.redirect(`/`);
  return;
};

// get all transactions controller
const transactions = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'transactions.transactionId'
  );

  // const tags = user.tags;
  const transactions = user.transactions.reverse();
  res.render('transactions', { user: req.user, transactions: transactions });
};

// exporting the user controllers
module.exports = {
  registerController,
  loginController,
  registerUser,
  logoutUser,
  loginUser,
  authController,
  authenticate,
  updateUser,
  dashboard,
  transactions,
};
