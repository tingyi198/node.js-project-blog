const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase-admin');

const categoriesRef = firebaseAdminDb.ref('categories');
const articlesRef = firebaseAdminDb.ref('articles');

router.get('/archives', function (req, res, next) {
  res.render('dashboard/archives');
});

router.get('/article/create', function (req, res, next) {
  categoriesRef.once('value').then(function (snapshot) {
    const categories = snapshot.val();
    res.render('dashboard/article', {
      categories
    });
  });
});
router.post('/article/create', function (req, res) {
  const data = req.body;
  const articleRef = articlesRef.push();
  const key = articleRef.key;
  const updateTime = Math.floor(Date.now() / 1000);
  data.update_time = updateTime;
  data.id = key;
  articleRef.set(data).then(function () {
    res.redirect('/dashboard/article/create');
  });
});

router.get('/categories', function (req, res, next) {
  const messages = req.flash('info');
  categoriesRef.once('value').then(function (snapshot) {
    const categories = snapshot.val();
    res.render('dashboard/categories', {
      categories,
      messages,
      hasInfo: messages.length > 0
    });
  });
});

router.post('/categories/create', function (req, res) {
  const data = req.body;
  var categoryRef = categoriesRef.push();
  data.id = categoryRef.key;

  // 檢查有無相同路徑，有的話不新增
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
    .then(function (snapshot) {
      if (snapshot.val() !== null) {
        req.flash('info', '已有相同路徑');
        res.redirect('/dashboard/categories');
      } else {
        categoryRef.set(data).then(function () {
          res.redirect('/dashboard/categories');
        });
      }
    });

});

router.post('/categories/delete/:id', function (req, res) {
  const id = req.param('id');
  categoriesRef.child(id).remove();
  req.flash('info', '欄位已刪除');
  res.redirect('/dashboard/categories');
});

router.get('/signup', function (req, res, next) {
  res.render('dashboard/signup');
});


module.exports = router;