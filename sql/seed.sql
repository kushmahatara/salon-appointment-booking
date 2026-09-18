-- Seed data for Salon Appointment Booking System
-- Standard Nepalese salon services and sample initial appointments

INSERT INTO services (name, price, duration) VALUES
('Haircut', 500.0, 30),
('Hair Coloring', 2500.0, 120),
('Facial', 1500.0, 60),
('Beard Trim & Styling', 400.0, 25),
('Luxury Head Massage', 800.0, 40);

INSERT INTO appointments (customer_name, customer_phone, service_id, appointment_date, appointment_time, notes, status, created_at) VALUES
('Ram Sharma', '+977-9841234567', 1, '2026-09-20', '10:00:00', 'Prefers short side cut', 'Confirmed', CURRENT_TIMESTAMP),
('Sita Thapa', '+977-9801987654', 3, '2026-09-20', '11:30:00', 'Sensitive skin facial product', 'Pending', CURRENT_TIMESTAMP),
('Hari Gurung', '+977-9851122334', 2, '2026-09-21', '14:00:00', 'Organic dark brown shade', 'Completed', CURRENT_TIMESTAMP);
