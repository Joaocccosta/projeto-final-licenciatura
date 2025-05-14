const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../../services/userService');
const { JWT_SECRET } = require('../../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validação básica
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuário e senha são obrigatórios' 
      });
    }
    
    // Buscar usuário no banco de dados
    const user = await userService.findUserByLogin(username);
    
    if (!user || user.Enabled !== 1) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário inválido ou desativado' 
      });
    }
    
    // Verificar se conta está bloqueada
    if (user.Locked === 1) {
      return res.status(401).json({ 
        success: false, 
        message: 'Conta bloqueada. Entre em contato com o administrador.' 
      });
    }
    
    // Verificar hash da senha
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    
    if (!passwordMatch) {
      // Incrementar tentativas de login falhas
      await userService.incrementFailedLoginAttempts(user.ID);
      
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }
    
    // Reset failed login attempts
    if (user.FailedLoginAttempts > 0) {
      await userService.resetFailedLoginAttempts(user.ID);
    }
    
    // Criar payload do token JWT
    const tokenPayload = {
      userId: user.ID,
      username: user.Login,
      isAdmin: user.IsAdministrator === 1,
      isAuditor: user.IsAuditor === 1
    };
    
    // Gerar token JWT (expiração em 8 horas)
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });
    
    // Atualizar último login
    await userService.updateLastLogin(user.ID);
    
    // Responder com sucesso e token
    return res.json({
      success: true, 
      token,
      user: {
        id: user.ID,
        name: user.Name,
        isAdmin: user.IsAdministrator === 1,
        email: user.Email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;