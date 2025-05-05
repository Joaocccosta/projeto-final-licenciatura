const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão à base de dados

// Rota para buscar a ordem de produção mais recente e o timestamp para uma máquina específica
router.get('/:machineId', async (req, res) => {
  const { machineId } = req.params;

  // Validação básica do ID da máquina
  if (!machineId || isNaN(parseInt(machineId))) {
    return res.status(400).json({ error: 'ID da máquina inválido ou não fornecido.' });
  }

  try {
    // Query para buscar o codigo_ordem e o timestamp mais recente para a máquina_id especificada
    // Ordena por timestamp descendente para obter o registo mais recente
    const query = `
      SELECT
        codigo_ordem,
        timestamp
      FROM vw_indicadores_producao
      WHERE maquina_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `;

    const [rows] = await db.query(query, [parseInt(machineId)]);

    // Verifica se encontrou algum registo
    if (rows.length > 0) {
      const latestOrder = rows[0];
      // Formata o timestamp se necessário (ex: para remover a parte do tempo ou ajustar fuso horário)
      // Exemplo simples: apenas retorna o que veio da BD
      res.json({
        codigo_ordem: latestOrder.codigo_ordem,
        data_inicio: latestOrder.timestamp // Renomeia 'timestamp' para 'data_inicio' na resposta
      });
    } else {
      // Se não encontrou registos para essa máquina
      res.status(404).json({ message: 'Nenhuma ordem de produção encontrada para a máquina especificada.' });
    }
  } catch (error) {
    console.error('Database error fetching order:', error);
    res.status(500).json({ error: 'Erro ao buscar a ordem de produção no servidor.' });
  }
});

module.exports = router;