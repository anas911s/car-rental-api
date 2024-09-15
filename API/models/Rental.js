const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('../models/Users');
const Car = require('../models/Cars');

const Rental = sequelize.define('Rentals', {
  carId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cars',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  rentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Rental;
