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
    
    if (!user || user.enabled !== true) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário inválido ou desativado' 
      });
    }
    
    // Verificar se conta está bloqueada
    if (user.locked === true) {
      return res.status(401).json({ 
        success: false, 
        message: 'Conta bloqueada. Entre em contato com o administrador.' 
      });
    }
    
    // Verificar hash da senha
    const passwordMatch = await bcrypt.compare(password, user.passwordhash);
    
    if (!passwordMatch) {
      // Incrementar tentativas de login falhas
      await userService.incrementFailedLoginAttempts(user.id);
      
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }
    
    // Reset failed login attempts
    if (user.failedloginattempts > 0) {
      await userService.resetFailedLoginAttempts(user.id);
    }
    
    // Criar payload do token JWT
    const tokenPayload = {
      userId: user.id,
      username: user.login,
      isAdmin: user.isadministrator === true,
      isAuditor: user.isauditor === true
    };
    
    // Gerar token JWT (expiração em 8 horas)
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });
    
    // Atualizar último login
    await userService.updateLastLogin(user.id);
    
    // Responder com sucesso e token
    return res.json({
      success: true, 
      token,
      user: {
        id: user.id,
        name: user.name,
        isAdmin: user.isadministrator === true,
        email: user.email
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