const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('car_rental_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
