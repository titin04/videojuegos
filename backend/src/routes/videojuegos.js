const express = require('express');
const {
    getAllVideojuegos,
    getMyVideojuegos,
    getVideojuegoById,
    createVideojuego,
    deleteVideojuego
} = require('../controllers/videojuegos');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes are protected in Version 2
router.use(authMiddleware);

router.get('/', getAllVideojuegos);
router.get('/mine', getMyVideojuegos);
router.get('/:id', getVideojuegoById);
router.post('/', createVideojuego);
router.delete('/:id', deleteVideojuego);

module.exports = router;
