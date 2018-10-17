    1. get route for login
    2. get route for register
    3. post route for login
    4. post route for register

    login page middleware should run berfore thanks

    1. login template
    2. register template


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    signature TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL
);

register > do the insert table into TABLE on succesful reg user are logged in
set new session userID (maybe also first name/last name to say hi "name")

create middleware function is user logged in, if they are not logged in,
send them to register page or log in page

- - - - - - - - - - - - -

To JOIN 2 tables together:

SELECT singers.name, songs,name
FROM singers
JOIN songs
ON singers.id = songs.singer_id;

- - - - - - - - - - - - -

SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url
FROM users
JOIN user_profiles
ON users.id = user_profiles.user_id;

- - - - - -- - - - - -

INSERT INTO actors (name, age, oscars)
VALUES ('Penélope Cruz', 43, 1)
ON CONFLICT (name)
DO UPDATE SET age = 43, oscars = 1;
