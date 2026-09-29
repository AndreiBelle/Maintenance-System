const express = require('express');
const app = express();

app.use(express.json())

const equipmentRouters = require('./routers/equipmentRouters');

app.use('/equipments', equipmentRouters)

module.exports = app;