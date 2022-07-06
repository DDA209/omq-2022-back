const mongoose = require('mongoose');
const dbPort = process.env.DB_URI;
const backPort = process.env.BACK_PORT;
require('dotenv').config();
// console.log('utils/connect.js process.env >>>', process.env);

/**
 * Backend connection
 */
const connectDb = async () => {
	try {
		const conn = await mongoose.connect(dbPort);
		console.log(`DB on: ${conn.connection._connectionString}`);
	} catch (err) {
		console.log('Connect DB err:', err);
		process.exit(1);
	}
};

/**
 * Database connection
 */
const connectBack = async (app) => {
	try {
		app.listen(backPort, () => {
			console.info(`Server connected. http://localhost:${backPort}`);
		});
	} catch (err) {
		console.log('Connect back-end err:', err);
	}
};
module.exports = { connectDb, connectBack };
