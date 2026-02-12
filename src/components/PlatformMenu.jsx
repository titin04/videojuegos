function PlatformMenu({ plataformas, plataformasActivas, setPlataformasActivas }) {
  const handleChange = (plataforma) => {
    if (plataformasActivas.includes(plataforma)) {
      setPlataformasActivas(plataformasActivas.filter(p => p !== plataforma));
    } else {
      setPlataformasActivas([...plataformasActivas, plataforma]);
    }
  };

  return (
    <div className="filter-section">
      <h2 className="section-title">Plataformas</h2>
      <div className="chip-group">
        {plataformas.map(plat => {
          const isActive = plataformasActivas.includes(plat);
          return (
            <button
              key={plat}
              className={`chip ${isActive ? 'active' : ''}`}
              onClick={() => handleChange(plat)}
            >
              {plat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlatformMenu;
