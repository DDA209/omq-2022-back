const checkDocumentsDatas = require('../utils/checkDocumentsDatas');
const createPopulationTree = require('../utils/createPopulationTree');
const util = require('util');
/**
 * Get a document from database with query information
 * @param { function } Model to use for finding
 * @param { string } here microservice name
 * @param { object } req origin request
 * @param { object } res response to send
 */
const getDocumentsByQuery = async (Model, here, req, res) => {
	// const _id = req.params.id
	console.log(`#getDocumentsByQuery /${here}/?query`);
	console.log('#getDocumentsByQuery user value = ', req.user);
	const skip = 0;
	const limit = false;
	const arrPopulation = createPopulationTree(Model);
	// console.log(
	// 	'#getDocumentsByQueries -- arrPopulation',
	// 	util.inspect(arrPopulation, false, Infinity, true)
	// );

	const query = { ...req.query };
	console.log('queries', query);
	Model.find(query, [], {
		skip,
		limit,
		sort: { creationDateTime: -1 },
	})
		.populate(arrPopulation)
		.exec((err, documents) => {
			/* errors check */
			const theError = checkDocumentsDatas(err, documents, here);
			let success = false;
			let data = 'a error occured on getting document with query';
			let response = { success, data };
			if (theError) {
				success = false;
				data = theError.toString();
				response = { success, data };

				console.info(response);
				return res.json(response);
			} else if (documents.length < 1) {
				success = false;
				data = 'no document found';
				response = { success, data };

				console.info(response);
				return res.json(response);
				/* end errors check */
			} else {
				success = true;
				data = documents;
				response = { success, data };

				console.info(response);
				return res.json(response);
			}
		});
};

module.exports = getDocumentsByQuery;
