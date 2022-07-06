const checkDocumentsDatas = require('../utils/checkDocumentsDatas');
const dbLog = require('./core/dbLog');
const configInfo = require('../config/config.json');

/**
 * Delete a document from the database
 * @param { function } Model            to use for deletion
 * @param { string } here               microservice name
 * @param { object } req                origine request
 * @param { object } res                response to send
 */
const destroyDocument = (Model, here, req, res) => {
	console.log(`#destryDocument /${here}`);

	if (!configInfo.destroyDocumentAllowed) {
		res.status(404).send(
			`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Cannot ${req.method} ${req.originalUrl}</pre></body></html>`
		);

		return;
	} else {
		const _id = req.params.id;

		/* Log elements */
		const user = 'developper';
		const request = JSON.stringify({
			originalUrl: req.originalUrl,
			params: req.params,
			body: req.body,
		});
		let logDatas = {
			collectionName: here.toString(),
			documentId: _id.toString(),
			method: `${req.method.toString()}`,
			request: request,
			success: null,
			document: null,
			documentBefore: null,
			user: user.toString(),
			error: null,
		};

		Model.findById({ _id }, (err, document) => {
			/* errors check */
			isDeletedIgnore = true;

			const theError = checkDocumentsDatas(
				err,
				document,
				here,
				_id,
				isDeletedIgnore
			);
			if (theError) {
				const success = false;
				const response = { success, data: theError.toString() };

				/* record log */
				logDatas.success = success.toString();
				logDatas.document = document ? document.toString() : null;
				dbLog(logDatas);
				/* end record log */

				res.json(response);
				return response;
			}

			logDatas.documentBefore = document.toString();

			Model.deleteOne({ _id }, (err, data) => {
				console.log(
					`----------------------- destroy ${_id} in ${here}`
				);
				/* errors check */
				const theError = checkDocumentsDatas(
					err,
					document,
					here,
					_id,
					isDeletedIgnore
				);
				if (theError) {
					console.log('----------------------- destroy data err');

					/* record log */
					logDatas.success = success;
					logDatas.error = theError.toString();
					dbLog(logDatas);
					/* end record log */

					const success = false;
					const data = theError.toString();
					const response = { success, data };

					res.json(response);
					return response;
				}
				/* end errors check */

				let success = true;

				console.log(
					`----------------------- ${_id} in ${here} destroyed`
				);

				/* record log */
				Model.findById({ _id }, (err, document) => {
					if (err) {
						logDatas.error = err.toString();
					}

					logDatas.success = success.toString();
					logDatas.document = document ? document.toString() : null;
					dbLog(logDatas);
				});
				/* end record log */

				success = true;
				const response = { success, data: { isDeleted: true } };

				res.json(response);
				return response;
			});
		});
	}
};

module.exports = destroyDocument;
