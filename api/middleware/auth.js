const jwt = require('jsonwebtoken');

// Chave secreta para assinar tokens JWT (use uma variável de ambiente em produção)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Extrai o token do header
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Autenticação necessária' 
    });
  }
  
  // Verifica o token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};