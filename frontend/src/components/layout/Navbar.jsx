import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass">
            <div className="navbar-content">
                <Link to="/" className="nav-logo">
                    Video<span>juegos</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Todos</Link>
                    <Link to="/mine" className="nav-link">Mis Juegos</Link>
                    <Link to="/add" className="nav-link btn-add">Nuevo Juego +</Link>
                    <div className="user-profile">
                        <span className="user-name">{user.name}</span>
                        <button onClick={handleLogout} className="logout-btn">Salir</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
