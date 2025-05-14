const pool = require('../db');


// Serviço para gerenciar usuários
const userService = {
  // Buscar usuário por login/username
  findUserByLogin: async (login) => {
    try {
      // console.log('Attempting to use pool.execute in findUserByLogin');
      const [rows] = await pool.execute(
        'SELECT * FROM Users WHERE Login = ?', 
        [login]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error); // This is where your current error is caught
      throw error;
    }
  },
  
  // Buscar usuário por ID
  findUserById: async (id) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Users WHERE ID = ?', 
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },
  
  // Incrementar tentativas de login falhas
  incrementFailedLoginAttempts: async (userId) => {
    try {
      const [result] = await pool.execute(
        'UPDATE Users SET FailedLoginAttempts = FailedLoginAttempts + 1 WHERE ID = ?',
        [userId]
      );
      
      return { affected: result.affectedRows };
    } catch (error) {
      console.error('Erro ao incrementar tentativas de login:', error);
      throw error;
    }
  },
  
  // Resetar tentativas de login falhas
  resetFailedLoginAttempts: async (userId) => {
    try {
      const [result] = await pool.execute(
        'UPDATE Users SET FailedLoginAttempts = 0 WHERE ID = ?',
        [userId]
      );
      
      return { affected: result.affectedRows };
    } catch (error) {
      console.error('Erro ao resetar tentativas de login:', error);
      throw error;
    }
  },
  
  // Atualizar último login
  updateLastLogin: async (userId) => {
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const [result] = await pool.execute(
        'UPDATE Users SET ModifiedDateTime = ? WHERE ID = ?',
        [now, userId]
      );
      
      return { affected: result.affectedRows };
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
      throw error;
    }
  }
};

module.exports = userService;