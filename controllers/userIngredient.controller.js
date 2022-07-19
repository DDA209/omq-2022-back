const express = require('express');
const router = express.Router();

const here = 'userIngredient';
const Model = require(`../models/${here}.model`);

require('../middlewares/core/defaultMiddlewares')(router, here, Model);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/* specific controllers */
const plurialize = require('pluralize');
const User = require(`../models/user.model`);
const Ingredient = require(`../models/ingredient.model`);
const checkDocumentsDatas = require('../utils/checkDocumentsDatas');

router.get('/user', (req, res) => {
	console.log(`Specific controllers - GET /${plurialize(here)}/user`);
	console.log(
		'controllers/userIndredient #router GEt /user - req.body >>>',
		req.body
	);
	console.log(
		'controllers/userIndredient #router GEt /user - req.query >>>',
		req.query
	);
	const query = { ...req.query };

	skip = 0;
	limit = false;

	const { user } = req.query;
	Model.find(
		{ user },
		{
			skip,
			limit,
			// sort: { creationDateTime: -1 },
		}
	)
		.populate({ path: 'ingredient' })
		.exec((err, document) => {
			console.log('!!!!!!!!! document', document);
			theError = checkDocumentsDatas(err, document, here);
			if (theError) {
				const success = false;
				const data = theError.toString();
				const response = { success, data };
				if (!res) {
					return response;
				} else {
					console.info(response);
					return res.json(response);
				}
			}
			/* end errors check */
			const success = true;
			const data = document.map((userIngredient) => {
				console.log(userIngredient);
				const { _id, ingredient, quantity, user } = userIngredient;
				const { _id: userId } = user;
				const { _id: ingredientId, name: ingredientName } = ingredient;
				return {
					_id,
					ingredientId,
					ingredientName,
					quantity,
					userId,
				};
			});
			response = { success, data };

			console.info(response);
			return res.json(response);
		});
	// });
});
/* end specific controllers */

module.exports = router;
