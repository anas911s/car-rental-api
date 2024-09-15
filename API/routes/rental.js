const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Car = require('../models/Cars');
const Rental = require('../models/Rental');
const authenticateJWT = require('../routes/authenticateJWT');

router.post('/rentals', authenticateJWT, async (req, res) => {
  try {
    const { carId } = req.body;
    const user = req.user;

    if (!carId) {
      return res.status(400).json({ error: 'Car ID is required' });
    }

    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    if (car.status == 'true') {
      return res.status(400).json({ error: 'Car is already rented' });
    }
    await Rental.create({
      carId: car.id,
      userId: user.id,
      rentDate: new Date(),
    });

    // deze ga ik nog fixxen
    await car.update({ status: 'false' });

    res.status(200).json({ message: 'Car rented successfully' });

  } catch (error) {
    console.error('Error during rental:', error);
    res.status(500).json({ error: 'An error occurred during the rental process' });
  }
});

module.exports = router;
