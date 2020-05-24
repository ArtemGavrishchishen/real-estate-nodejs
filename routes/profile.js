const { Router } = require('express');
const fs = require('fs');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', auth, async (req, res) => {
  res.render('profile', {
    title: 'Profile page',
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toChange = {};

    if (req.body.name) {
      toChange.name = req.body.name;
    }

    if (req.files.avatar) {
      const oldAvatar = user.avatarUrl;

      if (oldAvatar) {
        fs.access(oldAvatar, fs.constants.F_OK, (err) => {
          if (err) return;

          fs.unlink(oldAvatar, (err) => {
            if (err) return;
            console.log('Old avatar was deleted');
          });
        });
      }

      const avatars = req.files.avatar;
      toChange.avatarUrl = avatars[0].path;
    }

    Object.assign(user, toChange);
    await user.save();

    res.redirect('/profile');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
