const express = require('express');
const router = express.Router();
const db = require('../db');

async function getEventTypes() {
  const [rows] = await db.query('SELECT * FROM vw_event_types');
  return rows;
}

router.get('/', async (req, res) => {
  try {
    const eventTypes = await getEventTypes();
    res.json({ eventTypes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching event types');
  }
});

module.exports = router;