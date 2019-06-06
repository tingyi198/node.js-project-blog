const express = require('express');
const router = express.Router();
const firebaseClient = require('../connections/firebase_client');
const fireAuth = firebaseClient.auth();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('dashboard/signup');
});

router.post('/signup', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  res.redirect('/auth');
});

module.exports = router;
