import { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';

const Reservation = () => {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="reservation-page p-6 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {/* Icon placeholder if needed */}
                    <h1 className="text-2xl font-bold text-gray-800">New Reservation</h1>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50">Room Allotment</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50">Advance Deposit Details</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50">Reset</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700">Save F10</button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded shadow-sm hover:bg-red-100">Close</button>
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
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Guest <span className="text-red-500">First</span> Name</label>
                                        <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="M" />
                                    </div>
                                    <div className="col-span-5">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">&nbsp;</label>
                                        <div className="flex">
                                            <input type="text" className="w-full border border-gray-300 rounded-l p-2 text-sm" />
                                            <button className="bg-blue-50 p-2 border border-gray-300 border-l-0 rounded-r text-blue-600">+</button>
                                        </div>
                                    </div>
                                    <div className="col-span-5">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
                                        <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label><input type="email" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email-2</label><input type="email" className="w-full border p-2 rounded text-sm" /></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Reservation Type</label>
                                        <select className="w-full border p-2 rounded text-sm"><option>Confirm Booking</option></select>
                                    </div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mobile No.</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                </div>

                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mobile No. 2</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>

                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Address</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>

                                <div className="grid grid-cols-12 gap-4 items-end">
                                    <div className="col-span-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">DOB</label>
                                        <input type="text" className="w-full border p-2 rounded text-sm" placeholder="Please Select DOB" />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Gender</label>
                                        <div className="flex gap-4 text-sm">
                                            <label className="flex items-center"><input type="radio" name="gender" className="mr-1" defaultChecked /> Male</label>
                                            <label className="flex items-center"><input type="radio" name="gender" className="mr-1" /> Female</label>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Emp</label>
                                        <input type="text" className="w-full border p-2 rounded text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1"><span className="text-red-500">B</span>usiness Market</label>
                                        <select className="w-full border p-2 rounded text-sm"><option>Select Source</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Company</label>
                                        <div className="flex">
                                            <select className="w-full border border-gray-300 rounded-l p-2 text-sm"><option>Select Company</option></select>
                                            <button className="bg-blue-50 p-2 border border-gray-300 border-l-0 text-blue-600">+</button>
                                            <button className="bg-gray-50 p-2 border border-gray-300 border-l-0 rounded-r text-gray-600">Edit</button>
                                        </div>
                                    </div>
                                </div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Company GstNo</label><input type="text" readOnly className="bg-gray-100 w-full border p-2 rounded text-sm" /></div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Pick and Drop Facility</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Visit Purpose</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Arrival From</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Departure To</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Country</label><select className="w-full border p-2 rounded text-sm"><option>Select Country</option></select></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">State</label><select className="w-full border p-2 rounded text-sm"><option>Select State</option></select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">City</label><select className="w-full border p-2 rounded text-sm"><option>Select City</option></select></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">ZIP Code</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Booked By</label>
                                    <div className="relative">
                                        <select className="w-full border p-2 rounded text-sm appearance-none"><option>Select Bookedby</option></select>
                                        <button className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 font-bold">×</button>
                                        <button className="absolute right-0 top-0 bottom-0 bg-blue-50 border-l px-3 text-blue-600 font-bold">+</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Transport Mode</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Voucher No.</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Guest Details Tab */}
                    {activeTab === 'guest' && (
                        <div className="space-y-6">
                            {/* Dates Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div><input type="date" className="w-full border p-2 rounded text-sm" defaultValue="2026-01-29" /></div>
                                <div><input type="time" className="w-full border p-2 rounded text-sm" defaultValue="14:00" /></div>
                                <div><input type="date" className="w-full border p-2 rounded text-sm" defaultValue="2026-01-30" /></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Checked Out Time</label><input type="time" className="w-full border p-2 rounded text-sm" defaultValue="11:00" /></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Guest Type</label><input type="text" className="w-full border p-2 rounded text-sm" defaultValue="Adv. Booking" /></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Room Category (Avl : 0)</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Room Type</label><select className="w-full border p-2 rounded text-sm"><option>Select RoomType</option></select></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Plan Type</label><select className="w-full border p-2 rounded text-sm"><option>Select Category</option></select></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">No. of Days</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={1} /></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">No. of Room</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={1} /></div>
                            </div>

                            <div className="grid grid-cols-6 gap-4">
                                <div className="col-span-2"><label className="block text-xs font-semibold text-red-600 mb-1">Tax Type</label><select className="w-full border p-2 rounded text-sm"><option>Exclusive</option></select></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Room Rent</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={0} /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Dis.</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={0} /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Male</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={1} /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Female</label><input type="number" className="w-full border p-2 rounded text-sm" /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Child</label><input type="number" className="w-full border p-2 rounded text-sm" /></div>
                            </div>

                            <button className="flex items-center gap-1 text-blue-600 border border-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-50 mt-2">
                                <Plus size={14} /> Add
                            </button>

                            {/* Room Allotment Details Table */}
                            <div className="border rounded overflow-hidden mt-4">
                                <div className="bg-blue-50 p-2 border-b font-semibold text-sm text-blue-800">Rooms Allotment Details</div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-100 border-b">
                                            <tr>
                                                <th className="p-2 border-r w-8"></th>
                                                <th className="p-2 border-r">Reservation Date</th>
                                                <th className="p-2 border-r">Arrival Date</th>
                                                <th className="p-2 border-r">Arrival Time</th>
                                                <th className="p-2 border-r">Checked Out Date</th>
                                                <th className="p-2 border-r">Checked Out Time</th>
                                                <th className="p-2 border-r">No. of Days</th>
                                                <th className="p-2 border-r">Room No</th>
                                                <th className="p-2 border-r">Room Category</th>
                                                <th className="p-2 border-r">Plan Type</th>
                                                <th className="p-2">Room Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Empty row for now */}
                                            <tr>
                                                <td className="p-2 border-r text-center"><input type="checkbox" /></td>
                                                <td className="p-2 border-r h-8"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2 border-r"></td>
                                                <td className="p-2"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Service / Extras Section */}
                            <div className="grid grid-cols-6 gap-4 items-end mt-6 pb-6 border-b">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Service Name</label>
                                    <input type="text" className="w-full border p-2 rounded text-sm bg-white" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tax Type</label>
                                    <input type="text" className="w-full border p-2 rounded text-sm" defaultValue="Exclusive" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">QTY</label>
                                    <input type="number" className="w-full border p-2 rounded text-sm" defaultValue="1" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Price</label>
                                    <input type="number" className="w-full border p-2 rounded text-sm" defaultValue="0.00" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tax</label>
                                    <input type="number" className="w-full border p-2 rounded text-sm" defaultValue="0" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Total Amt</label>
                                    <input type="number" className="w-full border p-2 rounded text-sm" defaultValue="0" />
                                </div>
                            </div>

                            {/* Billing Instructions */}
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Billing Instructions</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Pay Mode</label><select className="w-full border p-2 rounded text-sm"><option>Select PayMode</option></select></div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Remark</label>
                                <div className="flex gap-2">
                                    <input type="text" className="w-full border p-2 rounded text-sm" placeholder="Remark" />
                                    <button className="p-2 border rounded-full hover:bg-gray-50 text-blue-600"><Plus size={16} /></button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Special Remark</label>
                                <div className="relative">
                                    <textarea className="w-full border p-2 rounded text-sm h-16"></textarea>
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
