'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });

    // Mock API response since Cloud API might be empty initially
    const rooms = [
        { id: '1', name: 'Deluxe Room', price: 2500, capacity: 2, image: '🏡' },
        { id: '2', name: 'Super Deluxe', price: 3500, capacity: 2, image: '🏰' },
        { id: '3', name: 'Family Suite', price: 5000, capacity: 4, image: '👨‍👩‍👧‍👦' },
    ];

    return (
        <main className="container">
            <header className="hero">
                <h1>Nature Valley Resort</h1>
                <p>Experience luxury in the lap of nature</p>
            </header>

            <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'end' }}>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Check In</label>
                    <input type="date" onChange={e => setDates({ ...dates, checkIn: e.target.value })} />
                </div>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Check Out</label>
                    <input type="date" onChange={e => setDates({ ...dates, checkOut: e.target.value })} />
                </div>
                <button className="btn">Check Availability</button>
            </div>

            <div className="room-list">
                {rooms.map(room => (
                    <div key={room.id} className="room-item">
                        <div className="room-image" style={{ fontSize: '4rem' }}>{room.image}</div>
                        <div className="room-content">
                            <h3>{room.name}</h3>
                            <p className="room-price">₹{room.price} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ night</span></p>
                            <p>Max Capacity: {room.capacity} Guests</p>
                            <Link href={`/checkout?room=${room.id}&price=${room.price}`} className="btn" style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>
                                Book Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
