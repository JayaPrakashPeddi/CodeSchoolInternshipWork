-- Active: 1775629728003@@127.0.0.1@5432@temp@public
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
    pan_number VARCHAR(10) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    password VARCHAR(30) NOT NULL,
    CHECK (length(pan_number) = 10),
    CHECK (length(phone_number) = 10)
);

ALTER Table users ALTER COLUMN password TYPE VARCHAR(225);

CREATE TABLE user_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(20) UNIQUE NOT NULL,
    user_id INT REFERENCES users (id),
    expire_at TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM users;
SELECT * FROM user_tokens;

ALTER TABLE user_tokens
ALTER COLUMN expire_at
SET DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour');

UPDATE user_tokens SET expire_at=current_timestamp + INTERVAL '1 minutes' where id=41;

-- DELETE FROM user_tokens;
-- DELETE FROM users;