import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
  Stack
} from '@mui/material';

function GameCard({ videojuego, onSelect }) {
  const { nombre, imagenUrl, plataformas, precio, descripcion } = videojuego;

  const descripcionCorta =
    descripcion.length > 100
      ? descripcion.slice(0, 100) + "..."
      : descripcion;

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: (theme) => `0 12px 24px -10px ${theme.palette.primary.main}44`
      }
    }}>
      <CardActionArea onClick={() => onSelect(videojuego)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia
          component="img"
          height="200"
          image={imagenUrl}
          alt={nombre}
          sx={{ objectPosition: 'top' }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {nombre}
          </Typography>

          <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
            {plataformas.slice(0, 3).map(p => (
              <Chip key={p} label={p} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
            ))}
            {plataformas.length > 3 && (
              <Chip label={`+${plataformas.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
            )}
          </Stack>

          {videojuego.user && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Añadido por: <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{videojuego.user.name}</Box>
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {descripcionCorta}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2.5, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 900 }}>
            {precio} €
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default GameCard;
