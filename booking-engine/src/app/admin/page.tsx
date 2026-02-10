'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ revenue: 12500, occupancy: 4 });
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [ratePlans, setRatePlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [updateMsg, setUpdateMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesRes, plansRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/room-types'),
                    axios.get('http://localhost:3001/api/rate-plans')
                ]);
                setRoomTypes(typesRes.data);
                setRatePlans(plansRes.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    const handlePlanPriceChange = (id: string, newPrice: string) => {
        setRatePlans(ratePlans.map(p =>
            p.id === id ? { ...p, price: newPrice } : p
        ));
    };

    const updateRatePlan = async (id: string, price: number) => {
        setLoading(true);
        setUpdateMsg('');
        try {
            await axios.put(`http://localhost:3001/api/rate-plans/${id}`, { price });
            setUpdateMsg('Plan updated!');
            setTimeout(() => setUpdateMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setUpdateMsg('Failed to update.');
        } finally {
            setLoading(false);
        }
    };

    // Group plans by room type for display
    const getPlansForRoom = (roomId: string) => {
        return ratePlans.filter(p => p.room_type_id === roomId);
    };

    return (
        <main className="container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="hero" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '30px' }}>Owner Dashboard</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                <div className="card" style={{ borderLeft: '5px solid #10b981', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', background: 'white' }}>
                    <h3 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Today's Revenue</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{stats.revenue.toLocaleString()}</div>
                    <div style={{ color: '#10b981', marginTop: '5px' }}>+12% vs yesterday</div>
                </div>
                <div className="card" style={{ borderLeft: '5px solid #3b82f6', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', background: 'white' }}>
                    <h3 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Current Occupancy</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.occupancy} Rooms</div>
                    <div style={{ color: '#3b82f6', marginTop: '5px' }}>40% Full</div>
                </div>
            </div>

            {/* Tariff Manager */}
            <div className="card" style={{ padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', background: 'white', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Tariff & Rate Plans</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>Manage all pricing plans (Room Only, Breakfast, Luxury) for each room type.</p>

                {updateMsg && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '15px' }}>{updateMsg}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {roomTypes.map(room => (
                        <div key={room.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ background: '#f8fafc', padding: '15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {room.name} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal' }}>({room.id})</span>
                            </div>

                            <div style={{ padding: '10px' }}>
                                {getPlansForRoom(room.id).length === 0 ? (
                                    <div style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>No plans configured.</div>
                                ) : (
                                    getPlansForRoom(room.id).map(plan => (
                                        <div key={plan.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px dashed #eee' }}>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{plan.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{plan.description}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span style={{ color: '#64748b' }}>₹</span>
                                                <input
                                                    type="number"
                                                    value={plan.price}
                                                    onChange={(e) => handlePlanPriceChange(plan.id, e.target.value)}
                                                    style={{ padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', width: '90px' }}
                                                />
                                                <button
                                                    onClick={() => updateRatePlan(plan.id, Number(plan.price))}
                                                    disabled={loading}
                                                    style={{ padding: '6px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
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
                    {roomTypes.length === 0 && <p>Loading data...</p>}
                </div>
            </div>
        </main>
    );
}
