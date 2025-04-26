const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const event = req.body;
  try {
    await saveEvent(event); // Replace with your database logic
    res.status(201).send('Event saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving event');
  }
});

// METHOD: POST
// URL: /api/saveEvent
// BODY: { "event": { "lineId": "line1", "eventType": "type1", "timestamp": "2023-10-01T12:00:00Z, "comment": "...." } }



module.exports = router;