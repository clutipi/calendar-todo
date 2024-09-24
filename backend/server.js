// Importações
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRoute = require('./routes/tasks');
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/doto_db';

// Instânciando express
const app = express();

// Middleware
app.use(express.json()); //configura o servidor para entender e lidar com requisições no formato json
app.use(cors()); // ativa cors, permitindo que o servidor aceite requisições de outros domínios
app.use('/tasks', tasksRoute);

// Conectando com o MongoDB
mongoose.connect(MONGO_URI);

// Monitorando a conexão
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão ao MongoDB:')); // se ocorrer algum erro, será logado no console
db.once('open', () => {
  console.log('Conectado ao MongoDB'); // quando a conexão ocorre com sucesso, loga 'Conectado ao MongoDB' no console.
});

// Inicie o servidor
app.listen(PORT, () => {
     console.log(`Servidor rodando na porta ${PORT}`);
}); // servidor pronto para receber requisições.