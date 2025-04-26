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

module.exports = router;