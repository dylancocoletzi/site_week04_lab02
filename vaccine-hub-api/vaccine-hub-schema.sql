CREATE TABLE users(
    id              SERIAL PRIMARY KEY,
    email           TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
    password        TEXT NOT NULL,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    location        TEXT NOT NULL,
    date            TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ["email", "password", "first_name", "last_name", "location"]