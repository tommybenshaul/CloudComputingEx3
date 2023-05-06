// const Datastore = require('nedb');
//
// // Define the database filename and options
// const DB_FILENAME = 'users.db';
// const DB_OPTIONS = {
//     autoload: true,
//     timestampData: true,
//     // Add any other options here as needed
// };
//
// // Initialize the database instance
// const usersDB = new Datastore({
//     filename: DB_FILENAME,
//     ...DB_OPTIONS
// });
//
// // Define the user schema
// const USER_SCHEMA = {
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// };
//
// // Ensure indexes on the email field for faster queries
// usersDB.ensureIndex({ fieldName: 'email', unique: true }, err => {
//     if (err) {
//         console.error(err);
//     }
// });
//
// // Define the database API
// const database = {
//     // Insert a new user
//     async insertUser(user) {
//         try {
//             const newDoc = await usersDB.insert(user);
//             return newDoc;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     },
//
//     // Find a user by email
//     async findUserByEmail(email) {
//         try {
//             const user = await usersDB.findOne({ email });
//             return user;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     },
//
//     // Get all users
//     async getAllUsers() {
//         try {
//             const users = await usersDB.find({});
//             return users;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     },
//
//     // Update a user by ID
//     async updateUserById(id, update) {
//         try {
//             const numUpdated = await usersDB.update({ _id: id }, { $set: update });
//             return numUpdated;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     },
//
//     // Delete a user by ID
//     async deleteUserById(id) {
//         try {
//             const numRemoved = await usersDB.remove({ _id: id });
//             return numRemoved;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     }
// };
//
// module.exports = database;
