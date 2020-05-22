const { Router } = require('express');
const { validationResult } = require('express-validator');
const Estate = require('../models/estate');
const auth = require('../middleware/auth');
const role = require('../_helpers/role');
const { realtyValidators } = require('../_helpers/validators');

const router = Router();

router.get('/', auth, async (req, res) => {
  if (req.session.user.role !== role.seller) {
    return res.redirect('/');
  }
  res.render('add', {
    title: 'Add page',
    isAdd: true,
  });
});

router.post('/', auth, realtyValidators, async (req, res) => {
  if (req.session.user.role !== role.seller) {
    return res.redirect('/');
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add page',
      isAdd: true,
      errors: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        address: req.body.address,
        floor: req.body.floor,
        rooms: req.body.rooms,
        square: req.body.square,
        type: req.body.type,
        description: req.body.description,
        img: req.files.property || [],
        userId: req.user,
      },
    });
  }

  let imgSrc = [];
  if (req.files.property) {
    const files = req.files.property;
    imgSrc = files.map((file) => file.path);
  }

  const estate = new Estate({
    title: req.body.title,
    price: req.body.price,
    address: req.body.address,
    floor: req.body.floor,
    rooms: req.body.rooms,
    square: req.body.square,
    type: req.body.type,
    description: req.body.description,
    img: imgSrc,
    userId: req.user,
  });

  try {
    await estate.save();
    res.redirect('/realty');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
