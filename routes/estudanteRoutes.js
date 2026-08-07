const express = require('express');
const router = express.Router();
const estudanteController = require('../controllers/estudanteController');

router.post('/login', estudanteController.obterPainelEstudante);
router.post('/entregar', estudanteController.enviarTarefa);

module.exports = router;