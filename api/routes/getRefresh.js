const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection

// Function to get refresh interval from database
async function getRefreshValue() {
  try {
    const [rows] = await db.query("SELECT SettingValue AS refresh_interval_seconds FROM SystemSettings WHERE SettingKey = 'refresh_interval_seconds'");
    
    if (rows.length === 0) {
      // Default value if not found in database
      return 30; // Default 30 seconds
    }
    
    return parseInt(rows[0].refresh_interval_seconds, 10);
  } catch (error) {
    console.error('Database error fetching refresh interval:', error);
    return 30; // Default fallback value
  }
}

router.get('/', async (req, res) => {
  try {
    const refreshSeconds = await getRefreshValue();
    res.json({ refreshSeconds });
  } catch (error) {
    console.error('Error fetching refresh value:', error);
    res.status(500).json({ 
      error: 'Error fetching refresh value',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;