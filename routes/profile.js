const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
  res.render('profile', {
    title: 'Profile page',
    isProfile: true,
  });
});

module.exports = router;
