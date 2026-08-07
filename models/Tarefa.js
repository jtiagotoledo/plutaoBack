const mongoose = require('mongoose');

const tarefaSchema = mongoose.Schema({
    semana: {
        type: Number,
        require: true,
    },
    titulo: {
        type: String,
        require: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Tarefa', tarefaSchemaSchema);