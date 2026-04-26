-- Active: 1775629728003@@127.0.0.1@5432@test@public
CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(20) );

INSERT INTO users (name) VALUES ('user3'),('user4');

SELECT * FROM users;

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    message_from INT REFERENCES users (id),
    message_to INT REFERENCES users (id),
    message_content TEXT,
    send_at TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO messages (message_from,message_to,message_content) VALUES (2,1,'byee');

SELECT * FROM messages;

SELECT * FROM messages WHERE (message_from = 1 AND message_to = 2) OR (message_from = 2 AND message_to = 1) ORDER BY send_at ;