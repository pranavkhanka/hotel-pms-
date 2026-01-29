'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function Checkout() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get('room');
    const price = searchParams.get('price');

    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        // 1. In real app, create order on server first
        // 2. Open Razorpay Modal
        // 3. On success, call create booking

        // Simulating "Razorpay Success"
        setTimeout(async () => {
            try {
                const CLOUD_API = 'http://localhost:4000/api';
                // Note: In local dev, localhost:4000 is Cloud API. In prod, this would be the deployed URL.

                await axios.post(`${CLOUD_API}/bookings`, {
                    guest_name: formData.name,
                    guest_phone: formData.phone,
                    guest_email: formData.email,
                    rooms: [{ room_type_id: roomId }], // Simplified
                    check_in: new Date(), // Mock dates
                    check_out: new Date(Date.now() + 86400000),
                    total_amount: price,
                    payment_id: 'pay_mock_' + Date.now()
                });

                alert('Booking Confirmed! You will receive an email shortly.');
                router.push('/');
            } catch (err) {
                console.error(err);
                alert('Booking failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <main className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1>Secure Checkout</h1>
                <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <strong>Booking Summary</strong><br />
                    Room ID: {roomId}<br />
                    Total to Pay: ₹{price}
                </div>

                <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91 98765 43210" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <button className="btn" style={{ width: '100%' }} onClick={handlePayment} disabled={loading}>
                    {loading ? 'Processing...' : `Pay ₹${price} & Book`}
                </button>

                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
                    Secured by Razorpay
                </p>
            </div>
        </main>
    );
}
