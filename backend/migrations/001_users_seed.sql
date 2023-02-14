INSERT OR IGNORE INTO users (username, password, email, user_role)
VALUES ('admin', '$2b$10$Nh10/ke25OzTaWWTJAsAS.6zJvdxo9KGCB3f352/U4ScItHd6YbAq',
        'admin@ibdb.ntnu.no', 'a'),
       ('user', '$2b$10$AAEtSMemqGlSaraarOwJr.ttDSD9br8tnnc1anMO9/3eTgukEUemu',
        'user@ibdb.ntnu.no', 'u');