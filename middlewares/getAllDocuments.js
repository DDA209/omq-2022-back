const checkDocumentsDatas = require('../utils/checkDocumentsDatas');
const createPopulationTree = require('../utils/createPopulationTree');
const util = require('util');

/**
 * Read all documents in a collection
 * @param { function } Model		to use for finding
 * @param { string } here			microservice name
 * @param { object } res			response to send
 * @param { undefined } skip		not used
 * @param { undefined } limit		not used
 */
const getAllDocuments = (Model, here, res, skip, limit) => {
	console.log(`#getAllDocuments /${here}`);
	skip = 0;
	limit = false;
	const arrPopulation = createPopulationTree(Model);

	Model.find({}, [], { skip, limit, sort: { creationDateTime: -1 } })
		.populate(arrPopulation)
		.exec((err, documents) => {
			/* errors check */
			const theError = checkDocumentsDatas(err, documents, here);
			if (theError) {
				const success = false;
				const data = theError.toString();
				const response = { success, data };

				console.info(response);
				return res.json(response);
			} else if (documents.length < 1) {
				const success = false;
				const data = 'no document found';
				const response = { success, data };

				console.info(response);
				return res.json(response);
				/* end errors check */
			} else {
				const data = documents.filter((documents) => {
					return !documents.isDeleted;
				});

				// console.log(
				// 	`${here}'s document${
				// 		documents.length > 1 ? 's' : ''
				// 	}: available = ${data.length}, deleted = ${
				// 		documents.length - data.length
				// 	}, total = ${documents.length}`
				// );

				const success = true;
				const response = { success, data };

				console.info(response);
				return res.json(response);
			}
		});
};

module.exports = getAllDocuments;
