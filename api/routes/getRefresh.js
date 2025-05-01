const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const refreshValue = await getRefreshValue(); // Replace with your database logic
    res.json({ refreshValue });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching refresh value');
  }
});

/*
const db = require('../db'); // Import your database connection

async function getRefreshValue() {
  const [rows] = await db.query('SELECT value FROM RefreshValue LIMIT 1');
  if (rows.length === 0) {
    throw new Error('Refresh value not set');
  }
  return rows[0].value;
}

module.exports = getRefreshValue;*/

module.exports = router;