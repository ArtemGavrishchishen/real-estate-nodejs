const { Router } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = Router();

router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
  });
});

router.post('/register', async (req, res) => {
  try {
    const { role, email, name, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      role,
    });

    await user.save();
    res.redirect('/auth#login');
  } catch (error) {
    console.log(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });
    const areSame = await bcrypt.compare(password, candidate.password);

    if (areSame) {
      req.session.user = candidate;
      req.session.isAuthenticated = true;
      req.session.save((err) => {
        if (err) {
          throw err;
        }
        res.redirect('/');
      });
    } else {
      res.redirect('/auth#login');
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth#login');
  });
});

module.exports = router;
