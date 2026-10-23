const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json())

const equipmentRouters = require('./routers/equipmentRouters');

app.use('/equipments', equipmentRouters)

module.exports = app;