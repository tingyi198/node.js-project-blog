const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase-admin');
const moment = require('moment');
const striptags = require('striptags');

const categoriesRef = firebaseAdminDb.ref('categories');
const articlesRef = firebaseAdminDb.ref('articles');

/* GET home page. */
router.get('/', function (req, res, next) {
  let categories = {};
  categoriesRef.once('value').then(function (snapshot) {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then(function (snapshot) {
    const articles = [];
    snapshot.forEach(function (snapshotChild) {
      if (snapshotChild.val().status === 'public') {
        articles.push(snapshotChild.val());
      }
    });
    articles.reverse();
    console.log(articles);
    res.render('index', {
      articles,
      categories,
      striptags,
      moment,
    });
  });
});

router.get('/post/:id', function (req, res, next) {
  const id = req.param('id');
  let categories = {};
  categoriesRef.once('value').then(function (snapshot) {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then(function (snapshot) {
    const article = snapshot.val();
    res.render('post', {
      categories,
      article,
      moment,
    });
  });
});


module.exports = router;
