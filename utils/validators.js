module.exports = {
	forSchemas: [
		{
			greaterThanZero: (quantity) => {
				return quantity > 0;
			},
		},
	],
};
