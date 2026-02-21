const prisma = require('../lib/prisma');

const getAllVideojuegos = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const [videojuegos, total] = await Promise.all([
            prisma.videojuego.findMany({
                skip: parseInt(skip),
                take: parseInt(limit),
                include: {
                    user: {
                        select: { name: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.videojuego.count()
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
            include: { user: { select: { name: true } } }
        });

        if (!videojuego) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(videojuego);
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
