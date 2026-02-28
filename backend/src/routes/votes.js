const express = require('express');
const { voteVideojuego, getMyVote } = require('../controllers/votes');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// POST /api/votes/:id -> vote on a game
router.post('/:id', voteVideojuego);

// GET /api/votes/:id -> get current user's vote on a game
router.get('/:id', getMyVote);

module.exports = router;
