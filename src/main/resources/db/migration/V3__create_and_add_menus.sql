    CREATE TABLE IF NOT EXISTS menus (
	men_id INT8 PRIMARY KEY,
	menu_display_name VARCHAR(255) NULL,
	menu_icon_name VARCHAR(255) NULL,
	menu_id INT8 NULL,
	menu_order_by INT4 NULL,
	menu_status INT4 NULL,
	parent_menu_id INT8 NULL,
	router_name VARCHAR(255) NULL
);

INSERT INTO menus VALUES
(1, 'Dashboard', 'fa fa-image', 1000, 1, 1, 0, 'dashboard'),

(2, 'Shipments', 'fa fa-truck', 2000,1, 1, 0, 'shipmentDetails'),
(3, 'Create Shipment', 'fa fa-truck', 2050,1, 1, 2000, 'createAsset'),
(4, 'Shipment Details', 'fa fa-truck', 2100, 2, 1, 2000, 'shipmentDetails'),



(5, 'Analysis', 'fa fa-eye', 3000, 1, 1, 0, 'analysis'),
(6, 'Notifications', 'fa fa-comment', 4000, 1, 1, 0, 'notifications'),
(7, 'About Application', 'fa fa-fax', 5000, 1, 1, 0, 'about-application');