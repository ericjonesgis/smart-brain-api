const validator = require('email-validator');

const handleRegister = (req, res, db, bcrypt, smtpTransport) => {
	const { email, name, password } = req.body;
	const valid = validator.validate(email);
	console.log(valid);
	if (!email || !name || !password) {
		return res.status(400).json('Incorrect form submission.')
	}
	if (!valid) {
		return res.status(400).json('Not a valid e-mail address.')
	}

	// Create a verification token for this user
    const rand = Math.floor((Math.random() * 100) + 54);

	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
			    })
				.then(user => {
					res.json(user[0]);
				})
			})
			.then(verifytoken => {
				return trx('verification')
				.returning('*')
				.insert({
					token: rand,
					email: email
				})

			})
		    .then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => {
			res.status(400).json('Unable to register. Email may already be registered. Ensure you have verified your e-mail before signing in.')
		})

	}



module.exports = {
	handleRegister: handleRegister
}