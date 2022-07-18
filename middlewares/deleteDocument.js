const checkDocumentsDatas = require('../utils/checkDocumentsDatas');
const dbLog = require('./core/dbLog');

/**
 * Changes isDeleted value to true
 * @param { function } Model          to use for isDeleted update
 * @param { string } here             microservice name
 * @param { object } req              origine request
 * @param { object } res              response to send
 */
const deleteDocument = (Model, here, req, res) => {
	console.log('DELETE params');
	const _id = req.params.id;
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
		method: `${req.method.toString()}_PUT`,
		request: request,
		success: null,
		document: null,
		documentBefore: null,
		user: user.toString(),
		error: null,
	};
	/* end of collecting elements for logs */

	Model.findById({ _id }, (err, document) => {
		if (document) {
			document.toString();
		}
		console.log(
			'#deleteDocumentByUpdate logDatas.document',
			logDatas.document
		);
		console.log('#deleteDocumentByUpdate document', document);
		/* Errors check */
		const theError = checkDocumentsDatas(err, document, here, _id);
		if (theError) {
			const success = false;
			const data = theError.toString();
			const response = { success, data };

			/* record log */
			logDatas.success = success.toString();
			logDatas.error = theError.toString();
			dbLog(logDatas);
			/* end record log */

			console.info(response);
			res.json(response);
			return response;
		}
		/* end errors check */

		logDatas.documentBefore = document.toString();

		Model.updateOne(
			{ _id },
			{ $set: { isDeleted: true } },
			(err, document) => {
				/* errors check */
				const theError = checkDocumentsDatas(err, document, here, _id);

				if (theError) {
					const success = false;
					const data = theError.toString();
					const response = { success, data };
					/* record log */
					logDatas.success = success;
					logDatas.error = theError.toString();
					dbLog(logDatas);
					/* end record log */

					console.info(response);
					res.json(response);
					return response;
				}
				/* end errors check */

				const success = true;
				const data = { isDeleted: true };
				const response = { success, data };

				/* record log */
				Model.findById({ _id }, (err, documentDeleted) => {
					logDatas.success = success.toString();
					logDatas.document = documentDeleted.toString();
					dbLog(logDatas);
				});
				/* end record log */

				console.info(response);
				res.json(response);
				return response;
			}
		);
	});
};

module.exports = deleteDocument;
