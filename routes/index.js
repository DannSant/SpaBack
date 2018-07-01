const express = require('express')
const app = express()

//=======================
// Rutas de Catalogos
//=======================
app.use(require('./login'));
app.use(require('./user'));
app.use(require('./therapist'));
app.use(require('./service'));
app.use(require('./branchOffice'));
app.use(require('./serviceDay'));

//=======================
// Rutas de Hechos
//=======================
app.use(require('./appointment'));


module.exports = app;