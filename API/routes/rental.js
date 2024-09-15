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

router.delete('/user/delete/:id', authenticateJWT, async (req, res) => {
    try {
        const rentalId = req.params.id;
        const user = req.user;

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Huurboeking niet gevonden' });
        }

        console.log(rentalId);
        if (rental.userId !== user.id) {
            return res.status(403).json({ error: 'Geen toegang om deze huurboeking te annuleren' });
        }

        const car = await Car.findByPk(rental.carId);
        if (!car) {
            return res.status(404).json({ error: 'Auto niet gevonden' });
        }
        let currentVariety = Number(car.variety);
        if (currentVariety !== null) {
            const updatedVariety = currentVariety + 1;
            await car.update({ variety: updatedVariety });
        }
        await rental.destroy();

        if (car.variety > 0) {
            await car.update({ status: 'true' });
        } else {
            await car.update({ status: 'false' });
        }

        res.status(200).json({ message: 'Huurboeking succesvol geannuleerd' });
    } catch (error) {
        console.error('Error during cancellation:', error);
        res.status(500).json({ error: 'An error occurred during the cancellation process' });
    }
});


module.exports = router;
