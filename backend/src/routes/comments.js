const express = require('express');
const { createComment, deleteComment } = require('../controllers/comments');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// POST /api/comments/:gameId -> add a comment
router.post('/:gameId', createComment);

// DELETE /api/comments/:id -> delete a comment
router.delete('/:id', deleteComment);

module.exports = router;
