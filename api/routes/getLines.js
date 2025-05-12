const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão à base de dados

// Função para buscar as linhas da base de dados usando a view
async function getLinesFromDatabase() {
  try {
    // Assume que a view tem colunas como 'id' e 'nome' ou similar
    // Ajusta o nome das colunas conforme a tua view 'vw_maquinas_info'
    const [rows] = await db.query('SELECT * FROM view_maquinas_id_nome;'); // Seleciona as colunas necessárias da view
    return rows; // Retorna as linhas encontradas
  } catch (error) {
    console.error('Database error fetching lines:', error);
    throw new Error('Error fetching lines from database'); // Lança um erro para ser capturado no route handler
  }
}

router.get('/', async (req, res) => {
  try {
    const lines = await getLinesFromDatabase(); // Chama a função que busca os dados
    res.json({ lines }); // Retorna as linhas como JSON
  } catch (error) {
    // O erro já foi logado na função getLinesFromDatabase
    res.status(500).send(error.message || 'Error fetching lines'); // Envia a mensagem de erro
  }
});

module.exports = router;