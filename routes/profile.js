const { Router } = require('express');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', auth, async (req, res) => {
  res.render('profile', {
    title: 'Profile page',
    isProfile: true,
  });
});

module.exports = router;
