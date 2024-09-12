const express = require('express');
const app = express();
const sequelize = require('./config/db');
const carRoutes = require('./routes/cars');
const userRoutes = require('./routes/users');
const PORT = 3000;

app.use(express.json());

app.use('/cars', carRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API werkt');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
