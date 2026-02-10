import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, Coffee, Receipt, Shield, Utensils } from 'lucide-react';
import api from './api';
import './index.css';

import Admin from './Admin';
import CheckIn from './CheckIn';
import Reservation from './Reservation';
import Order from './Order';
import { useNavigate } from 'react-router-dom';

import Dashboard from './Dashboard';

// --- Navigation ---
const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="sidebar">
            <div className="logo"><Coffee /> Hotel PMS</div>
            <Link to="/" className={`nav-item ${isActive('/')}`}><LayoutDashboard size={20} /> Dashboard</Link>
            <Link to="/bookings" className={`nav-item ${isActive('/bookings')}`}><Calendar size={20} /> Bookings</Link>
            <div style={{ paddingLeft: '2rem', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Link to="/reservation" className={`nav-item ${isActive('/reservation')}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>+ New Reservation</Link>
                <Link to="/check-in" className={`nav-item ${isActive('/check-in')}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>+ New Check-In</Link>
            </div>
            <Link to="/order" className={`nav-item ${isActive('/order')}`}><Utensils size={20} /> Order (Menu)</Link>
            <Link to="/admin" className={`nav-item ${isActive('/admin')}`}><Shield size={20} /> Admin</Link>
            <Link to="/guests" className={`nav-item ${isActive('/guests')}`}><Users size={20} /> Guests</Link>
            <Link to="/billing" className={`nav-item ${isActive('/billing')}`}><Receipt size={20} /> Billing</Link>
            <div style={{ marginTop: 'auto' }}>
                <Link to="/settings" className={`nav-item ${isActive('/settings')}`}><Settings size={20} /> Settings</Link>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <div className="layout">
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/bookings" element={<div>Bookings List (TODO)</div>} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/order" element={<Order />} />
                        <Route path="/check-in" element={<CheckIn />} />
                        <Route path="/reservation" element={<Reservation />} />
                        <Route path="/guests" element={<div>Guest Directory (TODO)</div>} />
                        <Route path="/billing" element={<div>Invoices & POS (TODO)</div>} />
                        <Route path="/settings" element={<div>Sync Status & Config (TODO)</div>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
