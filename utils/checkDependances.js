const checkDocumentsDatas = require('./checkDocumentsDatas');
const findModelsAndIds = require('./findModelsAndIds');

/**
 * Find if field is an existing foreign document
 * @param { number } i
 * @param { * } modelsAndIdsToCheck
 * @param { function } functionToLaunch
 */
const finder = (i, modelsAndIdsToCheck, functionToLaunch) => {
	const { model: ModelToCheck, id: _id, here } = modelsAndIdsToCheck[i - 1];

	ModelToCheck.findById({ _id }, (err, ForeignDocument) => {
		/* errors check */
		const theError = checkDocumentsDatas(err, ForeignDocument, here, _id);
		/* end errors check */

		if (theError || i >= modelsAndIdsToCheck.length) {
			return functionToLaunch(theError);
		}
		finder(i + 1, modelsAndIdsToCheck, functionToLaunch);
	});
};

/**
 * check if foreign documents exists without error
 * @param { function } Model          	to use for update
 * @param { object } document 			document who have foreign dependences
 * @param { function } functionToLaunch function will lauch if no error occured
 * @return { object } theError
 */
const checkDependances = (Model, document, functionToLaunch) => {
	console.log('controllers/core #checkDependances');

	const modelsAndIdsToCheck = findModelsAndIds(Model, document);

	if (modelsAndIdsToCheck.length === 0) {
		const theError = false;
		return functionToLaunch(theError);
	} else {
		finder(1, modelsAndIdsToCheck, functionToLaunch);
	}
};

module.exports = checkDependances;
