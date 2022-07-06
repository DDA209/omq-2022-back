const mongoose = require('mongoose');
const commonFields = require('./common/commonFields');

const collection = 'ingredient';
console.log(`MODEL of ${collection}`);

const schema = new mongoose.Schema({
	...commonFields,
	name: {
		type: String,
		required: true,
		unique: true,
	},
	volumicMass: {
		type: Number,
		required: false,
		unique: true,
	},
	// type: {
	// 	type: String, // vegetable, fruit, fish, meet ....
	// 	required: true,
	// 	unique: false,
	// },
	// calories: {
	// 	type: Number,
	// 	required: true,
	// 	unique: false,
	// 	default: 0,
	// },
});

module.exports = mongoose.model(collection, schema);
