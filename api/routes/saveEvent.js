const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection

// Middleware para processar JSON
router.use(express.json());

/**
 * Função para salvar um evento no banco de dados
 * @param {Object} event - Objeto contendo os detalhes do evento
 * @returns {Promise<boolean>} - Indica se o evento foi salvo com sucesso
 */
async function saveEvent(event) {
  const { machineId, eventTypeId, comment } = event;
  
  // Verificar se o tipo de evento existe
  const [eventTypeRows] = await db.query(
    'SELECT id FROM event_types WHERE id = ?', 
    [eventTypeId]
  );
  
  if (eventTypeRows.length === 0) {
    throw new Error(`Tipo de evento inválido: ${eventTypeId}`);
  }

  // Data e hora atual para o início do evento
  const startDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  // Verificar se já existe um evento com informações idênticas
  const [existingEvents] = await db.query(
    `SELECT EventID FROM EventDetails 
     WHERE SystemID = ? 
     AND EventCategoryID = ? 
     AND StartDateTime = ? 
     AND (Comments = ? OR (Comments IS NULL AND ? IS NULL))`,
    [
      machineId,
      eventTypeId,
      startDateTime,
      comment,
      comment
    ]
  );
  
  if (existingEvents.length > 0) {
    console.log('Evento duplicado detectado. Não foi inserido.');
    return false;
  }
  
  // Inserir o evento na tabela EventDetails
  const [result] = await db.query(
    `INSERT INTO EventDetails 
     (StartDateTime, SystemID, EventCategoryID, IsActive, IsComplete, Comments) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      startDateTime,
      machineId,
      eventTypeId,
      1, // Ativo
      0, // Não completo
      comment || null
    ]
  );
  
  return true;
}

/**
 * Rota para salvar um novo evento
 * Espera receber: { machineId, eventTypeId, comment? }
 */
router.post('/', async (req, res) => {
  try {
    // Validar dados de entrada
    const { machineId, eventTypeId, comment } = req.body;
    
    if (!machineId || !eventTypeId) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: machineId e eventTypeId'
      });
    }
    
    // Salvar o evento
    const saved = await saveEvent({ machineId, eventTypeId, comment });
    
    if (saved) {
      // Responder com sucesso
      res.status(201).json({
        success: true,
        message: 'Evento registrado com sucesso'
      });
    } else {
      // Evento duplicado
      res.status(200).json({
        success: true,
        message: 'Evento não registrado (duplicado)'
      });
    }
  } catch (error) {
    console.error('Erro ao salvar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar evento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;