/**
 * Return error if finded
 * @param { object } err 				error from mongoose API
 * @param { object } document 			document to test
 * @param { string } here 				only used for console.log
 * @param { objectId } _id 				id to GET
 * @param { boolean } isDeletedIgnore	for testing or not as deleted document
 */
const checkDocumentsDatas = (err, document, here, _id, isDeletedIgnore) => {
	_id ? (id = _id) : (id = 'none');

	// console.log('utils/checkDocumentsDatas #checkDocumentsDatas');
	if (!document && !err) {
		return `The document with ObjectId "${id}" at path "_id" for model "${here}" doesn't exists`;
	} else if (err) {
		return err;
	} else if (document.isDeleted && !isDeletedIgnore) {
		return `The document with ObjectId "${id}" at path "_id" for model "${here}" has been deleted.`;
	}
};

module.exports = checkDocumentsDatas;
