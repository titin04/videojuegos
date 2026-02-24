import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GameCard from '../components/GameCard';
import GameDetail from '../components/GameDetails';
import {
    Container,
    Typography,
    Box,
    Grid,
    CircularProgress,
    Stack,
    Alert
} from '@mui/material';

function MyGames() {
    const [videojuegos, setVideojuegos] = useState([]);
    const [videojuegoSeleccionado, setVideojuegoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarMisJuegos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/videojuegos/mine');
            setVideojuegos(response.data.videojuegos || []);
        } catch (error) {
            console.error('Error al cargar mis juegos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMisJuegos();
    }, []);

    const manejarEliminar = async (id) => {
        try {
            await api.delete(`/videojuegos/${id}`);
            setVideojuegos(prev => prev.filter(v => v.id !== id));
            setVideojuegoSeleccionado(null);
        } catch (error) {
            alert('Error al eliminar el juego');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">Cargando tus juegos...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 900 }}>
                    Mis Videojuegos
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Aquí puedes gestionar los títulos que has compartido con la comunidad.
                </Typography>
            </Box>

            {videojuegos.length === 0 ? (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                    Aún no has añadido ningún videojuego.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {videojuegos.map(v => (
                        <Grid item key={v.id} xs={12} sm={6} md={4}>
                            <GameCard
                                videojuego={v}
                                onSelect={setVideojuegoSeleccionado}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {videojuegoSeleccionado && (
                <GameDetail
                    videojuego={videojuegoSeleccionado}
                    onClose={() => setVideojuegoSeleccionado(null)}
                    onDelete={manejarEliminar}
                />
            )}
        </Container>
    );
}

export default MyGames;
