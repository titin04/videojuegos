function GameCard({ videojuego, onSelect }) {
  const { nombre, imagenUrl, plataformas, precio, descripcion } = videojuego;

  const descripcionCorta =
    descripcion.length > 100
      ? descripcion.slice(0, 100) + "..."
      : descripcion;

  return (
    <div className="game-card glass" onClick={() => onSelect(videojuego)}>
      <div className="card-image-wrapper">
        <img src={imagenUrl} alt={nombre} className="card-image" />
        <span className="explore-btn">Explorar</span>
      </div>
      <div className="card-content">
        <h3>{nombre}</h3>
        <p className="card-platforms">{plataformas.join(" • ")}</p>
        <p className="card-description">{descripcionCorta}</p>
        <div className="card-footer">
          <span className="price-tag">{precio} €</span>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
