const checkDocumentsDatas = require('../utils/checkDocumentsDatas');
const checkDependances = require('../utils/checkDependances');
const dbLog = require('./core/dbLog');

/**
 * Update an existing document in database
 * @param { function } Model			Model name to use for update
 * @param { string } here				only used for console.log
 * @param { object } req				origine request
 * @param { object } res				response to send
 * @param { object } populationModels	Note used (mongoose.models for dependences check)
 */
const putDocument = (Model, here, req, res, populationModels) => {
	console.log(`#putDocument ${here}/id/:id`);

	const _id = req.params.id;
	const datas = { ...req.body, lastUpdateDateTime: Date.now() };
	console.log('putDocument.js req.body:', req.body, ', req.params.id;', _id);
	console.log('putDocument.js datas:', datas, ', req.params.id;', _id);
	/* collecting elements for logs */
	const user = 'developper';
	const request = JSON.stringify({
		originalUrl: req.originalUrl,
		params: req.params,
		body: req.body,
	});
	let logDatas = {
		collectionName: here.toString(),
		documentId: _id.toString(),
		method: req.method.toString(),
		request,
		success: null,
		document: null,
		documentBefore: null,
		user: user.toString(),
		error: null,
	};
	/* end collecting elements for logs */

	/**
	 * Check errors
	 * Update a document if errors check pass
	 * Called by checkDependances function
	 * @param { object | string | undefined } theError
	 */
	const updateDocument = (theError) => {
		if (theError) {
			const success = false;
			const data = theError.toString();
			const response = { success, data };

			/* record log */
			logDatas.success = success;
			logDatas.error = data;
			dbLog(logDatas);
			/* end record log */

			return res.json(response);
		} else {
			Model.updateOne({ _id }, { $set: datas }, (err, document) => {
				/* errors check */
				theError = checkDocumentsDatas(err, document, here, _id);
				console.log('putDocument.js DATAS', datas);
				if (theError) {
					const success = false;
					const data = theError.toString();
					const response = { success, data };

					/* record log */
					logDatas.success = success;
					logDatas.error = data;
					dbLog(logDatas);
					/* end record log */

					return res.json(response);

					/* end errors check */
				} else {
					const success = true;
					const data = document;
					const response = { success, data };

					/* record log */
					Model.findById({ _id }, (err, documentUpdated) => {
						logDatas.success = success;
						logDatas.document = documentUpdated.toString();
						dbLog(logDatas);
					});
					/* end record log */
					console.log('putDocument.js RESPONSE', response);
					return res.json(response);
				}
			});
		}
	};

	Model.findById({ _id }, (err, document) => {
		if (document) {
			logDatas.document = JSON.stringify(document);
		}

		/* errors check */
		const theError = checkDocumentsDatas(err, document, here, _id);

		if (theError) {
			const success = false;
			const data = theError.toString();
			const response = { success, data };

			/* record log */
			logDatas.success = success;
			logDatas.error = data;
			dbLog(logDatas);
			/* end record log */

			return res.json(response);
		}
		/* end errors check */

		logDatas.documentBefore = document.toString();

		/* errors check */
		checkDependances(Model, datas, updateDocument);
		/* end errors check */
	});
};

module.exports = putDocument;
