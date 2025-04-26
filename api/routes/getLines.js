const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lines = await getLinesFromDatabase(); // Replace with your database logic
    res.json({ lines });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lines');
  }
});

module.exports = router;