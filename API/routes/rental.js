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
        return res.status(400).json({ error: 'Geen id' });
      }
  
      const car = await Car.findByPk(carId);
      if (!car) {
        return res.status(404).json({ error: 'Auto niet gevonden' });
      }
  
      if (car.status === 'false') {
        return res.status(400).json({ error: 'Auto is niet beschikbaar' });
      }
  
      await Rental.create({
        carId: car.id,
        userId: user.id,
        rentDate: new Date(),
      });

      if(!car.variety == 0) {
      const updatedVariety = car.variety - 1;
      await car.update({ variety: updatedVariety });
      }
      
      if (car.variety === 0) {
        await car.update({ status: 'false' });
      }
      if (car.variety > 0) {
        await car.update({ status: 'true' });
        res.status(200).json({ message: 'Succesvol gehuurd' });
      }

    } catch (error) {
      console.error('Error during rental:', error);
      res.status(500).json({ error: 'An error occurred during the rental process' });
    }
  });
  

router.get('/user/:userId', async (req, res) => {
    try {
      const rentals = await Rental.findAll({
        where: { userId: req.params.userId },
        include: {
          model: Car,
          attributes: ['brand', 'year', 'transmission', 'doors', 'horsepower', 'price', 'status', 'variety', 'image', 'location']
        }
      });
  
      if (!rentals.length) {
        return res.status(200).json({ message: 'Nog geen auto gehuurd' });
      }
  
      return res.status(200).json(rentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      return res.status(500).json({ error: 'Failed to fetch rentals.' });
    }
  });

module.exports = router;
