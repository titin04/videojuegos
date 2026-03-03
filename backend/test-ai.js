const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    console.log('Fetching games...');
    const games = await prisma.videojuego.findMany({
        select: {
            nombre: true,
            descripcion: true,
            categorias: true,
            plataformas: true,
            compania: true,
            precio: true,
            fechaLanzamiento: true
        }
    });
    console.log(`Found ${games.length} games.`);

    const gamesJson = JSON.stringify(games, null, 2);
    const systemPrompt = `Eres un asistente de videojuegos especializado en la tienda GameVault. 
Tu única función es ayudar a los usuarios a buscar, descubrir y recomendar videojuegos de la base de datos de la tienda.

REGLAS IMPORTANTES:
1. Solo puedes hablar sobre los videojuegos que se encuentran en la base de datos a continuación.
2. Si el usuario pregunta sobre temas que no están relacionados con videojuegos o los juegos disponibles, responde amablemente indicando que solo puedes ayudar con videojuegos del catálogo.
3. Sé amable, entusiasta y útil. Usa emojis ocasionalmente para hacer la conversación más dinámica.
4. Cuando recomienden un juego, menciona sus características más relevantes (categorías, plataformas, precio, compañía).
5. Si el usuario pregunta por un juego que no está en el catálogo, indícaselo claramente y sugiere alternativas del catálogo que podrían gustarle.
6. Responde siempre en español a menos que el usuario escriba en otro idioma.

BASE DE DATOS DE VIDEOJUEGOS DISPONIBLES:
${gamesJson}

Recuerda: SOLO puedes recomendar y hablar sobre los juegos de esa lista.`;

    const message = "remiendame un juego de accion";
    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
    ];

    const ollamaUrl = 'http://ollama:11434';
    console.log('Sending request to Ollama...');
    const start = Date.now();
    try {
        const res = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:1b',
                messages,
                stream: false
            })
        });
        const duration = (Date.now() - start) / 1000;
        console.log(`Ollama responded in ${duration}s with status ${res.status}`);
        const data = await res.json();
        console.log('Reply:', data.message?.content);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
