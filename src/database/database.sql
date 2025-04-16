-- CREATE TYPE gender_type.
CREATE TYPE gender_type AS ENUM ('Male', 'Female');

-- CREATE TYPE role_type.
CREATE TYPE role_type AS ENUM ('Waiter', 'Waitress', 'Chef', 'Cook', 'Admin');

-- CREATE TYPE order_status_type.
CREATE TYPE order_status_type AS ENUM ('Pending', 'Prepared', 'Delivered', 'Payed', 'Canceled');

-- CREATE TYPE order_item_status_type.
CREATE TYPE order_item_status_type AS ENUM ('Pending', 'Prepared', 'Delivered', 'Canceled');

-- CREATE TABLE users.
CREATE TABLE users (
id SERIAL NOT NULL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
username VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
active BOOLEAN DEFAULT true,
gender gender_type NOT NULL,
role role_type NOT NULL,
-- points INT DEFAULT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE tables.
CREATE TABLE tables (
id SERIAL NOT NULL PRIMARY KEY,
number INT NOT NULL,
active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE categories.
CREATE TABLE categories (
id SERIAL NOT NULL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE meals.
CREATE TABLE meals (
id SERIAL NOT NULL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
price INT NOT NULL,
active BOOLEAN DEFAULT true,
image_url VARCHAR(255),
image_name VARCHAR(255),
category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
is_ready_product BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE orders.
CREATE TABLE orders (
id SERIAL NOT NULL PRIMARY KEY,
table_id INT REFERENCES tables(id) ON DELETE SET NULL,
service_staff_id INT REFERENCES users(id) ON DELETE SET NULL,
status order_status_type DEFAULT 'Pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE order_items.
CREATE TABLE order_items (
id SERIAL NOT NULL PRIMARY KEY,
order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
meal_id INT REFERENCES meals(id) ON DELETE SET NULL,
quantity INT NOT NULL,
status order_item_status_type DEFAULT 'Pending'
);