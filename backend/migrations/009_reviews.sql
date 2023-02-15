CREATE TABLE IF NOT EXISTS reviews
(
    user_id INTEGER, 
    book_id INTEGER,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id),
    UNIQUE (user_id, book_id)
);