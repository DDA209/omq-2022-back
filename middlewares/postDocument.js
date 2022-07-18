const checkDocumentsDatas = require('../utils/checkDocumentsDatas');
const checkDependances = require('../utils/checkDependances');
const dbLog = require('./core/dbLog');

/**
 * Create a new document in database
 * @param { function } Model			to use for creation
 * @param { string } here				microservice name
 * @param { object } req				origin request
 * @param { object } res				response to send
 */
const postDocument = (Model, here, req, res) => {
	console.log(`#postDocument /${here}`);

	/**
	 * Saves the document if error(s) check pass
	 * Called by checkDependances function
	 * @param { string | object | undefined  } theError
	 */
	const saveDocument = (theError) => {
		if (theError) {
			const success = false;
			const data = theError.toString();
			const response = { success, data };

			/* record log */
			logDatas.success = success;
			logDatas.error = data;
			dbLog(logDatas);
			/* end record log */

			console.info(response);
			return res.json(response);
		} else {
			new Model(datas).save((err, document) => {
				/* errors check */
				theError = checkDocumentsDatas(err, document, here);

				if (theError) {
					const success = false;
					const data = theError.toString();
					const response = { success, data };

					/* record log */
					logDatas.success = success;
					logDatas.error = data;
					dbLog(logDatas);
					/* end record log */

					console.info(response);
					return res.json(response);
					/* end errors check */
				} else {
					const success = true;
					const data = document;
					const response = { success, data };

					/* record log */
					const _id = document._id;
					logDatas.documentId = _id.toString();
					logDatas.success = success;
					logDatas.document = document.toString();
					dbLog(logDatas);
					/* end record log */

					console.info(response);
					return res.json(response);
				}
			});
		}
	};

	const datas = req.body;
	console.log('DATAS:', datas);

	/* collecting elements for logs */
	const user = 'developper';
	const request = JSON.stringify({
		originalUrl: req.originalUrl,
		params: req.params,
		body: req.body,
	});
	let logDatas = {
		collectionName: here.toString(),
		documentId: null,
		method: req.method.toString(),
		request: request,
		success: null,
		document: null,
		documentBefore: 'notApplicable',
		user: user.toString(),
		error: null,
	};
	/* end of collecting elements for logs */

	if (Object.keys(datas).length <= 0 || !datas) {
		theError = 'No data to post';
		const success = false;
		const data = theError.toString();
		const response = { success, data };

		/* record log */
		logDatas.success = success;
		logDatas.error = data;
		dbLog(logDatas);
		/* end record log */

		console.info(response);
		return res.json(response);
	}

	checkDependances(Model, datas, saveDocument);
};

module.exports = postDocument;
