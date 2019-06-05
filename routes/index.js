const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase-admin');

// const ref = firebaseAdminDb.ref('any');
// ref.once('value', function (snap) {
//   console.log(snap.val());
// });


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/post', function (req, res, next) {
  res.render('post');
});


module.exports = router;
