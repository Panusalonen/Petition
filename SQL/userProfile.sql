DROP TABLE IF EXISTS userProfile;

CREATE TABLE userProfile(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    age INTEGER,
    city VARCHAR(200),
    homepage VARCHAR(200)
);

SELECT * FROM userProfile;
