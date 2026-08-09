const express = require('express');
const router = express.Router();
const estudanteController = require('../controllers/estudanteController');
const uploadSingleFoto = require('../middlewares/upload');

router.post('/upload', uploadSingleFoto, estudanteController.uploadFoto);
router.post('/login', estudanteController.obterPainelEstudante);
router.post('/entregar', estudanteController.enviarTarefa);

module.exports = router;