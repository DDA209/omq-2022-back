const bcrypt = require('bcrypt');

const {
	passwordLength,
	emailRegex,
	passwordAttemptLimit,
} = require('../../config/parameters');
const authentication = (router, here, Model) => {
	router.post(`/${here}/subscribe`, (req, res) => {
		let errors = [];
		console.log('POST /subscribe req.body:', req.body);
		let success = false;

		const email =
			req.body.email !== undefined
				? req.body.email.toLowerCase()
				: undefined;
		const emailConfirmation =
			req.body.emailConfirmation !== undefined
				? req.body.emailConfirmation.toLowerCase()
				: undefined;
		const { password, passwordConfirmation } = req.body;

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
			if (emailConfirmation && email !== emailConfirmation) {
				const newError = `Emails aren't the same.`;
				errors.push(newError);
			}
		}
		if (!emailConfirmation) {
			const newError = `Please confirm your email`;
			errors.push(newError);
		}
		// end email verifications

		// password verifications
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

		// send errors
		// end send errors

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
				const newError = 'Email already exists';
				errors.unshift(newError);
				const data = errors;
				const response = { success, data };
				res.json(response);
				return;
			}
			if (errors.length > 0) {
				success = false;
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
	router.post(`/${here}/login`, (req, res) => {
		let errors = [];
		console.log('POST auth/login', req.body);
		let success = false;
		const { email, password } = req.body;

		Model.findOne({ email }).exec((err, user) => {
			if (err) {
				const newError = err.toString();
				errors.push(newError);
				const data = errors;
				const response = { success, data };
				res.json(response);
				return;
			}
			if (
				!user ||
				user === '' ||
				(!user?.isActive && user?.emailValidated)
			) {
				const newError = `User not found or inactive account.`;
				errors.push(newError);
				const data = errors;
				const response = { success, data };
				res.json(response);
				return;
			}
			const dbHashedPassword = user.password.hash;
			bcrypt.compare(password, dbHashedPassword, (err, testResult) => {
				if (err) {
					const newError = err.toString();
					errors.push(newError);
					const data = errors;
					const response = { success, data };
					res.json(response);
					return;
				} else if (testResult === true) {
					/* login processus */
					const { _id, email, emailValidated, isAdmin } = user;
					Model.findOneAndUpdate(
						{ email },
						{ $set: { passwordAttempt: 0 } }
					).exec();
					let datas = {
						email,
						emailValidated,
						isAdmin,
					};
					/* send users datas */
					const success = true;
					data = { ...datas }; // send datas
					const response = { success, data };
					res.json(response);
					return;
				} else {
					Model.findOne({ email }).exec((err, user) => {
						error = 'User or password error';
						const { passwordAttempt } = user;
						if (passwordAttempt >= passwordAttemptLimit) {
							error =
								'User account is inactive, please contact support';
						}
						if (err) {
							const newError = err.toString();
							errors.push(newError);
							const data = errors;
							const response = { success, data };
							res.json(response);
						} else {
							const datas = {
								passwordAttempt: passwordAttempt + 1,
							};
							'POST auth/login wrong password passwordAttempt',
								passwordAttempt;
							passwordAttempt === passwordAttemptLimit - 1 &&
								(datas.isActive = false);
							Model.findOneAndUpdate({ email }, { $set: datas })
								.exec()
								.then(() => {
									errors.push(error);
									const data = errors;
									const response = { success, data };
									res.json(response);
									return;
								});
						}
					});
				}
			});
		});
	});
};
module.exports = authentication;
