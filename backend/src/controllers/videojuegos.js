const prisma = require('../lib/prisma');

const getAllVideojuegos = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        categorias = '',
        plataformas = '',
        sortBy = 'newest'
    } = req.query;

    const skipValue = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    console.log('Search Debug - Query Params:', { search, categorias, plataformas, sortBy });

    // Build filter object
    const where = {};
    if (search) {
        where.OR = [
            { nombre: { contains: search, mode: 'insensitive' } },
            { descripcion: { contains: search, mode: 'insensitive' } }
        ];
    }
    if (categorias) {
        where.categorias = { hasSome: categorias.split(',') };
    }
    if (plataformas) {
        where.plataformas = { hasSome: plataformas.split(',') };
    }

    try {
        // If sorting by popularity, we need to calculate it for all matching games
        if (sortBy === 'popularity') {
            const allMatchingVideojuegos = await prisma.videojuego.findMany({
                where,
                include: {
                    user: { select: { name: true } },
                    votes: true
                }
            });

            // Process and calculate popularity
            let processed = allMatchingVideojuegos.map(v => {
                const likes = v.votes.filter(vote => vote.type === 'LIKE').length;
                const dislikes = v.votes.filter(vote => vote.type === 'DISLIKE').length;
                const popularity = likes - dislikes;

                const { votes, ...gameData } = v;
                return {
                    ...gameData,
                    likes,
                    dislikes,
                    popularity
                };
            });

            // Sort by popularity (descending)
            processed.sort((a, b) => b.popularity - a.popularity);

            const total = processed.length;
            const pagedVideojuegos = processed.slice(skipValue, skipValue + limitValue);

            return res.json({
                videojuegos: pagedVideojuegos,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: limitValue,
                    pages: Math.ceil(total / limitValue)
                }
            });
        }

        // Default: Sort by newest using Prisma pagination
        const [videojuegos, total] = await Promise.all([
            prisma.videojuego.findMany({
                where,
                skip: isNaN(skipValue) ? 0 : skipValue,
                take: limitValue,
                include: {
                    user: { select: { name: true } },
                    votes: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.videojuego.count({ where })
        ]);

        // Process games to calculate counts
        const processedVideojuegos = videojuegos.map(v => {
            const likes = v.votes.filter(vote => vote.type === 'LIKE').length;
            const dislikes = v.votes.filter(vote => vote.type === 'DISLIKE').length;
            const popularity = likes - dislikes;

            const { votes, ...gameData } = v;
            return {
                ...gameData,
                likes,
                dislikes,
                popularity
            };
        });

        res.json({
            videojuegos: processedVideojuegos,
            pagination: {
                total,
                page: parseInt(page),
                limit: limitValue,
                pages: Math.ceil(total / limitValue)
            }
        });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Error fetching games' });
    }
};

const getMyVideojuegos = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const [videojuegos, total] = await Promise.all([
            prisma.videojuego.findMany({
                where: { userId: req.user.id },
                skip: parseInt(skip),
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.videojuego.count({ where: { userId: req.user.id } })
        ]);

        res.json({
            videojuegos,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching your games' });
    }
};

const getVideojuegoById = async (req, res) => {
    const { id } = req.params;

    try {
        const videojuego = await prisma.videojuego.findUnique({
            where: { id },
            include: {
                user: { select: { name: true } },
                votes: true
            }
        });

        if (!videojuego) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const likes = videojuego.votes.filter(vote => vote.type === 'LIKE').length;
        const dislikes = videojuego.votes.filter(vote => vote.type === 'DISLIKE').length;

        const { votes, ...gameData } = videojuego;

        res.json({
            ...gameData,
            likes,
            dislikes
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching game' });
    }
};

const createVideojuego = async (req, res) => {
    const {
        nombre, descripcion, precio, fechaLanzamiento,
        compania, plataformas, categorias, imagenUrl, videoUrl
    } = req.body;

    try {
        const videojuego = await prisma.videojuego.create({
            data: {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                fechaLanzamiento,
                compania,
                plataformas,
                categorias,
                imagenUrl,
                videoUrl,
                userId: req.user.id
            }
        });

        res.status(201).json(videojuego);
    } catch (error) {
        res.status(500).json({ error: 'Error creating game' });
    }
};

const deleteVideojuego = async (req, res) => {
    const { id } = req.params;

    try {
        const videojuego = await prisma.videojuego.findUnique({
            where: { id }
        });

        if (!videojuego) {
            return res.status(404).json({ error: 'Game not found' });
        }

        // Only owner or admin can delete
        if (videojuego.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to delete this game' });
        }

        await prisma.videojuego.delete({ where: { id } });

        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting game' });
    }
};

module.exports = {
    getAllVideojuegos,
    getMyVideojuegos,
    getVideojuegoById,
    createVideojuego,
    deleteVideojuego
};
