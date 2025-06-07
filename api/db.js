const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres', // Substitua pelo usuário do PostgreSQL
  password: 'root', // Substitua pela senha do PostgreSQL
  database: 'producao_dashboard',
  port: 5432, // Porta padrão do PostgreSQL
});

module.exports = pool;