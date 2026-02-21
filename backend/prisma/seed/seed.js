const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting simplified seed...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    let admin = await prisma.user.findUnique({ where: { email: 'admin@videojuegos.com' } });
    if (!admin) {
        admin = await prisma.user.create({
            data: {
                email: 'admin@videojuegos.com',
                password: hashedPassword,
                name: 'Administrador',
                role: 'ADMIN',
            }
        });
        console.log('✅ Admin created.');
    }

    // Create User
    let user = await prisma.user.findUnique({ where: { email: 'antonio@videojuegos.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'antonio@videojuegos.com',
                password: hashedPassword,
                name: 'Antonio',
                role: 'USER',
            }
        });
        console.log('✅ Regular user created.');
    }

    // Migrate Games from db.json
    const dbJsonPath = path.join(__dirname, '../../../db.json');
    if (fs.existsSync(dbJsonPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
        const games = dbData.videojuegos || [];

        const existingCount = await prisma.videojuego.count();
        if (existingCount === 0) {
            console.log(`📦 Migrating ${games.length} games...`);
            for (const game of games) {
                await prisma.videojuego.create({
                    data: {
                        nombre: game.nombre,
                        descripcion: game.descripcion,
                        precio: parseFloat(game.precio),
                        fechaLanzamiento: game.fechaLanzamiento,
                        compania: game.compania,
                        plataformas: game.plataformas,
                        categorias: game.categorias,
                        imagenUrl: game.imagenUrl,
                        videoUrl: game.videoUrl,
                        userId: admin.id,
                    },
                });
            }
            console.log('✅ Migration complete.');
        } else {
            console.log('ℹ️ Games already exist in DB, skipping migration.');
        }
    }

    console.log('✨ Seed finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
