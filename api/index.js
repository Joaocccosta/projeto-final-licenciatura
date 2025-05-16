require('dotenv').config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON no body das requisições
app.use(express.json());

// api status endpoint
app.get('/api/status', (req, res) => {
  res.json({ message: 'API is running' });
});

// API Methods

// Importing the routes from the routes folder
const getlinesRouter = require('./routes/getLines.js');
const getOEERouter = require('./routes/getOEE.js');
const getEventTypesRouter = require('./routes/getEventTypes.js');
const saveEventRouter = require('./routes/saveEvent.js');
const getRefreshRouter = require('./routes/getRefresh.js');
const getOrderRouter = require('./routes/getOrder.js');

// Auth routes
const loginRouter = require('./routes/auth/login.js');
const userRouter = require('./routes/auth/user.js');
const logoutRouter = require('./routes/auth/logout.js');

// Mounting the routers at their respective endpoints
app.use('/api/getlines', getlinesRouter);
app.use('/api/getoee', getOEERouter);
app.use('/api/geteventtypes', getEventTypesRouter);
app.use('/api/saveevent', saveEventRouter);
app.use('/api/getrefresh', getRefreshRouter);
app.use('/api/getorder', getOrderRouter);

// Mounting auth routes
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/user', userRouter);
app.use('/api/auth/logout', logoutRouter);

// in case of error, send the error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Beginning message
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});