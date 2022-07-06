module.exports = (path, func, variable) => {
	console.log(
		`${path && path + ' '}${func && '#' + func + ' '}${
			variable && Object.keys(variable)[0] + ' --> ' + variable
		}`
	);
};
