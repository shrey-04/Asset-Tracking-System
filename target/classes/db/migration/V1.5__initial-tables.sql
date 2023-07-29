CREATE TABLE IF NOT EXISTS assets (
    asset_id VARCHAR PRIMARY KEY,
    asset_name VARCHAR,
    asset_type VARCHAR,
    info VARCHAR,
    is_delivered boolean,
    quantity INT NOT NULL,
    receiver_address VARCHAR,
    receiver_email VARCHAR,
    receiver_mobile_no VARCHAR,
    receiver_name VARCHAR,
    sender_address VARCHAR,
    sender_email VARCHAR,
    sender_mobile_no VARCHAR,
    sender_name VARCHAR,
    creation_month VARCHAR,
    token_amount INT
);

CREATE TABLE IF NOT EXISTS asset_transactions_list (
    asset_transaction_list_id INT PRIMARY KEY,
    state VARCHAR,
    tracking_msg VARCHAR,
    transaction_hash VARCHAR,
    transaction_time VARCHAR,
    asset_id VARCHAR,
    CONSTRAINT asset_fk FOREIGN KEY (asset_id) REFERENCES assets(asset_id)
);
