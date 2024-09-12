const express = require('express');
const router = express.Router();
const Car = require('../models/Cars');

router.get('/', async (req, res) => {
  const cars = await Car.findAll();
  res.json(cars);
});

router.post('/', async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    car.status = status;
    await car.save();
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
