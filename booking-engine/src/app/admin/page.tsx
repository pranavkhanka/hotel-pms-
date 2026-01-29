'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ revenue: 0, occupancy: 0 });

    useEffect(() => {
        // In real app, protect this route with Auth
        const fetchStats = async () => {
            try {
                // Mocking response for now if API not running
                // const res = await axios.get('http://localhost:4000/api/dashboard');
                // setStats(res.data);

                // Mock data for demo
                setStats({ revenue: 12500, occupancy: 4 });
            } catch (e) {
                console.error(e);
            }
        };
        fetchStats();
    }, []);

    return (
        <main className="container">
            <h1 className="hero" style={{ textAlign: 'left', fontSize: '2rem' }}>Owner Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                <div className="card" style={{ borderLeft: '5px solid #10b981' }}>
                    <h3 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Today's Revenue</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{stats.revenue.toLocaleString()}</div>
                    <div style={{ color: '#10b981', marginTop: '5px' }}>+12% vs yesterday</div>
                </div>

                <div className="card" style={{ borderLeft: '5px solid #3b82f6' }}>
                    <h3 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Current Occupancy</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.occupancy} Rooms</div>
                    <div style={{ color: '#3b82f6', marginTop: '5px' }}>40% Full</div>
                </div>
            </div>

            <div className="card">
                <h3>Live Activity</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {[1, 2, 3].map(i => (
                        <li key={i} style={{ padding: '15px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>New Booking</strong> <span style={{ color: '#64748b' }}>via Web</span>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Guest: Amit Kumar (Deluxe Room)</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold' }}>₹3,500</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>2 mins ago</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
