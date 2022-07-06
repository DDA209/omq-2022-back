// const util = require('util');

// const createPopulationTree = (Model) => {
// 	// console.log('controllers/core #createPopulationTree');
// 	// console.log('createPopulationTree Model >>>', Model);
// 	const schema = Model.schema.obj;
// 	let tree = [];
// 	// console.log('createPopulationTree Schema >>>', schema ?? 'Not a Schema');
// 	if (!!schema) {
// 		for (property in schema) {
// 			let elements = { path: property };
// 			if (Array.isArray(schema[property])) {
// 				if (schema[property][0].ref) {
// 					const subModel = Model.db.models[schema[property][0].ref];
// 					subResult = createPopulationTree(subModel);
// 					// console.log(
// 					// 	'createPopulationTree subResult >>>',
// 					// 	subResult
// 					// );

// 					if (subResult.length === 1) {
// 						elements = { ...elements, populate: subResult[0] };
// 					} else if (subResult.length > 1) {
// 						elements = { ...elements, populate: subResult };
// 					} else {
// 					}
// 					// console.log('createPopulationTree elements >>>', elements);

// 					tree.push(elements);
// 				}
// 			} else if (schema[property].ref) {
// 				const subModel = Model.db.models[schema[property].ref];
// 				subResult = createPopulationTree(subModel);
// 				// console.log('createPopulationTree subResult >>>', subResult);

// 				if (subResult.length === 1) {
// 					elements = { ...elements, populate: subResult[0] };
// 				} else if (subResult.length > 1) {
// 					elements = { ...elements, populate: subResult };
// 				} else {
// 				}
// 				// console.log('createPopulationTree elements >>>', elements);

// 				tree.push(elements);
// 			}
// 		}
// 	}
// 	// tree = [
// 	// 	{
// 	// 		path: 'platform',
// 	// 	},
// 	// 	{
// 	// 		path: 'tokens',
// 	// 		populate: [
// 	// 			{
// 	// 				path: 'token',
// 	// 			},
// 	// 		],
// 	// 	},
// 	// ];
// 	// console.log(util.inspect(tree, false, Infinity, true));
// 	// return tree;
// };

// module.exports = createPopulationTree;

const createPopulationTree = (Model) => {
	const schema = Model.schema.obj;
	let tree = [];
	if (!!schema) {
		for (property in schema) {
			let elements = { path: property };
			if (Array.isArray(schema[property])) {
				if (schema[property][0].ref) {
					const subModel = Model.db.models[schema[property][0].ref];
					subResult = createPopulationTree(subModel);
					if (subResult.length === 1) {
						elements = { ...elements, populate: subResult[0] };
					} else if (subResult.length > 1) {
						elements = { ...elements, populate: subResult };
					} else {
					}
					tree.push(elements);
				} else {
					console.log('createPopulationTree is Schema  >>>', )
				}
			} else if (schema[property].ref) {
				const subModel = Model.db.models[schema[property].ref];
				subResult = createPopulationTree(subModel);
				if (subResult.length === 1) {
					elements = { ...elements, populate: subResult[0] };
				} else if (subResult.length > 1) {
					elements = { ...elements, populate: subResult };
				} else {
				}
				tree.push(elements);
			}
		}
	} else {
					console.log('createPopulationTree Not a Schema', Model);
	}
	return tree;
};

module.exports = createPopulationTree;
