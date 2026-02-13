import { useState, useEffect } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reservation = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingId = searchParams.get('bookingId');
    const isEditMode = !!bookingId;

    const [formData, setFormData] = useState({
        // Personal
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        // Guest Details
        checkInDate: new Date().toISOString().split('T')[0],
        checkInTime: '14:00',
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        checkOutTime: '11:00',
        roomType: 'Deluxe',
        numDays: 1,
        numRooms: 1,
        numGuests: 2,
        advanceDeposit: 0
    });

    useEffect(() => {
        if (isEditMode) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/bookings/${bookingId}`);
            const data = res.data;
            setFormData({
                firstName: data.guest_name ? data.guest_name.split(' ')[0] : '',
                lastName: data.guest_name ? data.guest_name.split(' ').slice(1).join(' ') : '',
                phone: data.phone || '',
                email: data.email || '',
                checkInDate: data.check_in.split('T')[0],
                checkInTime: data.arrival_time || '14:00',
                checkOutDate: data.check_out.split('T')[0],
                checkOutTime: data.checkout_time || '11:00',
                roomType: 'Standard', // TODO: Map from DB
                numDays: 1, // Calculate diff
                numRooms: data.num_rooms || 1,
                numGuests: data.num_guests || 1,
                advanceDeposit: data.advance_deposit || 0
            });
        } catch (err) {
            console.error('Failed to load booking', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const payload = {
            guest_id: 'guest_placeholder_id', // Simplify: In real app, create/find guest first
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            email: formData.email,
            room_id: 'room_placeholder_id', // Simplify: Assign room later or now
            check_in: `${formData.checkInDate}T${formData.checkInTime}:00.000Z`,
            check_out: `${formData.checkOutDate}T${formData.checkOutTime}:00.000Z`,
            num_guests: parseInt(formData.numGuests),
            num_rooms: parseInt(formData.numRooms),
            advance_deposit: parseFloat(formData.advanceDeposit),
            arrival_time: formData.checkInTime,
            checkout_time: formData.checkOutTime,
            total_amount: 0, // Calculate based on rates
            source: 'walk_in'
        };

        try {
            if (isEditMode) {
                // First update guest info if needed (skipping for now, focus on booking)
                await axios.put(`http://localhost:3001/api/bookings/${bookingId}`, payload);
            } else {
                // Create Guest first? For now, server handles basic guest creation if needed
                // Actually server.js expects guest_id. 
                // Let's create a guest on the fly or strict server to accept name.
                // Updated server.js to insert guest? No. 
                // Let's call create-guest API first.
                const guestRes = await axios.post('http://localhost:3001/api/guests', {
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email
                });
                payload.guest_id = guestRes.data.id;

                await axios.post('http://localhost:3001/api/bookings', payload);
            }
            navigate('/bookings');
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to save reservation: ' + err.message);
        }
    };

    return (
        <div className="reservation-page p-6 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {/* Icon placeholder if needed */}
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditMode ? 'Edit Reservation' : 'New Reservation'}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700"
                    >
                        Save F10
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'personal' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        Personal Detail
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'guest' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('guest')}
                    >
                        Guest Details
                    </button>
                </div>

                <div className="p-6">
                    {/* Personal Detail Tab */}
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {/* Name Row */}
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Guest <span className="text-red-500">First</span> Name</label>
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
                                        <input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            className="w-full border p-2 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile No.</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full border p-2 rounded text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Guest Details Tab */}
                    {activeTab === 'guest' && (
                        <div className="space-y-6">
                            {/* Dates Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">Arrival Date</label>
                                    <input
                                        name="checkInDate"
                                        value={formData.checkInDate}
                                        onChange={handleChange}
                                        type="date"
                                        className="w-full border p-2 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">Arrival Time</label>
                                    <input
                                        name="checkInTime"
                                        value={formData.checkInTime}
                                        onChange={handleChange}
                                        type="time"
                                        className="w-full border p-2 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">Checkout Date</label>
                                    <input
                                        name="checkOutDate"
                                        value={formData.checkOutDate}
                                        onChange={handleChange}
                                        type="date"
                                        className="w-full border p-2 rounded text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">Checkout Time</label>
                                    <input
                                        name="checkOutTime"
                                        value={formData.checkOutTime}
                                        onChange={handleChange}
                                        type="time"
                                        className="w-full border p-2 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">Advance Deposit</label>
                                    <input
                                        name="advanceDeposit"
                                        value={formData.advanceDeposit}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full border p-2 rounded text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">Room Type</label>
                                    <select
                                        name="roomType"
                                        value={formData.roomType}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded text-sm"
                                    >
                                        <option>Deluxe</option>
                                        <option>Super Deluxe</option>
                                        <option>Suite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">No. of Rooms</label>
                                    <input
                                        name="numRooms"
                                        value={formData.numRooms}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full border p-2 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-red-600 mb-1">No. of Guests</label>
                                    <input
                                        name="numGuests"
                                        value={formData.numGuests}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full border p-2 rounded text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reservation;
