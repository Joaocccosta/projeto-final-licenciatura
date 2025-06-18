const WebSocket = require('ws');
const client = require('./client_notify');

// Configuração do cliente PostgreSQL para LISTEN
client.connect();
client.query('LISTEN dashboard_updates');

// Configuração do servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado ao WebSocket');

  client.on('notification', () => {
    console.log('Notificação recebida do PostgreSQL');
    ws.send(JSON.stringify({ update: true })); // Envia uma notificação genérica ao cliente
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket iniciado na porta 8080');