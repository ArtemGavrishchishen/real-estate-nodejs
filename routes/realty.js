const { Router } = require('express');
const Estate = require('../models/estate');
const typeEstate = require('../_helpers/type-estate');
const auth = require('../middleware/auth');
const isOwner = require('../_helpers/isOwner');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const estate = await Estate.find()
      .populate('userId', 'name email')
      .select('title price address floor rooms square type img')
      .lean();

    const rentals = estate.filter((est) => est.type === typeEstate.rentals);
    const sales = estate.filter((est) => est.type === typeEstate.sales);

    res.render('realty', {
      title: 'Realty',
      isRealty: true,
      userId: req.user ? req.user._id.toString() : null,
      rentals,
      sales,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const estate = await Estate.findById(req.params.id)
      .populate('userId', 'name email avatarUrl')
      .lean();
    const isArrImg = estate.img.length > 1 ? true : false;

    res.render('estate', {
      layout: 'empty',
      title: estate.title,
      estate,
      isArrImg,
      agent: estate.userId,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  try {
    const estate = await Estate.findById(req.params.id).lean();
    if (!isOwner(estate, req)) {
      return res.redirect('/realty');
    }

    res.render('estate-edit', {
      title: `Edit ${estate.title}`,
      estate,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
