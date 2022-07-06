const Model = require('../../models/core/dblog');

/**
 * Log creations, updates and deletion in database
 * @param { object } logDatas
 */
const dbLog = (logDatas) => {
	new Model(logDatas).save((err, data) => {
		if (err) {
			console.log('dbLogger error', err);
			return;
		}
	});
};

module.exports = dbLog;
