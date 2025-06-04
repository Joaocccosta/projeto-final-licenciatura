const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection

router.use(express.json());

/**
 * Rota para finalizar um evento existente
 * Espera receber: { eventId }
 */
router.post('/', async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ 
        success: false,
        message: 'ID do evento é obrigatório' 
      });
    }

    // Verificar se o evento existe e obter data de início
    const eventData = await db.query(
      'SELECT "EventID", "StartDateTime" FROM "EventDetails" WHERE "EventID" = $1',
      [eventId]
    );
    
    if (eventData.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Evento não encontrado' 
      });
    }
    
    // Obter data e hora atual
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
    // Atualizar o evento para finalizado e desativado
    await db.query(
      `UPDATE "EventDetails" 
       SET "EndDateTime" = $1, 
           "IsComplete" = 1,
           "IsActive" = 0
       WHERE "EventID" = $2`,
      [formattedDate, eventId]
    );

    return res.status(200).json({ 
      success: true,
      message: 'Evento finalizado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao finalizar evento:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao finalizar evento', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;