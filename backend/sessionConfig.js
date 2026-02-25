// Konfigurasi session (pakai memory store untuk sementara)
const session = require('express-session');

module.exports = session({
  secret: process.env.SESSION_SECRET || 'supersecretkeyyangpanjangbanget',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, 
    httpOnly: true,
    secure: false // set true jika pakai https
  }
});
