const express = require('express');
const router = express.Router();
const estudanteController = require('../controllers/estudanteController');
const uploadSingleFoto = require('../middlewares/upload');

router.post('/login', estudanteController.obterPainelEstudante);
router.post('/entregas', uploadFotosMiddleware, estudanteController.enviarTarefa);
router.put('/entregar', estudanteController.atualizarEntrega);  
router.delete('/entregar', estudanteController.excluirEntrega);

module.exports = router;