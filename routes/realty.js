const { Router } = require('express');
const fs = require('fs');
const { validationResult } = require('express-validator');
const { realtyValidators } = require('../_helpers/validators');
const Estate = require('../models/estate');
const typeEstate = require('../_helpers/type-estate');
const auth = require('../middleware/auth');
const isOwner = require('../_helpers/isOwner');
const keys = require('../keys');

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
    const { BASE_URL } = keys;
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
      BASE_URL,
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

router.post('/edit', auth, realtyValidators, async (req, res) => {
  const { id } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/realty/${id}/edit?allow=true`);
  }
  try {
    delete req.body.id;
    const realty = await Estate.findById(id);

    if (!isOwner(realty, req)) {
      return res.redirect('/realty');
    }

    Object.assign(realty, req.body);
    await realty.save();
    res.redirect('/realty');
  } catch (error) {
    console.log(error);
  }
});

router.post('/remove', auth, async (req, res) => {
  const { id } = req.body;
  try {
    const deleted = await Estate.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (deleted.img.length !== 0) {
      deleted.img.map((item) => {
        fs.access(item, fs.constants.F_OK, (err) => {
          if (err) return;

          fs.unlink(item, (err) => {
            if (err) return;
            console.log('Estate img was deleted');
          });
        });
      });
    }

    res.redirect('/realty');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
