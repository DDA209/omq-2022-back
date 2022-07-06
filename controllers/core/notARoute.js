const express = require('express');
const router = express.Router();

const dbLog = require('../../middlewares/core/dbLog');

const responseAndLog = (req, res) => {
	console.log('req.originalUrl:', req.originalUrl);
	const request = JSON.stringify({
		originalUrl: req.originalUrl,
		params: req.params,
		body: req.body,
	});
	const user = 'developper';
	const error = "the route doesn't exists";

	const logDatas = {
		collectionName: null,
		documentId: null,
		method: req.method.toString(),
		request: request,
		success: false,
		document: null,
		documentBefore: null,
		user: user.toString(),
		error: error.toString(),
	};

	dbLog(logDatas);

	console.log('the end');

	return res.send(
		`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Cannot ${req.method} ${req.originalUrl}</pre></body></html>`
	);
	/* json({
        success: false,
        message: error.toString()
    });*/
};

router.post('/*', (req, res) => {
	console.log('POST /*');
	responseAndLog(req, res, 'create');
});

router.get('/*', (req, res) => {
	console.log('GET /*');
	responseAndLog(req, res, 'read');
});

router.put('/*', (req, res) => {
	console.log('PUT /*');
	responseAndLog(req, res, 'update');
});

router.delete('/*', (req, res) => {
	console.log('DELETE /*');
	responseAndLog(req, res, 'isDeletedUpdate');
});

module.exports = router;
