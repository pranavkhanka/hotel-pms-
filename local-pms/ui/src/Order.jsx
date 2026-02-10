import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Coffee, Utensils, Beer, IceCream, ArrowLeft, Check, Square } from 'lucide-react';

const Order = () => {
    const [selectedTable, setSelectedTable] = useState(null); // null = show grid, number = show menu
    const [cart, setCart] = useState([]);
    const [printKOT, setPrintKOT] = useState(false);
    const [isRoomServiceModalOpen, setIsRoomServiceModalOpen] = useState(false);
    const [roomServiceNumber, setRoomServiceNumber] = useState('');
    const [modalPrintKOT, setModalPrintKOT] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [showDiscountInput, setShowDiscountInput] = useState(false);
    const [orders, setOrders] = useState({}); // { tableId: [items] }

    // Generate 35 tables
    const tables = Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        status: 'vacant' // This could be dynamic later
    }));

    // Food Menu Data
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = [
        { id: 'All', name: 'All Items' },
        { id: 'Starters', name: 'Starters', icon: <Utensils size={18} /> },
        { id: 'Main Course', name: 'Main Course', icon: <Utensils size={18} /> },
        { id: 'Beverages', name: 'Beverages', icon: <Beer size={18} /> },
        { id: 'Desserts', name: 'Desserts', icon: <IceCream size={18} /> },
    ];

    const menuItems = [
        { id: 1, name: 'Crispy Corn', category: 'Starters', price: 180, image: '🌽' },
        { id: 2, name: 'Paneer Tikka', category: 'Starters', price: 250, image: '🍢' },
        { id: 3, name: 'Butter Chicken', category: 'Main Course', price: 350, image: '🥘' },
        { id: 4, name: 'Dal Makhani', category: 'Main Course', price: 220, image: '🍲' },
        { id: 5, name: 'Garlic Naan', category: 'Main Course', price: 40, image: '🫓' },
        { id: 6, name: 'Cold Coffee', category: 'Beverages', price: 120, image: '🥤' },
        { id: 7, name: 'Masala Chai', category: 'Beverages', price: 30, image: '☕' },
        { id: 8, name: 'Gulab Jamun', category: 'Desserts', price: 80, image: '🥯' },
    ];

    const filteredItems = activeCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.reduce((acc, item) => {
            if (item.id === id) {
                return item.qty > 1 ? [...acc, { ...item, qty: item.qty - 1 }] : acc;
            }
            return [...acc, item];
        }, []));
    };

    // Calculate Totals
    const currentCartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Get confirmed orders for selected table
    const tableOrders = selectedTable ? (orders[selectedTable] || []) : [];
    const runningOrderTotal = tableOrders.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Grand Total
    const subtotal = currentCartTotal + runningOrderTotal;
    const taxAmount = subtotal * 0.05;
    const discountAmount = (subtotal * discount) / 100;
    const finalTotal = subtotal + taxAmount - discountAmount;

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;

        // Add current cart to table orders
        setOrders(prev => {
            const currentTableOrders = prev[selectedTable] || [];
            // Merge logic: simpler to just append items for now, or merge if same ID?
            // Merging by ID is cleaner for the Running Tab view.
            const newOrders = [...currentTableOrders];
            cart.forEach(cartItem => {
                const existing = newOrders.find(i => i.id === cartItem.id);
                if (existing) {
                    existing.qty += cartItem.qty;
                } else {
                    newOrders.push({ ...cartItem });
                }
            });
            return { ...prev, [selectedTable]: newOrders };
        });

        alert(`Order placed successfully for Table ${selectedTable}! ${printKOT ? '(KOT Printed)' : ''}\nItems added to Running Tab.`);

        setCart([]);
        setPrintKOT(false);
        // Do NOT close the table view or clear selection immediately, let user decide.
        // Or if they want to "Confirm and Done", we can go back. User request implies persistence.
        // Let's keep them on the table view so they can see it moved to tab? 
        // Usually PMS goes back to grid. Let's go back to grid for workflow efficiency.
        setSelectedTable(null);
    };

    const handleGenerateBill = () => {
        if (subtotal === 0) return;

        alert(`Bill Generated for Table ${selectedTable}\n\nRunning Orders: ₹${runningOrderTotal}\nNew Orders: ₹${currentCartTotal}\n----------------\nSubtotal: ₹${subtotal}\nTax (5%): ₹${taxAmount.toFixed(2)}\nDiscount (${discount}%): -₹${discountAmount.toFixed(2)}\n----------------\nGRAND TOTAL: ₹${finalTotal.toFixed(2)}`);

        // Clear orders and cart for this table
        setOrders(prev => {
            const next = { ...prev };
            delete next[selectedTable];
            return next;
        });
        setCart([]);
        setDiscount(0);
        setShowDiscountInput(false);
        setPrintKOT(false);
        setSelectedTable(null); // Return to grid logic
    };

    // --- View: Table Grid ---
    if (!selectedTable) {
        return (
            <div>
                <div className="header">
                    <div className="title flex items-center gap-2"><Utensils /> Restaurant Tables</div>
                </div>

                <div className="room-grid">
                    {tables.map(table => (
                        <div
                            key={table.id}
                            onClick={() => setSelectedTable(table.id)}
                            className="room-card"
                        >
                            <div className="room-number">Table {table.id}</div>
                            <div className="room-type">Restaurant</div>

                            <div className={`status-badge status-${table.status}`}>
                                {table.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- View: Order Menu (for selected table) ---
    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 p-6">
            {/* Menu Section */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedTable(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Ordering for <span className="text-blue-600 underline">Table {selectedTable}</span>
                        </h1>
                    </div>
                    <div className="text-sm text-gray-500">
                        {filteredItems.length} items
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 p-4 border-b overflow-x-auto">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                                ${activeCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <span className="flex items-center gap-2">
                                {cat.icon} {cat.name}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4 text-center bg-gray-50 rounded py-4">{item.image}</div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <span className="font-bold text-blue-600">₹{item.price}</span>
                                </div>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full mt-2 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100 border border-blue-200"
                                >
                                    + Add Item
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-96 bg-white rounded-lg shadow-md flex flex-col border">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingCart size={20} /> Table {selectedTable} Order
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Running Orders Section */}
                    {tableOrders.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Running Orders (Confirmed)</h3>
                            <div className="bg-gray-50 rounded border border-gray-200">
                                {tableOrders.map((item, idx) => (
                                    <div key={`run-${item.id}-${idx}`} className="flex justify-between items-center p-2 border-b last:border-0 border-gray-100">
                                        <div>
                                            <div className="font-medium text-gray-700">{item.name}</div>
                                            <div className="text-xs text-gray-400">₹{item.price} x {item.qty}</div>
                                        </div>
                                        <div className="font-semibold text-gray-600">
                                            ₹{item.price * item.qty}
                                        </div>
                                    </div>
                                ))}
                                <div className="p-2 bg-gray-100 text-right text-xs font-bold text-gray-600">
                                    Subtotal: ₹{runningOrderTotal}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* New Cart Items */}
                    <div>
                        {tableOrders.length > 0 && <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">New Items</h3>}
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-400 py-4">
                                {tableOrders.length === 0 && <Coffee size={48} className="mx-auto mb-2 opacity-20" />}
                                <p>{tableOrders.length > 0 ? 'No new items added' : `No items for Table ${selectedTable}`}</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                                    <div>
                                        <div className="font-medium text-gray-800">{item.name}</div>
                                        <div className="text-xs text-gray-500">₹{item.price} x {item.qty}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded">
                                            <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-gray-100 text-gray-600"><Minus size={14} /></button>
                                            <span className="px-2 text-sm font-medium">{item.qty}</span>
                                            <button onClick={() => addToCart(item)} className="p-1 hover:bg-gray-100 text-blue-600"><Plus size={14} /></button>
                                        </div>
                                        <div className="font-semibold text-gray-800 w-16 text-right">
                                            ₹{item.price * item.qty}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-100 border-t border-gray-200">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-300 p-5 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                            <span>🧾</span> Bill Summary
                        </h3>

                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{subtotal}</span>
                            </div>

                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                <span className="flex items-center gap-2">
                                    Discount
                                    <button
                                        onClick={() => setShowDiscountInput(!showDiscountInput)}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        [{showDiscountInput ? 'Cancel' : 'Apply'}]
                                    </button>
                                </span>
                                {showDiscountInput ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={discount}
                                            onChange={(e) => setDiscount(Number(e.target.value))}
                                            className="w-16 p-1 text-right border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="0"
                                            autoFocus
                                        />
                                        <span className="font-bold text-gray-500">%</span>
                                    </div>
                                ) : (
                                    <span className={`font-medium ${discount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {discount > 0 ? `${discount}%` : '0%'}
                                    </span>
                                )}
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 text-sm font-medium bg-green-50 p-1 rounded">
                                    <span>Discount Amount</span>
                                    <span>- ₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Tax (5%)</span>
                                <span className="font-medium text-gray-900">₹{taxAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-t border-dashed border-gray-200">
                            <span className="text-gray-700 font-medium text-sm">Print KOT?</span>
                            <div className="flex bg-gray-100 rounded-lg p-1 gap-1 border border-gray-200">
                                <button
                                    onClick={() => setPrintKOT(true)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${printKOT ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    YES
                                </button>
                                <button
                                    onClick={() => setPrintKOT(false)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!printKOT ? 'bg-white text-gray-700 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    NO
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-xl text-gray-800 border-t pt-3 border-gray-200">
                            <span>Total</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                                onClick={handleGenerateBill}
                                className="bg-green-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed col-span-2 text-sm"
                                disabled={subtotal === 0}
                            >
                                Generate Bill
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                disabled={cart.length === 0}
                            >
                                Confirm Order
                            </button>
                            <button
                                onClick={() => setIsRoomServiceModalOpen(true)}
                                className="bg-purple-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                disabled={cart.length === 0}
                            >
                                Room Service
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedTable(null);
                            setCart([]);
                            setPrintKOT(false);
                            // Do not clear orders or discount logic for consistency if user just backs out? 
                            // Actually, if they back out, they might want to cancel the 'New Order' part.
                            // But persistence means 'Confirmed' orders stay. 'New' cart should probably clear if they exit the view without confirming?
                            // Standard behavior: Cancel = Discard unconfirmed changes.
                        }}
                        className="w-full text-gray-500 text-sm mt-2 hover:underline"
                    >
                        Cancel / Back to Tables
                    </button>
                </div>
            </div>

            {/* Room Service Modal */}
            {isRoomServiceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h2 className="text-lg font-bold mb-4">Room Service</h2>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Room Number</label>
                        <input
                            type="text"
                            value={roomServiceNumber}
                            onChange={(e) => setRoomServiceNumber(e.target.value)}
                            className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            placeholder="e.g. 101"
                            autoFocus
                        />
                        <div className="flex items-center justify-between py-2 mb-4">
                            <span className="text-gray-700 font-medium text-sm">Print KOT?</span>
                            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                                <button
                                    onClick={() => setModalPrintKOT(true)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${modalPrintKOT ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setModalPrintKOT(false)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${!modalPrintKOT ? 'bg-white text-gray-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsRoomServiceModalOpen(false)}
                                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert(`Order placed successfully for Room ${roomServiceNumber}! ${modalPrintKOT ? '(KOT Printed)' : ''}`);
                                    setCart([]);
                                    setSelectedTable(null);
                                    setIsRoomServiceModalOpen(false);
                                    setRoomServiceNumber('');
                                    setModalPrintKOT(false);
                                }}
                                disabled={!roomServiceNumber}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Order;
