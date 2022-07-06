/**
 * returns
 * @param { function } Model
 * @param { object } document
 */
const findModelsAndIds = (Model, document) => {
	const objModel = Model.schema.obj;
	// console.log('controllers/core #findModelsAndIds objModel', objModel);
	let modelsAndIds = [];

	for (let field in document) {
		// console.log(
		// 	'controllers/core #findModelsAndIds objModel[field]',
		// 	field,
		// 	'--->',
		// 	objModel[field],
		// 	'-----',
		// 	typeof objModel[field]
		// );

		if (objModel[field] === undefined) {
			modelsAndIds = []; // if fieds doesn't exists in model return a array with length = 0
		} else {
			let ref =
				objModel[field].ref !== undefined ? objModel[field].ref : false;

			if (Array.isArray(document[field])) {
				ref =
					objModel[field][0].ref !== undefined
						? objModel[field][0].ref
						: false;
			}

			if (ref) {
				const model = Model.db.models[ref]; //fn model
				const id = document[field]; // id
				const here = ref; // collection

				modelsAndIds.push({
					model,
					id,
					here,
				});
			}
		}
	}
	return modelsAndIds;
};

module.exports = findModelsAndIds;
