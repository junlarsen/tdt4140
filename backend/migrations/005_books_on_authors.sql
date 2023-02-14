CREATE TABLE IF NOT EXISTS books_on_authors
(
    author_id INTEGER,
    book_id   INTEGER,
    FOREIGN KEY (book_id) REFERENCES books (id),
    FOREIGN KEY (author_id) REFERENCES authors (id),
    UNIQUE (author_id, book_id)
);
