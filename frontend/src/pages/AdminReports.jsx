import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Snackbar,
    Alert,
    Tooltip,
    Breadcrumbs,
    Link as MuiLink
} from '@mui/material';
import {
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Report as ReportIcon,
    Home as HomeIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    // Dialog for full deletion
    const [deleteDialog, setDeleteDialog] = useState({ open: false, gameId: null, gameName: '' });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchReports();
    }, [user, navigate]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await api.get('/videojuegos/reported');
            setReports(response.data);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al cargar los reportes',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = async (id) => {
        try {
            setActionLoading(id);
            await api.put(`/videojuegos/${id}/dismiss`);
            setReports(reports.filter(game => game.id !== id));
            setSnackbar({
                open: true,
                message: 'Reporte desestimado',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al desestimar el reporte',
                severity: 'error'
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async () => {
        const { gameId } = deleteDialog;
        try {
            setActionLoading(gameId);
            await api.delete(`/videojuegos/${gameId}`);
            setReports(reports.filter(game => game.id !== gameId));
            setDeleteDialog({ open: false, gameId: null, gameName: '' });
            setSnackbar({
                open: true,
                message: 'Videojuego eliminado definitivamente',
                severity: 'warning'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al eliminar el videojuego',
                severity: 'error'
            });
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <MuiLink component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', textDecoration: 'none' }}>
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Inicio
                    </MuiLink>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReportIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Moderación de Reportes
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(-1)} color="inherit">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        Juegos Reportados
                    </Typography>
                </Box>
            </Box>

            {reports.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        ¡Todo limpio!
                    </Typography>
                    <Typography color="text.secondary">
                        No hay contenido reportado pendiente de revisión en este momento.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Nombre del Juego</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Autor</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Fecha de creación</TableCell>
                                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.map((game) => (
                                <TableRow key={game.id} hover>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {game.nombre}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{game.user?.name || 'Desconocido'}</TableCell>
                                    <TableCell>{new Date(game.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Tooltip title="Desestimar reporte (mantener juego)">
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                    onClick={() => handleDismiss(game.id)}
                                                    disabled={!!actionLoading}
                                                >
                                                    Desestimar
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Eliminar juego definitivamente">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setDeleteDialog({ open: true, gameId: game.id, gameName: game.nombre })}
                                                    disabled={!!actionLoading}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Delete Confirmation */}
            <Dialog open={deleteDialog.open} onClose={() => !actionLoading && setDeleteDialog({ ...deleteDialog, open: false })}>
                <DialogTitle sx={{ fontWeight: 800 }}>¿Eliminar definitivamente?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Vas a eliminar <strong>{deleteDialog.gameName}</strong> del sistema. Esta acción es irreversible y borrará también todos sus votos y comentarios.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} color="inherit" disabled={!!actionLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={!!actionLoading}>
                        {actionLoading === deleteDialog.gameId ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Eliminación'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminReports;
