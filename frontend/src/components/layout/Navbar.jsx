import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Avatar,
    Tooltip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{
            background: 'rgba(26, 26, 46, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
                    <Box component={RouterLink} to="/" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}>
                        <SportsEsportsIcon sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
                        <Typography variant="h6" sx={{
                            fontWeight: 800,
                            letterSpacing: -0.5,
                            display: { xs: 'none', sm: 'block' }
                        }}>
                            Video<Box component="span" sx={{ color: 'primary.main' }}>juegos</Box>
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        <Button component={RouterLink} to="/" color="inherit">
                            Todos
                        </Button>
                        <Button component={RouterLink} to="/mine" color="inherit">
                            Mis Juegos
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/add"
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            Nuevo
                        </Button>
                        <IconButton
                            component={RouterLink}
                            to="/add"
                            color="primary"
                            sx={{ display: { xs: 'flex', sm: 'none' } }}
                        >
                            <AddIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1 }}>
                            <Tooltip title={user.name}>
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                            <IconButton onClick={handleLogout} color="inherit" size="small">
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
