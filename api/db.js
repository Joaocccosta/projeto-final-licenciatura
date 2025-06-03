const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres', // Substitua pelo usuário do PostgreSQL
  password: 'root', // Substitua pela senha do PostgreSQL
  database: 'producao_dashboard',
  port: 5432, // Porta padrão do PostgreSQL
  max: 10, // Limite de conexões
  idleTimeoutMillis: 30000, // Tempo de espera para conexões inativas
  connectionTimeoutMillis: 2000 // Tempo limite para conexão
});

module.exports = pool;