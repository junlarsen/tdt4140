ALTER TABLE books
ADD COLUMN goodreads_url TEXT DEFAULT NULL;

ALTER TABLE books
ADD COLUMN goodreads_rating REAL NOT NULL DEFAULT 0.0