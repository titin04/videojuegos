import { useState, useEffect } from "react";
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

  const cargarVideojuegos = async () => {
    const respuesta = await fetch("http://localhost:3000/videojuegos");
    const datos = await respuesta.json();
    setVideojuegos(datos);
  };

  useEffect(() => {
    cargarVideojuegos();
  }, []);

  const manejarEliminar = async (id) => {
    await fetch(`http://localhost:3000/videojuegos/${id}`, {
      method: "DELETE"
    });
    setVideojuegos(prev => prev.filter(v => v.id !== id));
    setVideojuegoSeleccionado(null);
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

  if (videojuegos.length === 0) {
    return <p>Cargando videojuegos...</p>;
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
