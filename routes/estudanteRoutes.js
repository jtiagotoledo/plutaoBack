const express = require('express');
const router = express.Router();
const estudanteController = require('../controllers/estudanteController');
const uploadSingleFoto = require('../middlewares/upload');

router.post('/upload', uploadSingleFoto, estudanteController.uploadFoto);
router.post('/login', estudanteController.obterPainelEstudante);
router.post('/entregar', estudanteController.enviarTarefa);
router.put('/entregar', estudanteController.atualizarEntrega);   // Substituir foto enviada
router.delete('/entregar', estudanteController.excluirEntrega);

module.exports = router;