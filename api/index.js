require('dotenv').config();
require('./notify_backend'); // Inicia o sistema de notificações
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON no body das requisições
app.use(express.json());

// Endpoint para verificar o estado da API
app.get('/api/status', (req, res) => {
  res.json({ message: 'API is running' });
});

// Importação das rotas da pasta routes
const getlinesRouter = require('./routes/getLines.js');
const getOEERouter = require('./routes/getOEE.js');
const getEventTypesRouter = require('./routes/getEventTypes.js');
const saveEventRouter = require('./routes/saveEvent.js');
const getRefreshRouter = require('./routes/getRefresh.js');
const closeEventRouter = require('./routes/closeEvent.js');
const getActiveEventsRouter = require('./routes/getActiveEvent.js');

// Rotas de autenticação
const loginRouter = require('./routes/auth/login.js');
const userRouter = require('./routes/auth/user.js');
const logoutRouter = require('./routes/auth/logout.js');

// Montar as rotas nos respetivos endpoints
app.use('/api/getlines', getlinesRouter);
app.use('/api/getoee', getOEERouter);
app.use('/api/geteventtypes', getEventTypesRouter);
app.use('/api/saveevent', saveEventRouter);
app.use('/api/getrefresh', getRefreshRouter);
app.use('/api/closeevent', closeEventRouter);
app.use('/api/getactiveevents', getActiveEventsRouter);

// Montar rotas de autenticação
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/user', userRouter);
app.use('/api/auth/logout', logoutRouter);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro no servidor!');
});

// Mensagem de arranque do servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});