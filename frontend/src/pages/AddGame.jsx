import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Stack,
    Chip,
    Divider,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => navigate(-1)} color="inherit" size="small">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Volver</Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, mb: 4 }}>
                    Añadir Nuevo Videojuego
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Título del videojuego"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Compañía / Desarrolladora"
                                name="compania"
                                value={formData.compania}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Precio (€)"
                                name="precio"
                                type="number"
                                inputProps={{ step: 0.01 }}
                                value={formData.precio}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Lanzamiento"
                                name="fechaLanzamiento"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.fechaLanzamiento}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Descripción detallada"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>Categorías</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {CATEGORIAS.map(cat => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        onClick={() => handleToggle('categorias', cat)}
                                        color={formData.categorias.includes(cat) ? "primary" : "default"}
                                        variant={formData.categorias.includes(cat) ? "filled" : "outlined"}
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>Plataformas</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {PLATAFORMAS.map(plat => (
                                    <Chip
                                        key={plat}
                                        label={plat}
                                        onClick={() => handleToggle('plataformas', plat)}
                                        color={formData.plataformas.includes(plat) ? "primary" : "default"}
                                        variant={formData.plataformas.includes(plat) ? "filled" : "outlined"}
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="URL de la Imagen (Carátula)"
                                name="imagenUrl"
                                value={formData.imagenUrl}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="URL del Tráiler (YouTube)"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button onClick={() => navigate(-1)} color="inherit">
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Crear Videojuego'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default AddGame;
