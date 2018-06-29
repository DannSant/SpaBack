const express = require('express')
const app = express()

app.use(require('./login'));
app.use(require('./user'));
app.use(require('./therapist'));
app.use(require('./service'));
app.use(require('./branchOffice'));



module.exports = app;