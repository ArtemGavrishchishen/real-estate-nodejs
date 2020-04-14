const { Router } = require('express');
const Estate = require('../models/estate');
const auth = require('../middleware/auth');
const role = require('../_helpers/role');

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

router.post('/', auth, async (req, res) => {
  if (req.session.user.role !== role.seller) {
    return res.redirect('/');
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
    img: req.body.img || [],
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
