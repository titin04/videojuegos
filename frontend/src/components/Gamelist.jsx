import { useState, useEffect } from "react";
import api from "../services/api";
import GameCard from "./GameCard";
import GameDetail from "./GameDetails";
import CategoryMenu from "./CategoryMenu";
import PlatformMenu from "./PlatformMenu";
import SearchBox from "./SearchBox";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Alert
} from "@mui/material";

const CATEGORIAS = [
  "Lucha", "Arcade", "Plataformas", "Shooter", "Estrategia",
  "Simulación", "Deporte", "Aventura", "Rol", "Educación", "Puzzle"
];

const PLATAFORMAS = [
  "PC", "PS5", "Xbox One", "Switch", "Android", "iOS", "Otras"
];

function GameList() {
  const [videojuegos, setVideojuegos] = useState([]);
  const [videojuegoSeleccionado, setVideojuegoSeleccionado] = useState(null);
  const [categoriasActivas, setCategoriasActivas] = useState([]);
  const [plataformasActivas, setPlataformasActivas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarVideojuegos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/videojuegos");
      setVideojuegos(response.data.videojuegos || []);
    } catch (error) {
      console.error("Error al cargar juegos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVideojuegos();
  }, []);

  const manejarEliminar = async (id) => {
    try {
      await api.delete(`/videojuegos/${id}`);
      setVideojuegos(prev => prev.filter(v => v.id !== id));
      setVideojuegoSeleccionado(null);
    } catch (error) {
      alert(error.response?.data?.error || "No pudiste eliminar este juego.");
    }
  };

  const videojuegosFiltrados = videojuegos.filter(v => {
    const coincideCategoria = categoriasActivas.length === 0 || v.categorias.some(cat =>
      categoriasActivas.includes(cat)
    );

    const coincidePlataforma = plataformasActivas.length === 0 || v.plataformas.some(plat =>
      plataformasActivas.includes(plat)
    );

    const texto = (v.nombre + " " + v.descripcion).toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());

    return coincideCategoria && coincidePlataforma && coincideBusqueda;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Cargando videojuegos...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <SearchBox busqueda={busqueda} setBusqueda={setBusqueda} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <CategoryMenu
                categorias={CATEGORIAS}
                categoriasActivas={categoriasActivas}
                setCategoriasActivas={setCategoriasActivas}
              />
              <PlatformMenu
                plataformas={PLATAFORMAS}
                plataformasActivas={plataformasActivas}
                setPlataformasActivas={setPlataformasActivas}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {videojuegosFiltrados.length === 0 ? (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
          No hay videojuegos que coincidan con los filtros.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {videojuegosFiltrados.map(v => (
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

export default GameList;
