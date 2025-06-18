const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'producao_dashboard',
  port: 5432,
});

module.exports = client;