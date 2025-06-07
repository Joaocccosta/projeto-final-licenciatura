const pool = require('../db');


// Serviço para gerenciar usuários
const userService = {
  // Buscar usuário por login/username
  findUserByLogin: async (login) => {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE login = $1',
        [login]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },
  
  // Buscar usuário por ID
  findUserById: async (id) => {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },
  
  // Incrementar tentativas de login falhas
  incrementFailedLoginAttempts: async (userId) => {
    try {
      const result = await pool.query(
        'UPDATE users SET failedloginattempts = failedloginattempts + 1 WHERE id = $1',
        [userId]
      );
      return { affected: result.rowCount };
    } catch (error) {
      console.error('Erro ao incrementar tentativas de login:', error);
      throw error;
    }
  },
  
  // Resetar tentativas de login falhas
  resetFailedLoginAttempts: async (userId) => {
    try {
      const result = await pool.query(
        'UPDATE users SET failedloginattempts = 0 WHERE id = $1',
        [userId]
      );
      return { affected: result.rowCount };
    } catch (error) {
      console.error('Erro ao resetar tentativas de login:', error);
      throw error;
    }
  },
  
  // Atualizar último login
  updateLastLogin: async (userId) => {
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const result = await pool.query(
        'UPDATE users SET modifieddatetime = $1 WHERE id = $2',
        [now, userId]
      );
      return { affected: result.rowCount };
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
      throw error;
    }
  }
};

module.exports = userService;