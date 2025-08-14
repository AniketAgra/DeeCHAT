const express = require('express');
const indexRoutes = require('./routes/index.routes')

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public')); //this serves static files from the public directory

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoutes);

module.exports = app;