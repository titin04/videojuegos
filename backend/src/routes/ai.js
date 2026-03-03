const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const prisma = require('../lib/prisma');

const router = express.Router();

// All AI routes require authentication
router.use(authMiddleware);

/**
 * POST /api/ai/chat
 * Body: { message: string, history: Array<{role, content}> }
 * Sends the user message to Ollama with the game catalog as context.
 */
router.post('/chat', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Fetch all games from the database to build context
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

        // Build the messages array for Ollama
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: message }
        ];

        const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

        const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:1b',
                messages,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 512
                }
            })
        });

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            console.error('Ollama error:', errorText);
            return res.status(502).json({ error: 'El asistente de IA no está disponible en este momento.' });
        }

        const ollamaData = await ollamaResponse.json();
        const reply = ollamaData.message?.content || 'Lo siento, no pude generar una respuesta.';

        res.json({ reply });

    } catch (error) {
        console.error('Error in AI route:', error);
        res.status(500).json({ error: 'Error al comunicarse con el asistente de IA.' });
    }
});

module.exports = router;
