const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({ // Define a estrutura dos documentos que serão armazenados na coleção tasks do MongoDB
     title: {type: String, required: true},
     description: String,
     date: {type: Date, required: true},
     status: {type: Boolean, default:false}
})

module.exports = mongoose.model('Task', TaskSchema); // Cria um modelo baseado no 'TaskSchema'. O nome do modelo é 'Tasks'
// module.exports => exporta o modelo para que ele possa ser usado em outras partes da aplicação.