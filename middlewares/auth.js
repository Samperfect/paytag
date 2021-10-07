// importing the required modules
const { User } = require('../models/user');
const { Nodemailing } = require('nodemailing');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const MongoStore = require('connect-mongo');

class Auth {
  constructor() {
    // defining the class variables
    this.alg = 'HS256';
  }

  // destroy session
  destroySession(req, res, next) {
    req.session.destroy((err) => {
      res.redirect('/user/signin');
      return;
    });
  }

  //use flash
  messages(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  }

  // session initializer
  initSession(user, session) {
    session.user = user;
  }

  //express session
  new_session = session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  });

  // already logged in middleware
  loginRedirect(req, res, next) {
    if (req.session && req.session.user) {
      return res.redirect('/user');
    }
    next();
  }

  // login required middleware
  async loginRequired(req, res, next) {
    if (req.query.encoded) {
      next();
      return;
    }
    if (req.session && req.session.user) {
      // getting the user from the database
      const user = await User.findOne({ _id: req.session.user });
      req.user = user;
      return next();
    }
    return res.redirect('/user/signin');
  }

  // validate JWT
  async tokenRequired(req, res, next) {
    // validating the an auth token was sent
    if (!req.headers.clink_access_token) {
      const error = 'TOKEN_ERROR';
      res.status(401).json({
        status: false,
        message: "You've got some errors.",
        error: error,
      });
      return;
    }
    // accessing the auth token sent
    const token = req.headers.clink_access_token;

    // verifying the auth token sent
    const data = new Auth().verifyAuthToken(token); //this.verifyAuthToken(token);

    // getting the user from the database
    const user = await User.findById(data._id);

    // validating the a user was found
    if (!user) {
      const errors = 'INVALID_TOKEN_ERROR';
      res.status(401).json({
        status: false,
        message: "You've got some errors.",
        errors: errors,
      });
      return;
    }

    // adding the user to the request object
    req.user = {
      _id: user._id,
      email: user.email,
      password: user.password,
      phone: user.phone,
      username: user.username,
      name: user.name,
    };
    next();
  }

  // generate otp
  async generateOTP(user) {
    // generating the otp using Math.random
    const otp = (Math.random() * 2).toString().slice(2, 7);
    //  checking if otp exists
    const dup = await User.findOne({ otp: otp });
    if (dup) {
      //   using recursion to regenerate otp
      await generateOTP();
    } else {
      // saving the otp into the user's account
      user.otp = otp;
      user.otpTime = new Date();
      const status = await user.save();

      // sending the otp to the user and  returning the otp
      this.sendOTP(status.otp, user);
      return otp;
    }
  }

  // send otp
  sendOTP(otp, user) {
    const msg = {
      Host: process.env.EMAIL_HOST,
      Username: process.env.EMAIL_USERNAME,
      Password: process.env.EMAIL_PASSWORD,
      To: user.email,
      From: `support@clink.com`,
      Subject: `OTP To Complete Password Recovery`,
      Body: `<p>Hello ${user.name},</p><p>Find below your OTP to complete your password recovery process.</p><p>${otp}</p>`,
    };

    Nodemailing.send(msg).then((status) => {
      //   console.log(msg);
    });
  }

  // generate auth token for user
  generateAuthToken(user) {
    var tokenData = {
      _id: user._id,
      email: user.email,
    };
    return jwt.sign(tokenData, process.env.SECRET_KEY, {
      algorithm: this.alg,
    });
  }

  // verify user auth token
  verifyAuthToken(token) {
    try {
      return jwt.verify(token, process.env.SECRET_KEY, {
        algorithms: this.alg,
      });
    } catch (error) {
      const errors = 'INVALID_TOKEN_ERROR';
      res.status(401).json({
        status: false,
        message: "You've got some errors.",
        errors: errors,
      });
      return;
    }
  }
}

module.exports = {
  Auth,
};
