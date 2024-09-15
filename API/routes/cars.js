const express = require('express');
const router = express.Router();
const Car = require('../models/Cars');

router.get('/', async (req, res) => {
    try {
      const cars = await Car.findAll();
      res.json(cars);
      if (cars.variety > 0) {
        await cars.update({ status: 'true' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/:id', async (req, res) => {
    try {
      const car = await Car.findByPk(req.params.id);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json(car);
    } catch (error) {
      console.error('Error fetching car:', error);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
