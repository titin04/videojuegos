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
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'popularity'

  const cargarVideojuegos = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: busqueda,
        categorias: categoriasActivas.join(','),
        plataformas: plataformasActivas.join(','),
        sortBy
      };

      const response = await api.get("/videojuegos", { params });
      setVideojuegos(response.data.videojuegos || []);
      setTotalPages(response.data.pagination.pages || 1);
      setTotalItems(response.data.pagination.total || 0);
    } catch (error) {
      console.error("Error al cargar juegos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVideojuegos();
  }, [page, limit, categoriasActivas, plataformasActivas, busqueda, sortBy]);

  const manejarEliminar = async (id) => {
    try {
      await api.delete(`/videojuegos/${id}`);
      // Refresh current page
      cargarVideojuegos();
      setVideojuegoSeleccionado(null);
    } catch (error) {
      alert(error.response?.data?.error || "No pudiste eliminar este juego.");
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    setPage(1); // Reset to first page
  };

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <SearchBox busqueda={busqueda} setBusqueda={(val) => { setBusqueda(val); setPage(1); }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <CategoryMenu
                categorias={CATEGORIAS}
                categoriasActivas={categoriasActivas}
                setCategoriasActivas={(val) => { setCategoriasActivas(val); setPage(1); }}
              />
              <PlatformMenu
                plataformas={PLATAFORMAS}
                plataformasActivas={plataformasActivas}
                setPlataformasActivas={(val) => { setPlataformasActivas(val); setPage(1); }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="sort-select-label">Ordenar por</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            onChange={handleChangeSort}
            label="Ordenar por"
          >
            <MenuItem value="newest">Más recientes</MenuItem>
            <MenuItem value="popularity">Más populares</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 2 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">Actualizando lista...</Typography>
        </Box>
      ) : (
        <>
          {videojuegos.length === 0 ? (
            <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
              No hay videojuegos que coincidan con los filtros.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Mostrando {videojuegos.length} de {totalItems} videojuegos
              </Typography>
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

              <Box sx={{ mt: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />

                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="limit-select-label">Por página</InputLabel>
                  <Select
                    labelId="limit-select-label"
                    value={limit}
                    onChange={handleChangeLimit}
                    label="Por página"
                  >
                    <MenuItem value={3}>3 juegos</MenuItem>
                    <MenuItem value={6}>6 juegos</MenuItem>
                    <MenuItem value={12}>12 juegos</MenuItem>
                    <MenuItem value={24}>24 juegos</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </>
          )}
        </>
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
