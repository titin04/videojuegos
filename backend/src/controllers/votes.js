const prisma = require('../lib/prisma');

const voteVideojuego = async (req, res) => {
    const { id } = req.params; // Videojuego ID
    const { type } = req.body; // 'LIKE' or 'DISLIKE'

    if (!['LIKE', 'DISLIKE'].includes(type)) {
        return res.status(400).json({ error: 'Invalid vote type' });
    }

    try {
        // Check if game exists
        const videojuego = await prisma.videojuego.findUnique({
            where: { id }
        });

        if (!videojuego) {
            return res.status(404).json({ error: 'Game not found' });
        }

        // Upsert vote: update if exists (change vote), create if not
        const vote = await prisma.vote.upsert({
            where: {
                userId_videojuegoId: {
                    userId: req.user.id,
                    videojuegoId: id
                }
            },
            update: { type },
            create: {
                type,
                userId: req.user.id,
                videojuegoId: id
            }
        });

        res.json(vote);
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Error processing your vote' });
    }
};

const getMyVote = async (req, res) => {
    const { id } = req.params;

    try {
        const vote = await prisma.vote.findUnique({
            where: {
                userId_videojuegoId: {
                    userId: req.user.id,
                    videojuegoId: id
                }
            }
        });
        res.json(vote || { type: null });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching your vote' });
    }
};

module.exports = {
    voteVideojuego,
    getMyVote
};
