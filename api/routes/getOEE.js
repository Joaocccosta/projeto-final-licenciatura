const express = require('express');
const router = express.Router();

router.get('/:lineId', async (req, res) => {
  const { lineId } = req.params;
  try {
    const oeeValues = await getOEEValues(lineId); // Replace with your database logic
    res.json({ lineId, oeeValues });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching OEE values');
  }
});

module.exports = router;