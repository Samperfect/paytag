// defining the homepage controller function
APITest = (req, res) => {
  res.json({ status: true, message: 'The APP is fully functional' });
};
home = (req, res) => {
  res.render('about');
};

// exporting the controller modules
module.exports = { APITest, home };
