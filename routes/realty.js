const { Router } = require('express');
const Estate = require('../models/estate');
const typeEstate = require('../_helpers/type-estate');

const router = Router();

const data = [
  {
    title: 'Card Title 1',
    price: 5000,
    address: '850 METROPOLITAN AVENUE, #4F',
    floor: 5,
    rooms: 2,
    square: 150,
    description:
      'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.',
    img: [
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    ],
    userId: 'qq11',
    name: 'Name Surname',
  },
  {
    title: 'Card Title 2',
    price: 3000,
    address: '850 METROPOLITAN AVENUE, #3A',
    floor: 1,
    rooms: 1,
    square: 50,
    description:
      'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.',
    img: [
      'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    ],
    userId: 'qq11',
  },
  {
    title: 'Card Title 3',
    price: 7500,
    address: '850 METROPOLITAN AVENUE, #4BD',
    floor: 15,
    rooms: 5,
    square: 250,
    description:
      'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.',
    img: [
      'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    ],
    userId: 'qq11',
  },
];

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
      rentals: data,
      sales: [data[2], data[0]],
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
