import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function GameDetail({ videojuego, onClose, onDelete }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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

  return (
    <Dialog
      open={!!videojuego}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 4,
          overflow: 'hidden',
          position: 'relative'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          zIndex: 10,
          bgcolor: 'rgba(0,0,0,0.5)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
        }}
        color="inherit"
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Image Section */}
          <Box sx={{
            width: { xs: '100%', md: '45%' },
            height: { xs: 300, md: 'auto' },
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${imagenUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(10px) brightness(0.5)',
              transform: 'scale(1.1)',
              zIndex: 0
            }} />
            <Box
              component="img"
              src={imagenUrl}
              alt={nombre}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                p: 2
              }}
            />
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4, width: { xs: '100%', md: '55%' } }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {categorias.map(cat => (
                  <Chip key={cat} label={cat} size="small" color="primary" variant="outlined" />
                ))}
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {nombre}
              </Typography>

              <Stack direction="row" spacing={2} color="text.secondary" divider={<Divider orientation="vertical" flexItem />}>
                <Typography variant="body2">{compania}</Typography>
                <Typography variant="body2">{fechaLanzamiento}</Typography>
              </Stack>

              {videojuego.user && (
                <Typography variant="caption" sx={{ bgcolor: 'action.selected', p: 1, borderRadius: 1, display: 'inline-block', width: 'fit-content' }}>
                  Publicado por: <strong>{videojuego.user.name}</strong>
                </Typography>
              )}

              <Divider />

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {descripcion}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Disponible en:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {plataformas.map(plat => (
                    <Chip key={plat} label={plat} size="small" variant="filled" />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 900 }}>
                  {precio} €
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<PlayCircleOutlineIcon />}
                    href={videoUrl}
                    target="_blank"
                  >
                    Tráiler
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(id)}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default GameDetail;
