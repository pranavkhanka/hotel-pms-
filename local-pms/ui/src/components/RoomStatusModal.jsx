import { useState, useEffect } from 'react';

const RoomStatusModal = ({ isOpen, onClose, onSave, room }) => {
    const [status, setStatus] = useState('vacant');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        if (room) {
            setStatus(room.status || 'vacant');
            setFromDate(room.occupied_from || '');
            setToDate(room.occupied_to || '');
        }
    }, [room]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSave({
            ...room,
            status,
            occupied_from: status === 'occupied' ? fromDate : null,
            occupied_to: status === 'occupied' ? toDate : null
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4">Update Room {room?.room_number} Status</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="vacant"
                                checked={status === 'vacant'}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mr-2"
                            />
                            <span className="text-green-600 font-semibold">Vacant</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="occupied"
                                checked={status === 'occupied'}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mr-2"
                            />
                            <span className="text-red-600 font-semibold">Occupied</span>
                        </label>
                    </div>
                </div>

                {status === 'occupied' && (
                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full border p-2 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full border p-2 rounded text-sm"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomStatusModal;
