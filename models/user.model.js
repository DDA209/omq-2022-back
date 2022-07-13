const mongoose = require('mongoose');
const commonFields = require('./common/commonFields');

const collection = 'user';
console.log(`MODEL of ${collection}`);

const schema = new mongoose.Schema({
	...commonFields,
	username: {
		type: String,
		required: false,
		unique: true,
		sparse: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	emailValidated: {
		type: Boolean, // vegetable, fruit, fish, meet ....
		required: true,
		unique: false,
		default: true,
	},
	isActive: {
		type: Boolean,
		required: true,
		default: false,
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
	password: {
		salt: { type: String, required: true },
		hash: { type: String, required: true },
	},
	passwordAttempt: {
		type: Number,
		default: 0,
		min: 0,
		max: 10,
	},
	lastWrongPasswordDateTime: Date,
});

module.exports = mongoose.model(collection, schema);
