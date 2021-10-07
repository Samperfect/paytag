// requiring the needed modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const { Auth } = require('./middlewares/auth');
// requiring the needed modules end

// instantiating internal middlewares
const auth = new Auth();

// getting the express routers
const { mainRouter } = require('./routes/main');
const { userRouter } = require('./routes/user');
const { tagRouter } = require('./routes/tag');
const { paymentRouter } = require('./routes/payment');
// getting the express routers end

// getting the config variables
PORT = process.env.PORT;
// getting the config variables end

// initializing the application
const app = express();
// initializing the application end

// using external middlewares
app.use(auth.new_session);
app.use(flash());
app.use(auth.messages);

// setting up middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(express.static('./public'));
app.use('/user', express.static('./public'));
app.use('/tag', express.static('./public'));
app.use(require('cors')());
// setting up middlewares end

// connecting to the database
dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        'App is listening on port ' +
          PORT +
          '...\nVisit http://localhost:' +
          PORT
      );
    });
  })
  .catch((error) => console.log(error));
// connecting to the database end

// Everything relating to the main page components
app.use(mainRouter);

// Everything relating to the user components
app.use('/user', userRouter);

// Everything relating to the tag components
app.use('/tag', tagRouter);

// Everything relating to the payment components
app.use('/hidden', paymentRouter);

// 404 Error Handler
app.all('*', (req, res) => {
  res.render('404');
});
