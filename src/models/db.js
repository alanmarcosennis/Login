// src/models/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = 'mongodb://localhost:27017';


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useNewUrlParser: true, // Cambio realizado: utiliza useNewUrlParser en lugar de useFindAndModify
}).then(() => {
  console.log('Conexión a la base de datos establecida.');
}).catch((error) => {
  console.error('Error de conexión a la base de datos:', error);
});
