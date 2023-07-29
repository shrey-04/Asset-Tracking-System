CREATE TABLE notification (
    id int8 PRIMARY KEY,
    is_read boolean,
    notification_msg VARCHAR(255),
    unique_notification_id VARCHAR(255),
    user_id int8 NOT NULL,
    CONSTRAINT notification_fk FOREIGN KEY (user_id) REFERENCES users
);


