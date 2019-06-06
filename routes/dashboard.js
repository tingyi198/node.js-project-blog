const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase-admin');
const moment = require('moment');
const striptags = require('striptags');

const categoriesRef = firebaseAdminDb.ref('categories');
const articlesRef = firebaseAdminDb.ref('articles');

router.get('/archives', function (req, res, next) {
  // res.render('dashboard/archives');
  let categories = {};
  categoriesRef.once('value').then(function (snapshot) {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then(function (snapshot) {
    let articles = [];
    snapshot.forEach(function (snapshotChild) {
      articles.push(snapshotChild.val());
    });
    articles.reverse();
    res.render('dashboard/archives', {
      categories,
      articles,
      moment,
      striptags
    });
  });
});

router.get('/article/create', function (req, res, next) {
  categoriesRef.once('value').then(function (snapshot) {
    const categories = snapshot.val();
    res.render('dashboard/article', {
      categories
    });
  });
});

// 取得單一文章
router.get('/article/:id', function (req, res, next) {
  const id = req.param('id');
  let categories = {};
  categoriesRef.once('value').then(function (snapshot) {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then(function (snapshot) {
    const article = snapshot.val();
    res.render('dashboard/article', {
      categories,
      article
    });
  });
});

// 新增文章
router.post('/article/create', function (req, res) {
  const data = req.body;
  const articleRef = articlesRef.push();
  const key = articleRef.key;
  const updateTime = Math.floor(Date.now() / 1000);
  data.update_time = updateTime;
  data.id = key;
  articleRef.set(data).then(function () {
    res.redirect(`/dashboard/article/${key}`);
  });
});

// 修改文章
router.post('/article/update/:id', function (req, res) {
  const data = req.body;
  const id = req.param('id');
  const updateTime = Math.floor(Date.now() / 1000);
  data.update_time = updateTime;
  articlesRef.child(id).update(data).then(function () {
    res.redirect(`/dashboard/article/${id}`);
  });
});

// 取得分類列表
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

// 刪除文章
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