-- Create room_plans table
CREATE TABLE IF NOT EXISTS room_plans (
    id TEXT PRIMARY KEY,
    room_type_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    FOREIGN KEY(room_type_id) REFERENCES room_types(id)
);

-- Seed Plans for Deluxe (type_deluxe)
INSERT OR IGNORE INTO room_plans (id, room_type_id, name, price, description) VALUES
('plan_deluxe_ep', 'type_deluxe', 'Room Only', 3500, 'Accommodation, Internet access'),
('plan_deluxe_cp', 'type_deluxe', 'Room & Breakfast', 4000, 'Accommodation, Daily breakfast'),
('plan_deluxe_luxury', 'type_deluxe', 'Taste of Luxury', 4500, 'Daily breakfast, One major meal, Spa savings');

-- Seed Plans for Super Deluxe (type_standard - Note: naming mismatch in DB vs Front, sticking to likely IDs)
-- Wait, in DB 'type_standard' is 'Standard Room' (2000), 'type_deluxe' is 'Deluxe' (3500), 'type_suite' is 'Luxury Suite' (6000).
-- In Frontend Checkout: Deluxe (4500), Super Deluxe (6500), Luxury (8500).
-- The frontend Mock Data prices DO NOT MATCH the DB Seed prices.
-- I should check the DB to see current prices before seeding to avoid confusion, or just seed consistent relative values.
-- Let's stick to the RELATIVE increments (+500, +1000) based on whatever the base rate is.
-- Actually, the request is to "edit them all". So I should seed them, and the user can update prices later.
-- I will seed for all 3 types found in DB.

-- Type Standard
INSERT OR IGNORE INTO room_plans (id, room_type_id, name, price, description) VALUES
('plan_std_ep', 'type_standard', 'Room Only', 2000, 'Accommodation only'),
('plan_std_cp', 'type_standard', 'Room & Breakfast', 2500, 'Breakfast included'),
('plan_std_lux', 'type_standard', 'Taste of Luxury', 3000, 'Breakfast + Meal');

-- Type Suite
INSERT OR IGNORE INTO room_plans (id, room_type_id, name, price, description) VALUES
('plan_suite_ep', 'type_suite', 'Room Only', 6000, 'Accommodation only'),
('plan_suite_cp', 'type_suite', 'Room & Breakfast', 6500, 'Breakfast included'),
('plan_suite_lux', 'type_suite', 'Taste of Luxury', 7000, 'All inclusive perks');
