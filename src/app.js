// src/app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('./models/db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Ruta de registro
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.send('Error al registrar el usuario');
  }
});

// Ruta de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.send('Contraseña incorrecta');
    }

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.send('Error al iniciar sesión');
  }
});

// Ruta de cierre de sesión
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});

