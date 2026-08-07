const mongoose = require('mongoose');

const estudanteSchema = mongoose.Schema({
    hash: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    nome: {
        type: String,
        require: true,
    },
    classe: {
        type: String,
        require: true,
    },
    numero: {
        type: Number,
        require: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Estudante', estudanteSchema);