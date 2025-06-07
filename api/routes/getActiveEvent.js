const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection

/**
 * Rota para obter eventos não finalizados por máquina
 */
router.get('/', async (req, res) => {
  try {
    // Obter ID da máquina dos parâmetros de consulta
    const { machineId } = req.query;
    
    if (!machineId) {
      return res.status(400).json({ 
        success: false,
        message: 'ID da máquina é obrigatório' 
      });
    }

    // Usar a view unfinished_events e juntar com EventDetails para filtrar por máquina
    const result = await db.query(`
      SELECT ue."eventid", ue."task_name", ue."startdatetime"
      FROM "view_unfinished_events" ue
      JOIN "eventdetails" ed ON ue."eventid" = ed."eventid"
      WHERE ed."systemid" = $1
    `, [machineId]);

    return res.status(200).json({ 
      success: true,
      events: result.rows // PostgreSQL retorna os resultados em `rows`
    });
  } catch (error) {
    console.error('Erro ao buscar eventos ativos:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar eventos ativos', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;