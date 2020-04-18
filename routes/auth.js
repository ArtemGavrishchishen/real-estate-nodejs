const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const {
  registerValidators,
  loginValidators,
} = require('../_helpers/validators');

const User = require('../models/user');

const router = Router();

router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
  });
});

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { role, email, name, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth#register');
    }

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

router.post('/login', loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('loginError', errors.array()[0].msg);
      return res.status(422).redirect('/auth#login');
    }

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

//=== Reset Password
router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Forgot your password?',
  });
});

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;

        await candidate.save();
        res.redirect('/auth#login');
      } else {
        res.redirect('/auth#reset');
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
