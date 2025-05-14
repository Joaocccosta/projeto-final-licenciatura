const express = require('express');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

// Este endpoint serve mais para fins de registro/logging
// A invalidação real do token deve ser gerenciada pelo cliente
router.post('/', authenticateToken, (req, res) => {
  // Aqui você poderia implementar uma lista negra de tokens
  // ou invalidar sessões no servidor se necessário
  
  res.json({ 
    success: true, 
    message: 'Logout realizado com sucesso' 
  });
});

module.exports = router;