const plurialize = require('pluralize');
const util = require('util');

const postDocument = require('../postDocument');
const getAllDocuments = require('../getAllDocuments');
const getDocumentById = require('../getDocumentById');
const getDocumentsByQuery = require('../getDocumentsByQuery');
const putDocument = require('../putDocument');
const deleteDocument = require('../deleteDocument');
const destroyDocument = require('../destroyDocument');
/**
 * Controllers for default routes
 * @param {function} router
 * @param {string} here
 * @param {function} Model
 */
const defaultControllers = (router, here, Model) => {
	router.post(`/${here}`, (req, res) => {
		console.log(`defaut controllers - POST /${plurialize(here)}/${here}`);
		postDocument(Model, here, req, res);
	});

	router.get(`/${here}/:id`, (req, res) => {
		console.log(
			`defaut controllers - GET /${plurialize(
				here
			)}/${here}/:id req.params.id: ${req.params.id}`
		);
		getDocumentById(Model, here, req, res);
	});

	router.get('/query', (req, res) => {
		const query = util.inspect(req.query, false, Infinity, true);
		console.log(
			`defaut controllers - GET /${plurialize(
				here
			)}/query?req.query: ${query}`
		);
		getDocumentsByQuery(Model, here, req, res);
	});

	router.get('/', (req, res) => {
		console.log(`defaut controllers - GET /${plurialize(here)}`);
		getAllDocuments(Model, here, res);
	});

	router.put(`/${here}/:id`, (req, res) => {
		console.log(
			`defaut controllers - PUT /${plurialize(
				here
			)}/${here}/:id req.params.id: ${req.params.id}`
		);
		putDocument(Model, here, req, res);
	});

	router.delete(`/${here}/:id`, (req, res) => {
		console.log(
			`defaut controllers - DELETE /${plurialize(
				here
			)}/${here}/:id req.params.id: ${req.params.id}`
		);
		deleteDocument(Model, here, req, res);
	});

	router.delete(`/destroy/${here}/:id`, (req, res) => {
		console.log(
			`defaut controllers - DELETE /${plurialize(
				here
			)}/${here}/:id req.params.id: ${req.params.id}`
		);
		destroyDocument(Model, here, req, res);
	});
};

module.exports = defaultControllers;
