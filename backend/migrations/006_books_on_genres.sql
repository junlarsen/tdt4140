CREATE TABLE IF NOT EXISTS books_on_genres
(
    genre_id INTEGER,
    book_id  INTEGER,
    FOREIGN KEY (book_id) REFERENCES books (id),
    FOREIGN KEY (genre_id) REFERENCES genres (id),
    UNIQUE (genre_id, book_id)
);
