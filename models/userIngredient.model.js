const mongoose = require('mongoose');
const commonFields = require('./common/commonFields');

const collection = 'userIngredient';
console.log(`MODEL of ${collection}`);

const schema = new mongoose.Schema({
	...commonFields,
	user: {
		type: mongoose.Schema.Types.ObjectId, // is user ID only enough?
		ref: 'user',
		required: true,
		unique: false,
	},
	ingredient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ingredient',
		required: true,
		unique: false,
	},
	quantity: {
		type: Number, // in gram
		required: true,
		unique: false,
	},
});

schema.index({ user: 1, ingredient: 1 }, { unique: true });

module.exports = mongoose.model(collection, schema);
