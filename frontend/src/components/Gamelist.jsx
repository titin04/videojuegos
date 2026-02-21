import { useState, useEffect } from "react";
import api from "../services/api";
import GameCard from "./GameCard";
import GameDetail from "./GameDetails";
import CategoryMenu from "./CategoryMenu";
import PlatformMenu from "./PlatformMenu";
import SearchBox from "./SearchBox";

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
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando videojuegos...</p>
      </div>
    );
  }

  return (
    <div className="games-page">
      <div className="filters-container">
        <SearchBox
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />

        <div className="menus-wrapper">
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
        </div>
      </div>

      <div className="games-grid">
        {videojuegosFiltrados.length === 0 ? (
          <p className="no-results">No hay videojuegos que coincidan con los filtros.</p>
        ) : (
          videojuegosFiltrados.map(v => (
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

export default GameList;
