const express = require('express');
const router = express.Router();

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