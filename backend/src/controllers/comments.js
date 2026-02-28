const prisma = require('../lib/prisma');

const createComment = async (req, res) => {
    const { gameId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                userId: req.user.id,
                videojuegoId: gameId
            },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Error creating comment' });
    }
};

const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await prisma.comment.findUnique({
            where: { id }
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Only author or admin can delete
        if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }

        await prisma.comment.delete({
            where: { id }
        });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
};

module.exports = {
    createComment,
    deleteComment
};
