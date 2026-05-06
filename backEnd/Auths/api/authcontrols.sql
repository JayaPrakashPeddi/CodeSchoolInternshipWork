-- Active: 1775629728003@@127.0.0.1@5432@authcontrols@public

create Table users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(30),
    phone_number VARCHAR(10) NOT NULL UNIQUE check (length(phone_number) = 10),
    email VARCHAR(50) UNIQUE,
    password TEXT NOT NULL,
    photo TEXT,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    token VARCHAR(20) UNIQUE NOT NULL,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hours',
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(10),
    otp VARCHAR(225),
    otp_expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 minutes',
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users;