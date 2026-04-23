-- Active: 1775629728003@@127.0.0.1@5432@carrentalsmanagement@public
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL CHECK (length(phone) = 10),
    pan_number VARCHAR(10) UNIQUE NOT NULL CHECK (length(pan_number) = 10),
    license_number VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    aadhar_number VARCHAR(12) UNIQUE NOT NULL,
    password VARCHAR(225) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES users (id)
);

INSERT INTO admins (admin_id) VALUES (1);

SELECT * FROM admins;

SELECT * FROM users;

update users
set
    first_name = 'admin',
    last_name = 'admin',
    email = 'admin@gmail.com',
    phone = '0000000000',
    aadhar_number = '000000000000',
    license_number = 'XX00 00000000000'
WHERE
    id = 1;

CREATE TABLE user_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    token VARCHAR(30) UNIQUE NOT NULL,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM user_tokens;

DELETE FROM user_tokens;

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    number_plate VARCHAR(20) UNIQUE NOT NULL,
    price_per_day NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    photo VARCHAR(225) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM vehicles;

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles (id) ON DELETE CASCADE,
    booked_date DATE NOT NULL,
    return_date DATE NOT NULL CHECK (return_date > booked_date),
    total_amount DECIMAL(10, 2) NOT NULL
);

SELECT * FROM bookings;

INSERT INTO bookings (user_id, vehicle_id, booked_date, return_date, total_amount)
VALUES (4, 2, '2026-04-25', '2026-04-28', 60000.00);