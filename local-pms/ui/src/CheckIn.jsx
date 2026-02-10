import { useState } from 'react';

const CheckIn = () => {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="check-in-page p-6 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Check In Guest</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50">Reset</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700">Save (F10)</button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700">Close</button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'personal' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        Personal Detail
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'stay' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('stay')}
                    >
                        Guest Details / Stay
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'scan' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('scan')}
                    >
                        Scan Id
                    </button>
                </div>

                <div className="p-6">
                    {/* Personal Detail Tab */}
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column (Inputs) */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Name Row */}
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title</label>
                                        <select className="w-full border border-gray-300 rounded p-2 text-sm"><option>Mr.</option><option>Ms.</option></select>
                                    </div>
                                    <div className="col-span-5">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Guest First Name</label>
                                        <div className="flex">
                                            <input type="text" className="w-full border border-gray-300 rounded-l p-2 text-sm" placeholder="First Name" />
                                            <button className="bg-blue-50 p-2 border border-gray-300 border-l-0 rounded-r text-blue-600">+</button>
                                        </div>
                                    </div>
                                    <div className="col-span-5">
                                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Last Name</label>
                                        <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Last Name" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label><input type="email" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email-2</label><input type="email" className="w-full border p-2 rounded text-sm" /></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mobile No.</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mobile No. 2</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                </div>

                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Address</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>

                                <div className="grid grid-cols-12 gap-4 items-end">
                                    <div className="col-span-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">DOB</label>
                                        <input type="date" className="w-full border p-2 rounded text-sm" />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Gender</label>
                                        <div className="flex gap-4 text-sm">
                                            <label className="flex items-center"><input type="radio" name="gender" className="mr-1" /> Male</label>
                                            <label className="flex items-center"><input type="radio" name="gender" className="mr-1" /> Female</label>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Emp</label>
                                        <select className="w-full border p-2 rounded text-sm"><option>Select Emp</option></select>
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-red-500 uppercase mt-6 border-b pb-1">Company / Business</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Business Market</label>
                                        <select className="w-full border p-2 rounded text-sm"><option>Select Source</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Transport Mode</label>
                                        <input type="text" className="w-full border p-2 rounded text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Company</label>
                                        <div className="flex">
                                            <select className="w-full border border-gray-300 rounded-l p-2 text-sm"><option>Select Company</option></select>
                                            <button className="bg-blue-50 p-2 border border-gray-300 border-l-0 text-blue-600">+</button>
                                            <button className="bg-gray-50 p-2 border border-gray-300 border-l-0 rounded-r text-gray-600">Edit</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Voucher No.</label>
                                        <input type="text" className="w-full border p-2 rounded text-sm" />
                                    </div>
                                </div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Company GstNo</label><input type="text" readOnly className="bg-gray-100 w-full border p-2 rounded text-sm" /></div>
                            </div>

                            {/* Right Column (Other Details & Photo) */}
                            <div className="space-y-4">
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Pick and Drop Facility</label><select className="w-full border p-2 rounded text-sm"><option>Select Pick</option></select></div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Visit Purpose</label><select className="w-full border p-2 rounded text-sm"><option>Select VP</option></select></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Arrival From</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Departure To</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Country</label><input type="text" className="w-full border p-2 rounded text-sm" defaultValue="India" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">State</label><select className="w-full border p-2 rounded text-sm"><option>Select State</option></select></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">City</label><select className="w-full border p-2 rounded text-sm"><option>Select City</option></select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">ZIP Code</label><input type="text" className="w-full border p-2 rounded text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Booked by</label><select className="w-full border p-2 rounded text-sm"><option>Select Book...</option></select></div>
                                </div>

                                {/* Photo Box */}
                                <div className="mt-6 border p-4 rounded bg-gray-50 flex flex-col items-center">
                                    <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-400">
                                        <Users size={48} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-white border rounded text-xs">Choose Files</button>
                                        <button className="px-3 py-1 bg-white border rounded text-xs text-blue-600">Capture</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stay & Billing Tab */}
                    {activeTab === 'stay' && (
                        <div className="space-y-6">
                            {/* Stay Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border">
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Guest Type</label><select className="w-full border p-2 rounded text-sm"><option>Walk-In</option></select></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Room No.</label><select className="w-full border p-2 rounded text-sm"><option>Select RoomNos</option></select></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Room Category</label><select className="w-full border p-2 rounded text-sm"><option>Select Category</option></select></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Room Type</label><select className="w-full border p-2 rounded text-sm"><option>Select RoomType</option></select></div>

                                <div><label className="block text-xs font-semibold text-red-600 mb-1">Plan Type</label><select className="w-full border p-2 rounded text-sm"><option>Select Plantype</option></select></div>
                                <div><label className="block text-xs font-semibold text-red-600 mb-1">No. of Days</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={1} /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Tax Type</label><select className="w-full border p-2 rounded text-sm"><option>Exclusive</option></select></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Room Rent</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={0} /></div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded border">
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Dis.</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={0} /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Male</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={1} /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Female</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={0} /></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Child</label><input type="number" className="w-full border p-2 rounded text-sm" defaultValue={0} /></div>
                            </div>

                            {/* Billing Summary */}
                            <div className="bg-blue-50 p-6 rounded border border-blue-100">
                                <div className="grid grid-cols-2 gap-8 text-lg font-mono">
                                    <div className="flex justify-between"><span>Total :</span> <span>₹0.00</span></div>
                                    <div className="flex justify-between"><span>Tax :</span> <span>₹0.00</span></div>
                                    <div className="flex justify-between font-bold text-xl border-t border-blue-200 pt-2 col-span-2"><span>NET AMOUNT :</span> <span>₹0.00</span></div>
                                </div>
                            </div>

                            {/* Billing Instructions */}
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Billing Instructions</label><textarea className="w-full border p-2 rounded text-sm h-20" placeholder="Select Ins"></textarea></div>
                                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Pay Mode</label><select className="w-full border p-2 rounded text-sm mb-2"><option>Select PayMode</option></select></div>
                            </div>
                            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Remark</label><textarea className="w-full border p-2 rounded text-sm h-16"></textarea></div>
                            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Special Remark</label><textarea className="w-full border p-2 rounded text-sm h-16"></textarea></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import { Users } from 'lucide-react';

export default CheckIn;
