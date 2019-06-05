const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase-admin');

const categoriesRef = firebaseAdminDb.ref('categories');

router.get('/archives', function (req, res, next) {
  res.render('dashboard/archives');
});

router.get('/article', function (req, res, next) {
  res.render('dashboard/article');
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