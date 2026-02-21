import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIAS = [
    "Lucha", "Arcade", "Plataformas", "Shooter", "Estrategia",
    "Simulación", "Deporte", "Aventura", "Rol", "Educación", "Puzzle"
];

const PLATAFORMAS = [
    "PC", "PS5", "Xbox One", "Switch", "Android", "iOS", "Otras"
];

function AddGame() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        fechaLanzamiento: '',
        compania: '',
        plataformas: [],
        categorias: [],
        imagenUrl: '',
        videoUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (listName, item) => {
        setFormData(prev => {
            const list = prev[listName];
            const newList = list.includes(item)
                ? list.filter(i => i !== item)
                : [...list, item];
            return { ...prev, [listName]: newList };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/videojuegos', formData);
            navigate('/');
        } catch (error) {
            alert('Error al crear el videojuego');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-game-page">
            <div className="form-card glass">
                <h2>Añadir Nuevo Videojuego</h2>
                <form onSubmit={handleSubmit} className="game-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Título</label>
                            <input name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Compañía</label>
                            <input name="compania" value={formData.compania} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Precio (€)</label>
                            <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Fecha Lanzamiento</label>
                            <input name="fechaLanzamiento" type="date" value={formData.fechaLanzamiento} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required rows="4" />
                    </div>

                    <div className="form-group">
                        <label>Categorías</label>
                        <div className="chips-grid">
                            {CATEGORIAS.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`chip ${formData.categorias.includes(cat) ? 'active' : ''}`}
                                    onClick={() => handleToggle('categorias', cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Plataformas</label>
                        <div className="chips-grid">
                            {PLATAFORMAS.map(plat => (
                                <button
                                    key={plat}
                                    type="button"
                                    className={`chip ${formData.plataformas.includes(plat) ? 'active' : ''}`}
                                    onClick={() => handleToggle('plataformas', plat)}
                                >
                                    {plat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>URL Imagen (Carátula)</label>
                        <input name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>URL Tráiler (YouTube/Vimeo)</label>
                        <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} required />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancelar</button>
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? 'Guardando...' : 'Crear Videojuego'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddGame;
