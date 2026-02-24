import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '20vh',
            gap: 2,
            p: 4
        }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">Cargando experiencia...</Typography>
        </Box>
    );
};

export default Loader;
