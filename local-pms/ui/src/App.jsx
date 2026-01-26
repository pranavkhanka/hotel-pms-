import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, Coffee, Receipt } from 'lucide-react';
import api from './api';
import './index.css';

// --- Dashboard / Room Grid ---
const Dashboard = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Fetch rooms from our local API
        api.get('/rooms').then(res => setRooms(res.data)).catch(err => {
            console.error("Failed to fetch rooms", err);
            // Fallback demo data
            setRooms([
                { id: '1', room_number: '101', type_name: 'Deluxe', status: 'vacant' },
                { id: '2', room_number: '102', type_name: 'Standard', status: 'occupied' },
                { id: '3', room_number: '103', type_name: 'Suite', status: 'dirty' },
                { id: '4', room_number: '104', type_name: 'Deluxe', status: 'vacant' },
            ]);
        });
    }, []);

    return (
        <div>
            <div className="header">
                <div className="title">Front Desk</div>
                <button className="btn btn-primary">+ New Booking</button>
            </div>

            <div className="room-grid">
                {rooms.map(room => (
                    <div key={room.id} className={`room-card`}>
                        <div className="room-number">{room.room_number}</div>
                        <div className="room-type">{room.type_name}</div>
                        <div className={`status-badge status-${room.status}`}>{room.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Navigation ---
const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="sidebar">
            <div className="logo"><Coffee /> Hotel PMS</div>
            <Link to="/" className={`nav-item ${isActive('/')}`}><LayoutDashboard size={20} /> Dashboard</Link>
            <Link to="/bookings" className={`nav-item ${isActive('/bookings')}`}><Calendar size={20} /> Bookings</Link>
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
