const checkDocumentsDatas = require('../utils/checkDocumentsDatas');
const createPopulationTree = require('../utils/createPopulationTree');
const util = require('util');

/**
 * Get a document from database for a defined id
 * @param { function } Model	to use for finding
 * @param { string } here				microservice name
 * @param { object } req				origin request
 * @param { object } res				response to send
 */
const getDocumentById = (Model, here, req, res) => {
	const _id = req.params.id;
	console.log(`#getDocumentById /${here}/${_id}`);
	console.log('#getDocumentById user value = ', req.user);
	console.log('#getDocumentById user value = ', req.params);
	const arrPopulation = createPopulationTree(Model);
	console.log(
		'#getDocumentById -- arrPopulation',
		util.inspect(arrPopulation, false, Infinity, true)
	);

	// const result =
	Model.findById({ _id })
		.populate(arrPopulation)
		.exec((err, document) => {
			/* errors check */
			const theError = checkDocumentsDatas(err, document, here, _id);

			if (theError) {
				const success = false;
				const data = theError.toString();

				response = { success, data };

				if (!res) {
					return response;
				} else {
					return res.json(response);
				}
			}
			/* end errors check */
			const success = true;
			const data = document;

			response = { success, data };
			return res.json(response);
		});
};

module.exports = getDocumentById;
