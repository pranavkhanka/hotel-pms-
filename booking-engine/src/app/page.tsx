'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });

    // Mock API response
    const rooms = [
        { id: '1', name: 'Deluxe Room', price: 2500, capacity: 2, image: '/images/rooms/deluxe-room.jpg', badge: 'Popular' },
        { id: '2', name: 'Super Deluxe', price: 3500, capacity: 2, image: '/images/rooms/premium-suite.jpg', badge: 'View' },
        { id: '3', name: 'Family Suite', price: 5000, capacity: 4, image: '/images/rooms/family-room.jpg', badge: 'Family' },
    ];

    return (
        <main>
            {/* ... Header and Booking Section ... */}
            <header style={{
                position: 'relative',
                height: '70vh',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--color-white)',
                backgroundImage: 'url(/images/gallery/exterior-mountain-view.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(26,42,31,0.4), rgba(26,42,31,0.7))'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                    <p style={{
                        fontFamily: 'var(--font-accent)',
                        fontSize: '1.5rem',
                        fontStyle: 'italic',
                        color: 'var(--color-accent)',
                        marginBottom: '1rem'
                    }}>Perfectly Pleasant</p>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '1.5rem' }}>Hotel Nature Valley</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem' }}>
                        Experience luxury in the lap of nature. A tranquil retreat nestled in the Himalayas.
                    </p>
                    <button className="btn" style={{ padding: '16px 32px', fontSize: '1rem' }}
                        onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}>
                        Book Your Stay
                    </button>
                </div>
            </header>

            {/* Booking Section */}
            <div id="booking-section" className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
                <div className="card" style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Check In</label>
                        <input type="date" onChange={e => setDates({ ...dates, checkIn: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Check Out</label>
                        <input type="date" onChange={e => setDates({ ...dates, checkOut: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Guests</label>
                        <select>
                            <option>2 Adults</option>
                            <option>2 Adults, 1 Child</option>
                            <option>4 Adults</option>
                        </select>
                    </div>
                    <button className="btn" style={{ height: '46px', width: '100%' }}>Check Availability</button>
                </div>
            </div>

            {/* Rooms List */}
            <section className="container" style={{ padding: '80px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span style={{
                        color: 'var(--color-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}>Accommodations</span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Rooms & Suites</h2>
                    <p style={{ color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>
                        Every room is designed with your comfort in mind — spacious, well-appointed, and offering stunning views.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    {rooms.map(room => (
                        <div key={room.id} className="card">
                            <div style={{ position: 'relative', height: '250px', backgroundColor: '#e5e7eb' }}>
                                {/* Placeholder if image loads fail, usually handled by Next Image but using img for static export simplicity */}
                                <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    backgroundColor: 'var(--color-accent)',
                                    color: 'var(--color-text)',
                                    padding: '4px 12px',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    textTransform: 'uppercase'
                                }}>{room.badge}</span>
                            </div>
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: 0 }}>{room.name}</h3>
                                </div>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '20px' }}>
                                    ₹{room.price} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>/ night</span>
                                </p>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    <span>👥 {room.capacity} Guests</span>
                                    <span>☕ Breakfast Incl.</span>
                                </div>
                                <Link href={`/checkout?room=${room.id}&price=${room.price}`} className="btn-outline" style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.2s'
                                }}>
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
