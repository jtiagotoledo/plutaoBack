const mongoose = require('mongoose');

const estudanteSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    nome: {
        type: String,
        required: true,
    },
    classe: {
        type: String,
        required: true,
    },
    numero: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Estudante', estudanteSchema);