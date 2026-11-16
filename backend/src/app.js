const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json())

const equipmentRouters = require('./routers/equipmentRouters');
const localRouters = require('./routers/localRouters');
const technicianRouters = require('./routers/technicianRouters');
const categoryRouters = require('./routers/categoryRouters');
const workOrderRouters = require('./routers/workOrderRouters');

app.use('/equipments', equipmentRouters)
app.use('/locals', localRouters)
app.use('/technicians', technicianRouters)
app.use('/categories', categoryRouters)
app.use('/work-orders', workOrderRouters)

module.exports = app;