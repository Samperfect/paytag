// defining the homepage controller function
homepageController = (req, res) => {
  res.json({ status: true, message: 'The APP is fully functional' });
};

// exporting the controller modules
module.exports = { homepageController };
