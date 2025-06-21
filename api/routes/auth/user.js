const express = require('express');
const userService = require('../../services/userService');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Procurar dados atualizados do usuário
    const user = await userService.findUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Retornar dados do usuário (omitindo informações sensíveis)
    return res.json({
      success: true,
      user: {
        id: user.ID,
        name: user.Name,
        email: user.Email,
        isAdmin: user.IsAdministrator === 1,
        isAuditor: user.IsAuditor === 1,
        type: user.Type,
        lastLogin: user.LastLoginDateTime
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;