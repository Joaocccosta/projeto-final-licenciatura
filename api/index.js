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