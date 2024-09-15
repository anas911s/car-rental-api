const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

User.beforeCreate(async (user) => {
    if (!user.password.startsWith('$2b$')) {
     user.password = await bcrypt.hash(user.password, 10);
    }
});

module.exports = User;
