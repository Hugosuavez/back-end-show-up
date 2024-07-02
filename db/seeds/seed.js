const format = require("pg-format");
const db = require("../connection");

const seed = ({
  userTypesData,
  usersData,
  availabilityData,
  categoriesData,
  locationsData,
  bookingsData,
  messagesData,
  userMediaData
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
      return db.query(`DROP TABLE IF EXISTS userMedia`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS userTypes`);
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
      return db.query(`CREATE TABLE userTypes (
            type VARCHAR PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
    })
    .then(() => {
      return db.query(`
           CREATE TABLE users (
           user_id SERIAL PRIMARY KEY,
           username VARCHAR NOT NULL,
           password VARCHAR NOT NULL,
           first_name VARCHAR NOT NULL,
           last_name VARCHAR NOT NULL,
           email VARCHAR NOT NULL,
           profile_img_url VARCHAR,
           user_type VARCHAR NOT NULL REFERENCES userTypes(type), 
           category VARCHAR NULL REFERENCES categories(category),
           location VARCHAR NULL REFERENCES locations(location),
           entertainer_name VARCHAR NULL,
           description VARCHAR NULL,
           price INT NULL,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           ); 
            `);
    })
    .then(() => {
      return db.query(`CREATE TABLE userMedia (
            media_id SERIAL PRIMARY KEY,
            url VARCHAR NOT NULL,
            user_id INT NOT NULL REFERENCES users(user_id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
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
            user_id INT NOT NULL REFERENCES users(user_id),
            entertainer_id INT NOT NULL REFERENCES users(user_id),
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
            payee INT NOT NULL REFERENCES users(user_id),
            recipient INT NOT NULL REFERENCES users(user_id)
            );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE availability (
            availability_id SERIAL PRIMARY KEY,
            entertainer_id INT NOT NULL REFERENCES users(user_id),
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

      const insertUserTypesQueryStr = format(
        "INSERT INTO userTypes (type) VALUES %L",
        userTypesData.map(({ type }) => [type])
      );

      const userTypesPromise = db.query(insertUserTypesQueryStr);

      return Promise.all([locationsPromise, categoriesPromise, userTypesPromise]);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, password, first_name, last_name, email, profile_img_url, user_type, category, location, entertainer_name, description, price) VALUES %L RETURNING *",
        usersData.map(
          ({
            username,
            password,
            first_name,
            last_name,
            email,
            profile_img_url,
            user_type,
            category,
            location,
            entertainer_name,
            description,
            price
          }) => [
            username,
            password,
            first_name,
            last_name,
            email,
            profile_img_url,
            user_type,
            category,
            location,
            entertainer_name,
            description,
            price
          ]
        )
      );
      return db.query(insertUsersQueryStr);
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
        "INSERT INTO bookings (user_id, entertainer_id, booking_date, event_details, address) VALUES %L",
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
    })
    .then(() => {
      const insertUserMediaQueryStr = format("INSERT INTO userMedia (url, user_id, created_at) VALUES %L", userMediaData.map(({url, user_id, created_at}) => [url, user_id, created_at]))

      return db.query(insertUserMediaQueryStr)
    })
    .catch((err) => {
      console.error("Error seeding database", err);
    });
};

module.exports = seed;
