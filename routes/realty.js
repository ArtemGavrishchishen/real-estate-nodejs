const { Router } = require('express');
const Estate = require('../models/estate');
const typeEstate = require('../_helpers/type-estate');

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
      rentals,
      sales,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const estate = await Estate.findById(req.params.id).lean();

    res.render('estate', {
      layout: 'empty',
      title: estate.title,
      estate,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
