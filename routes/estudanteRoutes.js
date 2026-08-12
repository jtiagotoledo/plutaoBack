const express = require('express');
const router = express.Router();
const estudanteController = require('../controllers/estudanteController');
const uploadFotosMiddleware = require('../middlewares/upload');

router.post('/login', estudanteController.obterPainelEstudante);
router.post('/entregas', uploadFotosMiddleware, estudanteController.enviarTarefa);
router.post('/painel', estudanteController.obterPainelEstudante);
router.put('/entregar', estudanteController.atualizarEntrega);

router.delete('/entregar', estudanteController.excluirEntrega);
router.delete('/entregas', estudanteController.excluirEntrega);

module.exports = router;