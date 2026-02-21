import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GameCard from '../components/GameCard';
import GameDetail from '../components/GameDetails';

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

    if (loading) return <div className="loading-screen">Cargando mis juegos...</div>;

    return (
        <div className="my-games-page">
            <header className="page-header">
                <h1>Mis Videojuegos</h1>
                <p>Aquí puedes gestionar los títulos que has compartido con la comunidad.</p>
            </header>

            <div className="games-grid">
                {videojuegos.length === 0 ? (
                    <p className="no-results">Aún no has añadido ningún videojuego.</p>
                ) : (
                    videojuegos.map(v => (
                        <GameCard
                            key={v.id}
                            videojuego={v}
                            onSelect={setVideojuegoSeleccionado}
                        />
                    ))
                )}
            </div>

            {videojuegoSeleccionado && (
                <GameDetail
                    videojuego={videojuegoSeleccionado}
                    onClose={() => setVideojuegoSeleccionado(null)}
                    onDelete={manejarEliminar}
                />
            )}
        </div>
    );
}

export default MyGames;
