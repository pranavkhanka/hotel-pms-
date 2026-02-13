'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

// Interfaces
interface RoomType {
    id: string; // matches DB id
    name: string;
    image: string;
    description: string;
    maxOccupancy: number; // hardcoded for now or fetch if available
    basePrice: number; // Only used for fallback
}

interface RatePlan {
    id: string;
    room_type_id: string;
    name: string;
    price: number;
    description: string;
}

// Mock Room Metadata (Images/Desc) - mapped by DB ID
const ROOM_META: Record<string, Partial<RoomType>> = {
    'type_deluxe': {
        image: 'http://localhost:8081/images/rooms/deluxe-room.jpg',
        description: 'A perfect blend of comfort and style for relaxation.',
        maxOccupancy: 3
    },
    'type_standard': {
        image: 'http://localhost:8081/images/rooms/family-room.jpg', // Standard usually simpler, but mapping to existing images
        description: 'Cozy and comfortable standard rooms.',
        maxOccupancy: 2
    },
    'type_suite': {
        image: 'http://localhost:8081/images/rooms/premium-suite.jpg',
        description: 'Experience ultimate luxury with our finest suites.',
        maxOccupancy: 4
    }
};

interface RoomRequest {
    adults: number;
    children: number;
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [step, setStep] = useState(1);
    const [roomRequests, setRoomRequests] = useState<RoomRequest[]>([]);
    const [activeRoomIndex, setActiveRoomIndex] = useState(0);
    const [selectedRooms, setSelectedRooms] = useState<Record<number, { price: number; roomTypeId: string; planId: string; planName: string; roomTypeName: string; }>>({});

    // Data State
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [stayDates, setStayDates] = useState<{ checkIn: Date, checkOut: Date, nights: number } | null>(null);

    // Initialize Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesRes, plansRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/room-types'),
                    axios.get('http://localhost:3001/api/rate-plans')
                ]);

                // Merge DB data with Frontend Meta
                const mergedTypes = typesRes.data.map((rt: any) => ({
                    ...rt,
                    ...ROOM_META[rt.id], // Overlay images/desc
                    basePrice: rt.base_price
                }));

                setRoomTypes(mergedTypes);
                setRatePlans(plansRes.data);
            } catch (e) {
                console.error("Failed to fetch hotel data", e);
            }
        };
        fetchData();

        // Parse Params
        const roomDetailsParam = searchParams.get('roomDetails');
        if (roomDetailsParam) {
            try {
                setRoomRequests(JSON.parse(roomDetailsParam));
            } catch {
                setRoomRequests([{ adults: 2, children: 0 }]);
            }
        } else {
            setRoomRequests([{ adults: 2, children: 0 }]);
        }

        const checkInParam = searchParams.get('checkIn');
        const checkOutParam = searchParams.get('checkOut');
        const checkIn = checkInParam ? new Date(checkInParam) : new Date();
        const checkOut = checkOutParam ? new Date(checkOutParam) : new Date(Date.now() + 86400000);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        setStayDates({ checkIn, checkOut, nights: diffDays });

    }, [searchParams]);

    const handlePlanSelect = (room: RoomType, plan: RatePlan) => {
        setSelectedRooms(prev => ({
            ...prev,
            [activeRoomIndex]: {
                roomTypeId: room.id,
                roomTypeName: room.name,
                planId: plan.id,
                planName: plan.name,
                price: Number(plan.price)
            }
        }));

        if (activeRoomIndex < roomRequests.length - 1) {
            setActiveRoomIndex(prev => prev + 1);
        }
    };

    const isAllRoomsSelected = () => roomRequests.every((_, index) => selectedRooms[index]);

    const getTotalPrice = () => Object.values(selectedRooms).reduce((sum, item) => sum + (item?.price || 0), 0);

    const handlePayment = async () => {
        if (!formData.name || !formData.phone || !formData.email) {
            alert("Please fill in all guest details.");
            return;
        }

        setLoading(true);
        setTimeout(async () => {
            alert('Booking Confirmed! (Demo Mode)');
            router.push('/');
            setLoading(false);
        }, 1500);
    };

    if (!stayDates || roomTypes.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading rates...</div>;
    }

    // Helper to get plans for a room
    const getPlans = (roomId: string) => ratePlans.filter(p => p.room_type_id === roomId);

    return (
        <main className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', margin: '0 0 0.5rem 0' }}>
                    {step === 1 ? 'Select Your Rooms' : 'Guest Details'}
                </h1>
            </div>

            {step === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 300px', gap: '2rem' }}>

                    {/* Room List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {roomTypes.map(room => (
                            <div key={room.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'row', background: 'white' }}>
                                <img src={room.image || 'https://placehold.co/300x200?text=Room'} alt={room.name} style={{ width: '250px', objectFit: 'cover' }} />
                                <div style={{ padding: '1.5rem', flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{room.name}</h3>
                                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>{room.description}</p>

                                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                        {getPlans(room.id).length === 0 ? (
                                            <div style={{ padding: '10px', fontStyle: 'italic', color: '#666' }}>No plans available for this room.</div>
                                        ) : (
                                            getPlans(room.id).map(plan => (
                                                <div key={plan.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '15px 0', borderTop: '1px solid #eee' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem', textDecoration: 'underline' }}>{plan.name}</div>
                                                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#444' }}>
                                                            {plan.description.split(',').map((item, i) => (
                                                                <li key={i}>{item.trim()}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>₹{Number(plan.price).toLocaleString()}</div>
                                                        <button
                                                            onClick={() => handlePlanSelect(room, plan)}
                                                            style={{
                                                                padding: '10px 20px',
                                                                background: selectedRooms[activeRoomIndex]?.planId === plan.id ? '#2c3e50' : '#d35400',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold',
                                                                fontSize: '0.9rem',
                                                                width: '100px'
                                                            }}
                                                        >
                                                            {selectedRooms[activeRoomIndex]?.planId === plan.id ? 'SELECTED' : 'ADD'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar / Your Stay */}
                    <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '20px' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Your Stay</h3>

                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <div>Check-in: <strong>{stayDates.checkIn.toLocaleDateString()}</strong></div>
                            <div>Check-out: <strong>{stayDates.checkOut.toLocaleDateString()}</strong></div>
                            <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '0.85rem' }}>{stayDates.nights} Night{stayDates.nights > 1 ? 's' : ''}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            {roomRequests.map((req, index) => (
                                <div key={index} onClick={() => setActiveRoomIndex(index)}
                                    style={{
                                        padding: '10px',
                                        border: activeRoomIndex === index ? '2px solid #27ae60' : '1px solid #eee',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        background: activeRoomIndex === index ? '#f0fdf4' : 'white'
                                    }}
                                >
                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Room {index + 1}</span>
                                        {selectedRooms[index] && <span style={{ color: '#27ae60' }}>✓</span>}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{req.adults} Adults, {req.children} Children</div>
                                    {selectedRooms[index] && (
                                        <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#2c3e50', fontWeight: '500' }}>
                                            {selectedRooms[index].roomTypeName}
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{selectedRooms[index].planName}</div>
                                            <div style={{ fontWeight: 'bold' }}>₹{selectedRooms[index].price.toLocaleString()}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                <span>Subtotal</span>
                                <span>₹{(getTotalPrice()).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                <span>GST (18%)</span>
                                <span>₹{(getTotalPrice() * 0.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50', borderTop: '1px dashed #eee', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                <span>Total</span>
                                <span>₹{(getTotalPrice() * 1.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <button onClick={() => setStep(2)} disabled={!isAllRoomsSelected()} style={{ width: '100%', marginTop: '1rem', padding: '12px', background: isAllRoomsSelected() ? '#2c3e50' : '#bdc3c7', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isAllRoomsSelected() ? 'pointer' : 'not-allowed' }}>PROCEED</button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: GUEST DETAILS */}
            {step === 2 && (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <h3>Confirm Your Booking</h3>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button onClick={() => setStep(1)} style={{ padding: '12px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Back</button>
                            <button onClick={handlePayment} style={{ flex: 1, padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Pay & Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
