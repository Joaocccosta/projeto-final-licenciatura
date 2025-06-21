const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'producao_dashboard',
  port: 5432, // Porta padrão do PostgreSQL
});

module.exports = pool;