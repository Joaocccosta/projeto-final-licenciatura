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

/*
const db = require('../db'); // Import your database connection

async function saveEvent(event) {
  const { lineId, eventType, timestamp, comment } = event;

  // Get the eventTypeId from the EventTypes table
  const [eventTypeRow] = await db.query('SELECT id FROM EventTypes WHERE typeName = ?', [eventType]);
  if (!eventTypeRow) {
    throw new Error('Invalid event type');
  }

  const eventTypeId = eventTypeRow.id;

  // Insert the event into the Events table
  await db.query(
    'INSERT INTO Events (lineId, eventTypeId, timestamp, comment) VALUES (?, ?, ?, ?)',
    [lineId, eventTypeId, timestamp, comment || null]
  );
}

module.exports = saveEvent; */


module.exports = router;