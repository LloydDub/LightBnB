const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

//  SELECT id, name, email, password
//  FROM users
//  WHERE email= 'tristanjacobs@gmail.com';

const getUserWithEmail = function (email) {
  const userEmail = [email];
  const queryString = `SELECT *
  FROM users
  WHERE email= $1`;

  return pool
    .query(queryString, userEmail)
    .then((res) => {
      console.log(res.rows);
      return res.rows[0];
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const userId = [id];
  const queryString = `SELECT *
  FROM users
  WHERE id= $1`;

  return pool
    .query(queryString, userId)
    .then((res) => {
      console.log(res.rows);
      return res.rows[0];
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
//values = users (name, email, password)
//   This function should insert the new user into the database.
// It will return a promise that resolves with the new user object. This object should contain the user's id after it's been added to the database.
// Add RETURNING *; to the end of an INSERT query to return the objects that were inserted. This is handy when you need the auto generated id of an object you've just added to the database.

// INSERT INTO users (name, end_date, property_id, guest_id)
//     VALUES ($1, $2, $3, $4) RETURNING *;

const addUser = function (user) {
  const userInfo = [user.name, user.email, user.password];
  const queryString = `INSERT INTO users (
    name, email, password) 
    VALUES ($1, $2, $3);`;

  return pool
    .query(queryString, userInfo)
    .then((res) => {
      console.log(res.rows);
      return res.rows[0];
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const values = [guest_id, limit];
  return pool
    .query(queryString, values)
    .then((res) => {
      console.log(res.rows);
      console.log("!!!", queryString);
      return res.rows;
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
 SELECT properties.*, avg(property_reviews.rating) as average_rating
 FROM properties
 JOIN property_reviews ON properties.id = property_id
 `;

  // 3 check options

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(
      options.minimum_price_per_night * 100,
      options.maximum_price_per_night * 100
    );
    if (queryParams.length === 2) {
      queryString += `WHERE cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length} `;
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
 GROUP BY properties.id
 ORDER BY cost_per_night
 LIMIT $${queryParams.length};
 `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
