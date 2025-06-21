const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão à base de dados

// Função para procurar as linhas da base de dados usando a view
async function getLinesFromDatabase() {
  try {
    const result = await db.query('SELECT * FROM "view_machines_id_name";'); 
    return result.rows; 
  } catch (error) {
    console.error('Database error fetching lines:', error);
    throw new Error('Error fetching lines from database');
  }
}

router.get('/', async (req, res) => {
  try {
    const lines = await getLinesFromDatabase();
    res.json({ lines }); // Retorna as linhas como JSON
  } catch (error) {
    res.status(500).send(error.message || 'Error fetching lines'); // Envia a mensagem de erro
  }
});

module.exports = router;