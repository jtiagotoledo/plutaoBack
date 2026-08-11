require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { erro: 'Muitas requisições vindas deste IP. Tente novamente em alguns minutos.' }
});

const estudanteRoutes = require('./routes/estudanteRoutes');
const professorRoutes = require('./routes/professorRoutes');

const app = express();
const PORT = process.env.PORT||3005;

app.use(cors({
    origin: ['https://plutaofisica.dpdns.org', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-admin-key', 'x-student-hash']
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api/', limiter);

app.use('/api/estudante', estudanteRoutes);
app.use('/api/professor', professorRoutes);

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
    

