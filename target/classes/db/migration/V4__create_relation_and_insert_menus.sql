CREATE TABLE IF NOT EXISTS role_menus (
    role_id int8 not null,
    men_id int8 not null,
    primary key (role_id, men_id),
    CONSTRAINT role_fk FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    CONSTRAINT menu_fk FOREIGN KEY (men_id) REFERENCES Menus(men_id)
);

INSERT INTO role_menus VALUES
(1,1),
(1,2),
--(1,3),
(1,4),
(1,5),
(1,6),
(1,7),

(2,1),
(2,2),
(2,3),
(2,4),
(2,5),
(2,6),
(2,7),

(3,1),
(3,2),
(3,3),
(3,4),
(3,5),
(3,6),
(3,7),

(4,1),
(4,2),
(4,3),
(4,4),
(4,5),
(4,6),
(4,7),

(5,1),
(5,2),
--(5,3),
(5,4),
(5,5),
(5,6),
(5,7),

(6,1),
(6,2),
--(6,3),
(6,4),
(6,5),
(6,6),
(6,7)
;
