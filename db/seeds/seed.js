const format = require("pg-format");
const db = require("../connection");
const messages = require("../data/test-data/messages");

const seed = ({
  clientsData,
  entertainersData,
  availabilityData,
  categoriesData,
  locationsData,
  bookingsData,
  messagesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS availability`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS payments`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS bookings`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS messages`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS entertainers`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS clients`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS locations`);
    })
    .then(() => {
      const locationsTablePromise = db.query(`
            CREATE TABLE locations (
            location VARCHAR PRIMARY KEY)
            ;`);
      const categoriesTablePromise = db.query(`
            CREATE TABLE categories (
            category VARCHAR PRIMARY KEY);
            `);

      return Promise.all([locationsTablePromise, categoriesTablePromise]);
    })
    .then(() => {
      return db.query(`
           CREATE TABLE clients (
           client_id SERIAL PRIMARY KEY,
           username VARCHAR NOT NULL,
           password VARCHAR NOT NULL,
           first_name VARCHAR NOT NULL,
           last_name VARCHAR NOT NULL,
           email VARCHAR NOT NULL,
           profile_img_url VARCHAR NOT NULL
           ); 
            `);
    })
    .then(() => {
      return db.query(`
            CREATE TABLE entertainers (
            entertainer_id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL,
            password VARCHAR NOT NULL,
            category VARCHAR NOT NULL REFERENCES categories(category),
            location VARCHAR NOT NULL REFERENCES locations(location),
            entertainer_name VARCHAR NOT NULL,
            first_name VARCHAR NOT NULL,
            last_name VARCHAR NOT NULL,
            email VARCHAR NOT NULL
            description VARCHAR NOT NULL,
            price INT NOT NULL,
            profile_img_url VARCHAR,
            show_photos_url VARCHAR,
            video_link VARCHAR
            )
            ;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE messages (
            message_id SERIAL PRIMARY KEY,
            sender_id INT NOT NULL,
            recipient_id INT NOT NULL,
            sender_type VARCHAR NOT NULL,
            recipient_type VARCHAR NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE bookings (
            booking_id SERIAL PRIMARY KEY,
            client_id INT NOT NULL REFERENCES clients(client_id),
            entertainer_id INT NOT NULL REFERENCES entertainers(entertainer_id),
            booking_date DATE NOT NULL,
            event_details VARCHAR NOT NULL,
            address VARCHAR NOT NULL
            );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE payments (
            id SERIAL PRIMARY KEY,
            total_amount INT NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            payee INT NOT NULL REFERENCES clients(client_id),
            recipient INT NOT NULL entertainers(entertainer_id)
            );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE availability (
            availability_id SERIAL PRIMARY KEY,
            entertainer_id INT NOT NULL REFERENCES entertainers(entertainer_id),
            date DATE NOT NULL,
            available BOOLEAN
            );`);
    })
    .then(() => {
      const insertLocationsQueryStr = format(
        "INSERT INTO locations (location) VALUES %L",
        locationsData.map(({ location }) => [location])
      );
      const locationsPromise = db.query(insertLocationsQueryStr);

      const insertCategoriesQueryStr = format(
        "INSERT INTO categories (category) VALUES %L",
        categoriesData.map(({ category }) => [category])
      );

      const categoriesPromise = db.query(insertCategoriesQueryStr);

      const insertClientsQueryStr = format(
        "INSERT INTO clients (username, password, first_name, last_name, email, profile_img_url) VALUES %L",
        clientsData.map(
          ({
            username,
            password,
            first_name,
            last_name,
            email,
            profile_img_url,
          }) => [
            username,
            password,
            first_name,
            last_name,
            email,
            profile_img_url,
          ]
        )
      );

      const clientsPromise = db.query(insertClientsQueryStr);

      return Promise.all([locationsPromise, categoriesPromise, clientsPromise]);
    })
    .then(() => {
      const insertEntertainersQueryStr = format(
        "INSERT INTO entertainers (username, password, category, location, entertainer_name, first_name, last_name, email, description, price, profile_img_url, show_photos_url, video_link) VALUES %L RETURNING *",
        entertainersData.map(
          ({
            username,
            password,
            category,
            location,
            entertainer_name,
            first_name,
            last_name,
            email,
            description,
            price,
            profile_img_url,
            show_photos_url,
            video_link,
          }) => [
            username,
            password,
            category,
            location,
            entertainer_name,
            first_name,
            last_name,
            email,
            description,
            price,
            profile_img_url,
            show_photos_url,
            video_link,
          ]
        )
      );
      return db.query(insertEntertainersQueryStr);
    })
    .then(() => {
      const insertAvailabilityQueryStr = format(
        "INSERT INTO availability (entertainer_id, date, available) VALUES %L;",
        availabilityData.map(({ entertainer_id, date, available }) => [
          entertainer_id,
          date,
          available,
        ])
      );

      return db.query(insertAvailabilityQueryStr);
    })
    .then(() => {
      const insertBookingsQueryStr = format(
        "INSERT INTO bookings (client_id, entertainer_id, booking_date, event_details, address) VALUES %L",
        bookingsData.map(
          ({
            client_id,
            entertainer_id,
            booking_date,
            event_details,
            address,
          }) => [
            client_id,
            entertainer_id,
            booking_date,
            event_details,
            address,
          ]
        )
      );
      return db.query(insertBookingsQueryStr);
    })
    .then(() => {
      const insertMessagesQueryStr = format(
        "INSERT INTO messages (sender_id, recipient_id, sender_type, recipient_type, message, created_at) VALUES %L",
        messagesData.map(
          ({
            sender_id,
            recipient_id,
            sender_type,
            recipient_type,
            message,
            created_at,
          }) => [
            sender_id,
            recipient_id,
            sender_type,
            recipient_type,
            message,
            created_at,
          ]
        )
      );

      return db.query(insertMessagesQueryStr);
    });
};

module.exports = seed;
