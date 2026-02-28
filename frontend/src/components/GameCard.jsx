import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import api from '../services/api';

function GameCard({ videojuego, onSelect }) {
  const { id, nombre, imagenUrl, plataformas, precio, descripcion, likes: initialLikes, dislikes: initialDislikes } = videojuego;
  const [userVote, setUserVote] = useState(null); // 'LIKE', 'DISLIKE' or null
  const [likes, setLikes] = useState(initialLikes || 0);
  const [dislikes, setDislikes] = useState(initialDislikes || 0);

  useEffect(() => {
    const fetchMyVote = async () => {
      try {
        const response = await api.get(`/votes/${id}`);
        setUserVote(response.data.type);
      } catch (error) {
        console.error("Error fetching vote", error);
      }
    };
    fetchMyVote();
  }, [id]);

  const handleVote = async (e, type) => {
    e.stopPropagation(); // Don't trigger CardActionArea click
    try {
      const response = await api.post(`/votes/${id}`, { type });

      // Update local state for immediate feedback
      if (userVote === type) return; // No change

      if (type === 'LIKE') {
        setLikes(prev => prev + 1);
        if (userVote === 'DISLIKE') setDislikes(prev => prev - 1);
      } else {
        setDislikes(prev => prev + 1);
        if (userVote === 'LIKE') setLikes(prev => prev - 1);
      }

      setUserVote(type);
    } catch (error) {
      console.error("Error voting", error);
    }
  };

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
      </CardActionArea>

      <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 900 }}>
          {precio} €
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" alignItems="center">
            <Tooltip title="Me gusta">
              <IconButton
                size="small"
                color={userVote === 'LIKE' ? 'primary' : 'default'}
                onClick={(e) => handleVote(e, 'LIKE')}
              >
                {userVote === 'LIKE' ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: '1rem' }}>{likes}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Tooltip title="No me gusta">
              <IconButton
                size="small"
                color={userVote === 'DISLIKE' ? 'error' : 'default'}
                onClick={(e) => handleVote(e, 'DISLIKE')}
              >
                {userVote === 'DISLIKE' ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: '1rem' }}>{dislikes}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

export default GameCard;
