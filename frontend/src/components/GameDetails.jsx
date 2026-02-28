import React, { useState, useEffect } from 'react';
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
  useTheme,
  TextField,
  Avatar,
  Paper,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import api from '../services/api';

function GameDetail({ videojuego: initialGame, onClose, onDelete }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [videojuego, setVideojuego] = useState(initialGame);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Get current user from local storage
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const id = initialGame.id;

  // Fetch full details (including comments) when mounting
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/videojuegos/${id}`);
        setVideojuego(response.data);
        setComentarios(response.data.comments || []);
      } catch (error) {
        console.error("Error al cargar detalles del juego", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddComment = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      setEnviando(true);
      const response = await api.post(`/comments/${id}`, { content: nuevoComentario });
      setComentarios([response.data, ...comentarios]);
      setNuevoComentario("");
    } catch (error) {
      console.error("Error al añadir comentario", error);
    } finally {
      setEnviando(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComentarios(comentarios.filter(c => c.id !== commentId));
    } catch (error) {
      console.error("Error al borrar comentario", error);
    }
  };

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  const {
    id: gameId,
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
          position: 'relative',
          bgcolor: 'background.paper'
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
            maxHeight: { xs: 300, md: 'auto' },
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${imagenUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(15px) brightness(0.4)',
              transform: 'scale(1.2)',
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
          <Box sx={{ p: 4, width: { xs: '100%', md: '55%' }, maxHeight: '90vh', overflowY: 'auto' }}>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                  {categorias.map(cat => (
                    <Chip key={cat} label={cat} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                  ))}
                </Stack>

                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  {nombre}
                </Typography>

                <Stack direction="row" spacing={2} color="text.secondary" sx={{ mt: 1 }} divider={<Divider orientation="vertical" flexItem />}>
                  <Typography variant="body2">{compania}</Typography>
                  <Typography variant="body2">{fechaLanzamiento}</Typography>
                </Stack>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {descripcion}
              </Typography>

              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>Disponible en:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {plataformas.map(plat => (
                    <Chip key={plat} label={plat} size="small" variant="filled" sx={{ borderRadius: 1 }} />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 900 }}>
                  {precio} €
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<PlayCircleOutlineIcon />}
                    href={videoUrl}
                    target="_blank"
                    size="small"
                  >
                    Tráiler
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(gameId)}
                    size="small"
                  >
                    Borrar
                  </Button>
                </Stack>
              </Box>

              <Divider />

              {/* Comments Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Comentarios <Chip label={comentarios.length} size="small" color="primary" />
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, mt: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Escribe tu opinión..."
                      variant="outlined"
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleAddComment}
                        disabled={!nuevoComentario.trim() || enviando}
                        size="small"
                      >
                        Publicar
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Stack spacing={2}>
                  {comentarios.map((comment) => (
                    <Paper key={comment.id} variant="outlined" sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                          {comment.user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {comment.user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.primary' }}>
                            {comment.content}
                          </Typography>
                        </Box>
                        {(comment.userId === currentUser?.id || currentUser?.role === 'ADMIN') && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteComment(comment.id)}
                            sx={{ position: 'absolute', right: 8, top: 40 }}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        )}
                      </Box>
                    </Paper>
                  ))}
                  {comentarios.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}>
                      Aún no hay comentarios. ¡Sé el primero en opinar!
                    </Typography>
                  )}
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
