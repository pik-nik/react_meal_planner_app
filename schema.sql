CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_digest TEXT NOT NULL
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name TEXT, 
    image TEXT, 
    edamam_id TEXT, 
    user_id INTEGER,
);

CREATE TABLE columns 

-- we will need to splice to get the edamam id 