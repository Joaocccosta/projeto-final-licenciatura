const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/*In Express.js, the order in which you define middleware and routes matters. Requests flow through them sequentially.

Setup Phase: You first configure your Express application by defining routes (app.get, app.post, etc.) and applying middleware (app.use). This builds the request handling pipeline.
Listening Phase: app.listen() starts the HTTP server and makes it listen for incoming connections on the specified port.
It's crucial to complete the Setup Phase before starting the Listening Phase. If you call app.listen() before defining all your routes or middleware, the server might start listening before it knows how to handle certain requests.

In your case, although the code snippet didn't explicitly show app.listen misplaced within the route definitions, ensuring it's the absolute last thing called guarantees that all preceding app.use() and app.get() calls have successfully registered their respective handlers with the Express application before it starts accepting requests. This prevents situations where a request might arrive before its corresponding handler has been fully set up.*/

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

// Mounting the routers at their respective endpoints
app.use('/api/getlines', getlinesRouter); // Mount the router at /api/getlines
app.use('/api/getOEE', getOEERouter); // Mount the router at /api/getOEE
app.use('/api/getEventTypes', getEventTypesRouter); // Mount the router at /api/getEventTypes
app.use('/api/saveEvent', saveEventRouter); // Mount the router at /api/saveEvent
app.use('/api/getRefresh', getRefreshRouter); // Mount the router at /api/getRefresh
app.use('/api/getOrder', getOrderRouter); // Mount the router at /api/getOrder


// get values from the database, using the file getValues.js that connects to the database and returns the values, that is inside the folder routes
const valuesRouter = require('./routes/getValues.js'); // Rename variable for clarity
app.use('/api/values', valuesRouter); // Mount the router at /api/values


// in case of error, send the error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Beginning message
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});