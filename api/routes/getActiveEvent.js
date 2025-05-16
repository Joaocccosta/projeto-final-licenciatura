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
    const [rows] = await db.query(`
      SELECT ue.EventID, ue.task_name, ue.StartDateTime
      FROM unfinished_events ue
      JOIN EventDetails ed ON ue.EventID = ed.EventID
      WHERE ed.SystemID = ?
    `, [machineId]);

    return res.status(200).json({ 
      success: true,
      events: rows 
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