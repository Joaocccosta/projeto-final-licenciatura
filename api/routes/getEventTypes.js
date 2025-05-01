const express = require('express');
const router = express.Router();

/*
const db = require('../db'); // Import your database connection

async function getEventTypes() {
  const [rows] = await db.query('SELECT typeName FROM EventTypes');
  return rows.map(row => row.typeName);
}*/

router.get('/', async (req, res) => {
  try {
    const eventTypes = await getEventTypes(); // Replace with your database logic
    res.json({ eventTypes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching event types');
  }
});

module.exports = router;