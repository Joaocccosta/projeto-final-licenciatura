const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a ligação à base de dados

// Função para obter o intervalo de refresh da base de dados
async function getRefreshValue() {
  try {
    const result = await db.query(
      `SELECT "settingvalue"::INT AS refresh_interval_seconds 
       FROM "systemsettings" 
       WHERE "settingkey" = 'refresh_interval_seconds'`
    );

    if (result.rows.length === 0) {
      // Valor por defeito se não existir na base de dados
      return 30; // 30 segundos por defeito
    }

    return result.rows[0].refresh_interval_seconds;
  } catch (error) {
    console.error('Erro na base de dados ao obter o intervalo de refresh:', error);
    return 30; // Valor de fallback por defeito
  }
}

// Endpoint para obter o valor de refresh
router.get('/', async (req, res) => {
  try {
    const refreshSeconds = await getRefreshValue();
    res.json({ refreshSeconds });
  } catch (error) {
    console.error('Erro ao obter valor de refresh:', error);
    res.status(500).json({ 
      error: 'Erro ao obter valor de refresh',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;