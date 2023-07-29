CREATE TABLE IF NOT EXISTS Roles (
    role_id INT PRIMARY KEY,
    role VARCHAR,
    created_by VARCHAR NULL,
    created_on TIMESTAMP NULL,
    modified_by VARCHAR NULL,
    modified_on TIMESTAMP NULL
);

INSERT INTO Roles VALUES
(1, 'ROLE_USER', 'SUPER_ADMIN', null, 'SUPER_ADMIN', null),
(2, 'ROLE_ADMIN', 'SUPER_ADMIN', null, 'SUPER_ADMIN', null),
(3, 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN', null, 'SUPER_ADMIN', null),
(4, 'ROLE_SUPPLIER', 'SUPER_ADMIN', null, 'SUPER_ADMIN', null),
(5, 'ROLE_CARRIER', 'SUPER_ADMIN', null, 'SUPER_ADMIN', null),
(6, 'ROLE_WAREHOUSE', 'SUPER_ADMIN', null, 'SUPER_ADMIN', null);

CREATE TABLE IF NOT EXISTS Users (
    user_id INT PRIMARY KEY,
    role_id INT,
    name VARCHAR,
    email VARCHAR,
    login_id VARCHAR(255) NULL,
    password VARCHAR,
    account_non_expired boolean,
    account_non_locked boolean,
    non_expire_credentials boolean,
    is_active boolean,
    provider VARCHAR NOT NULL,
    provider_id VARCHAR,
    image_url VARCHAR,
    user_created_by VARCHAR(255) NULL,
    user_created_on TIMESTAMP NULL,
    modified_by VARCHAR(255) NULL,
    modified_on TIMESTAMP NULL,
    wallet_file_name VARCHAR(255),
    CONSTRAINT role_fk FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);
