const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
  });
});

module.exports = router;
