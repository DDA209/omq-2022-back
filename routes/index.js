const pluralize = require('pluralize');

const routesCollections = ['ingredient', 'user', 'userIngredient'];

module.exports = (app, configInfo) => {
	routesCollections.map((collection) => {
		app.use(
			'/' + pluralize(collection),
			require('../controllers/' + collection + '.controller')
		);
	});
};
