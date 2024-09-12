const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
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

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
