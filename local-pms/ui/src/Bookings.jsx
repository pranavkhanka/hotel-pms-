import { useState, useEffect } from 'react';
import { Calendar, Users, Home, Clock, Edit, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/bookings');
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/reservation?bookingId=${id}`);
    };

    if (loading) return <div className="p-8">Loading bookings...</div>;

    return (
        <div className="p-6 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="text-blue-600" /> Bookings
                </h1>
                <button
                    onClick={() => navigate('/reservation')}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    + New Reservation
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 font-semibold text-sm">
                        <tr>
                            <th className="p-4 border-b">Guest Name</th>
                            <th className="p-4 border-b">Room</th>
                            <th className="p-4 border-b text-center">Rooms</th>
                            <th className="p-4 border-b text-center">Guests</th>
                            <th className="p-4 border-b">Arrival</th>
                            <th className="p-4 border-b">Checkout</th>
                            <th className="p-4 border-b text-right">Deposit</th>
                            <th className="p-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{booking.guest_name || 'Walk-in'}</td>
                                <td className="p-4">{booking.room_number || 'N/A'}</td>
                                <td className="p-4 text-center">{booking.num_rooms}</td>
                                <td className="p-4 text-center">{booking.num_guests}</td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span>{new Date(booking.check_in).toLocaleDateString()}</span>
                                        <span className="text-xs text-gray-500">{booking.arrival_time || '14:00'}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span>{new Date(booking.check_out).toLocaleDateString()}</span>
                                        <span className="text-xs text-gray-500">{booking.checkout_time || '11:00'}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">₹{booking.advance_deposit}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleEdit(booking.id)}
                                        className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bookings;
