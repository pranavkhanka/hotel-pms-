import { useState, useEffect } from 'react';
import api from './api';

const Admin = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Dashboard State
    const [stats, setStats] = useState({ revenue: 12500, occupancy: '0 / 0', occupancyPercent: 0 });
    const [roomTypes, setRoomTypes] = useState([]);
    const [ratePlans, setRatePlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateMsg, setUpdateMsg] = useState('');

    useEffect(() => {
        let intervalId;
        if (isAuthenticated) {
            fetchData(); // Initial fetch
            intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            const [typesRes, plansRes, roomsRes] = await Promise.all([
                api.get('/room-types'),
                api.get('/rate-plans'),
                api.get('/rooms')
            ]);
            setRoomTypes(typesRes.data);
            setRatePlans(plansRes.data);

            // Calculate Occupancy
            const rooms = roomsRes.data;
            const total = rooms.length;
            const occupied = rooms.filter(r => r.status === 'occupied').length;
            const percentage = total > 0 ? Math.round((occupied / total) * 100) : 0;

            setStats(prev => ({
                ...prev,
                occupancy: `${occupied} / ${total}`,
                occupancyPercent: percentage
            }));

        } catch (e) {
            console.error(e);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    const handlePlanPriceChange = (id, newPrice) => {
        setRatePlans(ratePlans.map(p =>
            p.id === id ? { ...p, price: newPrice } : p
        ));
    };

    const updateRatePlan = async (id, price) => {
        setLoading(true);
        setUpdateMsg('');
        try {
            await api.put(`/rate-plans/${id}`, { price });
            setUpdateMsg('Plan updated!');
            setTimeout(() => setUpdateMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setUpdateMsg('Failed to update.');
        } finally {
            setLoading(false);
        }
    };

    const getPlansForRoom = (roomId) => {
        return ratePlans.filter(p => p.room_type_id === roomId);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container" style={{
                maxWidth: '400px',
                margin: '100px auto',
                padding: '2rem',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a', textAlign: 'center' }}>PMS Admin Access</h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder="Enter admin password"
                        />
                    </div>
                    {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                    <button type="submit" style={{
                        width: '100%',
                        background: '#2563eb',
                        color: 'white',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: 0 }}>Owner Dashboard</h1>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                <div style={{ borderLeft: '5px solid #10b981', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: 'white' }}>
                    <h3 style={{ color: '#64748b', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Today's Revenue</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>₹{stats.revenue.toLocaleString()}</div>
                    <div style={{ color: '#10b981', marginTop: '5px', fontWeight: '500' }}>+12% vs yesterday</div>
                </div>
                <div style={{ borderLeft: '5px solid #3b82f6', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: 'white' }}>
                    <h3 style={{ color: '#64748b', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Current Occupancy</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.occupancyPercent || 0}%</div>
                    <div style={{ color: '#3b82f6', marginTop: '5px', fontWeight: '500' }}>{stats.occupancy} Rooms Occupied</div>
                </div>
            </div>

            {/* Tariff Manager */}
            <div style={{ padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', background: 'white', marginBottom: '40px' }}>
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: '#1e293b' }}>Tariff & Rate Plans</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Manage all pricing plans (Room Only, Breakfast, Luxury) for each room type.</p>
                </div>

                {updateMsg && (
                    <div style={{
                        padding: '12px',
                        background: updateMsg.includes('Failed') ? '#fef2f2' : '#f0fdf4',
                        color: updateMsg.includes('Failed') ? '#b91c1c' : '#15803d',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        fontWeight: '500'
                    }}>
                        {updateMsg}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {roomTypes.map(room => (
                        <div key={room.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ background: '#f8fafc', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '1.1rem', color: '#334155' }}>
                                {room.name} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal' }}>({room.id})</span>
                            </div>

                            <div style={{ padding: '10px 20px' }}>
                                {getPlansForRoom(room.id).length === 0 ? (
                                    <div style={{ padding: '10px', color: '#64748b', fontStyle: 'italic' }}>No plans configured.</div>
                                ) : (
                                    getPlansForRoom(room.id).map(plan => (
                                        <div key={plan.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px dashed #e2e8f0' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#334155' }}>{plan.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{plan.description}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span style={{ color: '#64748b', fontWeight: '500' }}>₹</span>
                                                <input
                                                    type="number"
                                                    value={plan.price}
                                                    onChange={(e) => handlePlanPriceChange(plan.id, e.target.value)}
                                                    style={{
                                                        padding: '8px',
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: '6px',
                                                        width: '100px',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => updateRatePlan(plan.id, Number(plan.price))}
                                                    disabled={loading}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: '#2563eb',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '500',
                                                        transition: 'background 0.2s'
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                    {roomTypes.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>Loading room data...</p>}
                </div>
            </div>
        </div>
    );
};

export default Admin;
