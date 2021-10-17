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
  return getAllProperties(null, 2);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

// const getAllProperties = function (options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };

// const getAllProperties = (options, limit = 10) => {
//   pool
//     .query(`SELECT * FROM properties LIMIT $1`, [limit])
//     .then((result) => {
//       console.log(result.rows);
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
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
