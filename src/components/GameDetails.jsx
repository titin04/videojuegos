function GameDetail({ videojuego, onClose, onDelete }) {
  const {
    id,
    nombre,
    descripcion,
    fechaLanzamiento,
    compania,
    plataformas,
    categorias,
    precio,
    imagenUrl,
    videoUrl
  } = videojuego;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop fade-in" onClick={handleBackdropClick}>
      <div className="modal-content glass designer-modal">
        {}
        <div
          className="ambient-bg"
          style={{ backgroundImage: `url(${imagenUrl})` }}
        ></div>

        <button className="close-btn" onClick={onClose}>&times;</button>

        <div className="modal-body">
          <div className="modal-poster-section">
            <img src={imagenUrl} alt={nombre} className="modal-poster shadow-lg" />
          </div>

          <div className="modal-content-section">
            <div className="modal-header-hero">
              <span className="metadata-label">{categorias.join(" / ")}</span>
              <h2 className="display-title">{nombre}</h2>
              <div className="credits-line">
                <span>{compania}</span>
                <span className="separator"></span>
                <span>{fechaLanzamiento}</span>
              </div>
            </div>

            <div className="modal-actions-top">
              <a href={videoUrl} target="_blank" rel="noreferrer" className="btn-designer-primary">
                Ver Vídeo
              </a>
              <button className="btn-designer-ghost" onClick={() => onDelete(id)}>
                Eliminar Registro
              </button>
            </div>

            <div className="modal-synopsis">
              <p>{descripcion}</p>
            </div>

            <div className="modal-property-grid">
              <div className="property-item">
                <span className="metadata-label">Disponible en</span>
                <span className="property-value">{plataformas.join(", ")}</span>
              </div>
              <div className="property-item">
                <span className="metadata-label">Adquisición</span>
                <span className="property-value highlight">{precio} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
