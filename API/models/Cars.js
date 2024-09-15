const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Rental = require('../models/Rental');

const Car = sequelize.define('Car', {
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doors: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  renter_dob: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  horsepower: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  variety: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  
}, {
  timestamps: true,
});

Rental.belongsTo(Car, { foreignKey: 'carId' });
Car.hasMany(Rental, { foreignKey: 'carId' });

module.exports = Car;
