function CategoryMenu({ categorias, categoriasActivas, setCategoriasActivas }) {
  const handleChange = (categoria) => {
    if (categoriasActivas.includes(categoria)) {
      setCategoriasActivas(categoriasActivas.filter(c => c !== categoria));
    } else {
      setCategoriasActivas([...categoriasActivas, categoria]);
    }
  };

  return (
    <div className="filter-section">
      <h2 className="section-title">Categorías</h2>
      <div className="chip-group">
        {categorias.map(cat => {
          const isActive = categoriasActivas.includes(cat);
          return (
            <button
              key={cat}
              className={`chip ${isActive ? 'active' : ''}`}
              onClick={() => handleChange(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryMenu;
