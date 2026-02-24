import { Box, Chip, Typography, Stack } from "@mui/material";

function PlatformMenu({ plataformas, plataformasActivas, setPlataformasActivas }) {
  const togglePlataforma = (plat) => {
    setPlataformasActivas(prev =>
      prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
    );
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, px: 0.5 }}>Plataformas</Typography>
      <Stack direction="row" spacing={0.5} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {plataformas.map(plat => (
          <Chip
            key={plat}
            label={plat}
            onClick={() => togglePlataforma(plat)}
            color={plataformasActivas.includes(plat) ? "primary" : "default"}
            variant={plataformasActivas.includes(plat) ? "filled" : "outlined"}
            size="small"
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default PlatformMenu;
