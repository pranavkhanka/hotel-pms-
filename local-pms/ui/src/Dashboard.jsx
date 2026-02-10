import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import RoomStatusModal from './components/RoomStatusModal';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch rooms from our local API
        api.get('/rooms').then(res => setRooms(res.data)).catch(err => {
            console.error("Failed to fetch rooms", err);
            // Fallback demo data
            setRooms([
                { id: '1', room_number: '101', type_name: 'Deluxe', status: 'vacant' },
                { id: '2', room_number: '102', type_name: 'Standard', status: 'occupied', occupied_from: '2026-01-30', occupied_to: '2026-02-02' },
                { id: '3', room_number: '103', type_name: 'Suite', status: 'dirty' },
                { id: '4', room_number: '104', type_name: 'Deluxe', status: 'vacant' },
            ]);
        });
    }, []);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleSaveStatus = (updatedRoom) => {
        // Optimistic update
        setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));

        // Persist to backend
        api.put(`/rooms/${updatedRoom.id}/status`, updatedRoom)
            .then(res => console.log('Status updated:', res.data))
            .catch(err => console.error('Failed to update status:', err));
    };

    return (
        <div>
            <div className="header">
                <div className="title">Front Desk</div>
            </div>

            <div className="room-grid">
                {rooms.map(room => (
                    <div
                        key={room.id}
                        className={`room-card cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden`}
                        onClick={() => handleRoomClick(room)}
                    >
                        <div className="room-number">{room.room_number}</div>
                        <div className="room-type">{room.type_name}</div>

                        <div className={`status-badge status-${room.status} flex flex-col items-center justify-center`}>
                            <span className="capitalize">{room.status}</span>
                            {room.status === 'occupied' && room.occupied_from && (
                                <span className="text-[10px] mt-1 opacity-90">
                                    {new Date(room.occupied_from).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -
                                    {new Date(room.occupied_to).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedRoom && (
                <RoomStatusModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    room={selectedRoom}
                    onSave={handleSaveStatus}
                />
            )}
        </div>
    );
};

export default Dashboard;
