const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase-admin');
const moment = require('moment');
const striptags = require('striptags');

const categoriesRef = firebaseAdminDb.ref('categories');
const articlesRef = firebaseAdminDb.ref('articles');

/* GET home page. */
router.get('/', function (req, res, next) {
  let currentPage = Number.parseInt(req.query.page) || 1;
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

    // 分頁
    const totalResult = articles.length;
    const perpage = 2;
    const pageTotal = Math.ceil(totalResult / perpage);
    if (currentPage > pageTotal) {
      currentPage = pageTotal;
    }

    const minItem = (currentPage * perpage) - perpage + 1;
    const maxItem = (currentPage * perpage);
    const data = [];
    articles.forEach(function (item, i) {
      let itemNum = i + 1;
      if (itemNum >= minItem && itemNum <= maxItem) {
        data.push(item);
      }
    });
    const page = {
      pageTotal,
      currentPage,
      hasPre: currentPage > 1,
      hasNext: currentPage < pageTotal
    };
    // 分頁結束

    res.render('index', {
      articles: data,
      categories,
      striptags,
      moment,
      page
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
      categories: data,
      article,
      moment,
    });
  });
});


module.exports = router;
