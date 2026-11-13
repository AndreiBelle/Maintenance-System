const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json())

const equipmentRouters = require('./routers/equipmentRouters');
const localRouters = require('./routers/localRouters');
const technicianRouters = require('./routers/technicianRouters');

app.use('/equipments', equipmentRouters)
app.use('/locals', localRouters)
app.use('/technicians', technicianRouters)

module.exports = app;