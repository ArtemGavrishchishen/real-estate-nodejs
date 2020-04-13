const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
  res.render('add', {
    title: 'Add page',
    isAdd: true,
  });
});

module.exports = router;
