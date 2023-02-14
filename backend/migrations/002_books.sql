CREATE TABLE IF NOT EXISTS books
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    release_year INTEGER NOT NULL,
    description  TEXT DEFAULT NULL,
    image        TEXT DEFAULT NULL
);
