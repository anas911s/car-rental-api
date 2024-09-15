const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'anas_911';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(409).json({ error: 'Username is already taken' });
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);  
      const user = await User.create({ username, password: hashedPassword });
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'An error occurred during registration' });
    }
  });
  

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ where: { username } });


        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Is Password Valid:', isPasswordValid);


        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });


        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const user = await User.findOne({
          where: { id },
          attributes: { exclude: ['password'] }
      });

      if (!user) {
          return res.status(404).json({ error: 'Not found' });
      }


      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'An error occurred while fetching user details' });
  }
});

module.exports = router;
