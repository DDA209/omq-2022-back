/**
 * Commun fields for all collections
 */

module.exports = {
	isDeleted: {
		type: Boolean,
		required: true,
		default: false,
	},
	creationDateTime: {
		type: Date,
		required: true,
		default: Date.now,
	},
	lastUpdateDateTime: {
		type: Date,
		required: true,
		default: Date.now,
	},
};
