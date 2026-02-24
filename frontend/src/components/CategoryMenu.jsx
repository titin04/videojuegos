import { Box, Chip, Typography, Stack } from "@mui/material";

function CategoryMenu({ categorias, categoriasActivas, setCategoriasActivas }) {
  const toggleCategoria = (cat) => {
    setCategoriasActivas(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, px: 0.5 }}>Categorías</Typography>
      <Stack direction="row" spacing={0.5} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {categorias.map(cat => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => toggleCategoria(cat)}
            color={categoriasActivas.includes(cat) ? "primary" : "default"}
            variant={categoriasActivas.includes(cat) ? "filled" : "outlined"}
            size="small"
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default CategoryMenu;
