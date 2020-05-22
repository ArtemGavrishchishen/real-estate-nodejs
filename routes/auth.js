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
    isLoginTabs: true,
    errors: req.flash('errors'),
  });
});

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { role, email, name, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        errors: errors.array()[0].msg,
        isRegisterTabs: true,
        data: {
          role: req.body.role,
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          confirm: req.body.confirm,
        },
      });
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
      req.flash('errors', errors.array()[0].msg);
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
      req.flash('errors', 'Enter the correct password');
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

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth#login');
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect('/auth#login');
    } else {
      res.render('auth/password', {
        title: 'Restore access',
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (error) {
    console.log(error);
  }
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
        console.log(`http://localhost:5000/auth/password/${token}`);
        res.redirect('/auth#login');
      } else {
        res.redirect('/auth/reset');
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;

      await user.save();
      res.redirect('/auth#login');
    } else {
      res.redirect('/auth#login');
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
