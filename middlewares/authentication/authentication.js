const bcrypt = require('bcrypt');

let success = false;

const { passwordLength, emailRegex } = require('../../config/parameters');
const authentication = (router, here, Model) => {
	router.post(`/${here}/subscribe`, (req, res) => {
		console.log('POST /subscribe req.body:', req.body);
		let errors = [];
		const { password, passwordConfirmation } = req.body;

		const email =
			req.body.email !== undefined
				? req.body.email.toLowerCase()
				: undefined;
		const emailConfirmation =
			req.body.emailConfirmation !== undefined
				? req.body.emailConfirmation.toLowerCase()
				: undefined;

		/* inputs verification */
		// email verifications
		if (!email) {
			const newError = `Email is missing`;
			errors.push(newError);
		} else {
			if (!emailRegex.test(email)) {
				const newError = 'Incorrect email format';
				errors.push(newError);
			}
			if (email !== emailConfirmation) {
				const newError = `Emails aren't the same.`;
				errors.push(newError);
			}
		}
		if (!emailConfirmation) {
			const newError = `Please confirm your email`;
			errors.push(newError);
		}
		// end email verifications
		if (!password || !passwordConfirmation) {
			if (!password) {
				const newError = `Password is missing`;
				errors.push(newError);
			}
			if (!passwordConfirmation) {
				const newError = `Please confirm your password`;
				errors.push(newError);
			}
		} else {
			if (
				password.length < passwordLength.min ||
				password.length > passwordLength.max
			) {
				const newError = `Password lenght error, it must be between ${passwordLength.min} and ${passwordLength.max} characters.`;
				errors.push(newError);
			}
			if (password !== passwordConfirmation) {
				const newError = `Passwords aren't the same.`;
				errors.push(newError);
			}
		}
		// end password verifications
		/* end inputs verification */
		Model.findOne({ email }).exec((err, user) => {
			const saltRounds = 7;
			if (err) {
				const newError = err.toString();
				errors.push(newError);
				const data = errors;
				const response = { success, data };
				res.json(response);
				return;
			}
			if (user) {
				const newError = 'User name or email already exists';
				errors.push(newError);
				const data = errors;
				const response = { success, data };
				res.json(response);
				return;
			}
			bcrypt.genSalt(saltRounds, (err, salt) => {
				if (err) {
					const data = 'Password salting error';
					const response = { success, data };
					res.json(response);
					return;
				}
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) {
						const data = 'Password hashing error';
						const response = { success, data };
						res.json(response);
						return;
					}
					console.log('bcrypt hash salt: ', salt);
					const password = {
						salt,
						hash,
					};

					new Model({
						email,
						password,
					}).save((err, user) => {
						if (err) {
							const newError = err.toString();
							errors.push(newError);
							const data = errors;
							const response = { success, data };
							res.json(response);
							return;
						}

						success = true;
						const data = {
							id: user._id,
							email,
						};
						const response = { success, data };
						res.json(response);
					});
				});
			});
		});
	});
};
module.exports = authentication;
