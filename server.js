require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const estudanteRoutes = require('./routes/estudanteRoutes');

const app = express();
const PORT = process.env.PORT||3005;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

app.use('/api/estudantes', estudanteRoutes);

app.get('/api/health',(req,res)=>{
    res.json({status:'ok',message:`Servidor rodando perfeitamente na porta: ${PORT}` });
});

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('db mongo conectado');
        app.listen(PORT,()=>{
            console.log(`Servidor rodando na porta ${PORT}`)
        });
    }).catch((err)=>{
        console.error('Erro ao conectar no MongoDB:', err.message);
    });
    

