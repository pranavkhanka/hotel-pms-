-- Seed 3 Room Categories
INSERT OR IGNORE INTO room_types (id, name, base_price, gst_percent, sync_status) VALUES 
('type_standard', 'Standard Room', 2000, 12, 'pending'),
('type_deluxe', 'Deluxe Room', 3500, 12, 'pending'),
('type_suite', 'Luxury Suite', 6000, 18, 'pending');

-- Seed 45 Rooms
-- Floor 1: Standard (101-115)
INSERT OR IGNORE INTO rooms (id, room_number, room_type_id, status, sync_status) VALUES
('r101', '101', 'type_standard', 'vacant', 'pending'),
('r102', '102', 'type_standard', 'vacant', 'pending'),
('r103', '103', 'type_standard', 'vacant', 'pending'),
('r104', '104', 'type_standard', 'vacant', 'pending'),
('r105', '105', 'type_standard', 'vacant', 'pending'),
('r106', '106', 'type_standard', 'vacant', 'pending'),
('r107', '107', 'type_standard', 'vacant', 'pending'),
('r108', '108', 'type_standard', 'vacant', 'pending'),
('r109', '109', 'type_standard', 'vacant', 'pending'),
('r110', '110', 'type_standard', 'vacant', 'pending'),
('r111', '111', 'type_standard', 'vacant', 'pending'),
('r112', '112', 'type_standard', 'vacant', 'pending'),
('r113', '113', 'type_standard', 'vacant', 'pending'),
('r114', '114', 'type_standard', 'vacant', 'pending'),
('r115', '115', 'type_standard', 'vacant', 'pending');

-- Floor 2: Deluxe (201-215)
INSERT OR IGNORE INTO rooms (id, room_number, room_type_id, status, sync_status) VALUES
('r201', '201', 'type_deluxe', 'vacant', 'pending'),
('r202', '202', 'type_deluxe', 'vacant', 'pending'),
('r203', '203', 'type_deluxe', 'vacant', 'pending'),
('r204', '204', 'type_deluxe', 'vacant', 'pending'),
('r205', '205', 'type_deluxe', 'vacant', 'pending'),
('r206', '206', 'type_deluxe', 'vacant', 'pending'),
('r207', '207', 'type_deluxe', 'vacant', 'pending'),
('r208', '208', 'type_deluxe', 'vacant', 'pending'),
('r209', '209', 'type_deluxe', 'vacant', 'pending'),
('r210', '210', 'type_deluxe', 'vacant', 'pending'),
('r211', '211', 'type_deluxe', 'vacant', 'pending'),
('r212', '212', 'type_deluxe', 'vacant', 'pending'),
('r213', '213', 'type_deluxe', 'vacant', 'pending'),
('r214', '214', 'type_deluxe', 'vacant', 'pending'),
('r215', '215', 'type_deluxe', 'vacant', 'pending');

-- Floor 3: Suite (301-315)
INSERT OR IGNORE INTO rooms (id, room_number, room_type_id, status, sync_status) VALUES
('r301', '301', 'type_suite', 'vacant', 'pending'),
('r302', '302', 'type_suite', 'vacant', 'pending'),
('r303', '303', 'type_suite', 'vacant', 'pending'),
('r304', '304', 'type_suite', 'vacant', 'pending'),
('r305', '305', 'type_suite', 'vacant', 'pending'),
('r306', '306', 'type_suite', 'vacant', 'pending'),
('r307', '307', 'type_suite', 'vacant', 'pending'),
('r308', '308', 'type_suite', 'vacant', 'pending'),
('r309', '309', 'type_suite', 'vacant', 'pending'),
('r310', '310', 'type_suite', 'vacant', 'pending'),
('r311', '311', 'type_suite', 'vacant', 'pending'),
('r312', '312', 'type_suite', 'vacant', 'pending'),
('r313', '313', 'type_suite', 'vacant', 'pending'),
('r314', '314', 'type_suite', 'vacant', 'pending'),
('r315', '315', 'type_suite', 'vacant', 'pending');
