
const handleSignin = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission')
	}

	db.select('emailverify').from('users')
		.where('email', '=', email)
		.then(verify => {
			if (verify.length < 1) {
				return res.status(400).json('Unable to find user. Ensure email and password are correct.')
			}
			const verified = verify[0].emailverify;
			if (verified) {
				db.select('email', 'hash').from('login')
					.where('email', '=', email)
					.then(data => {
						const isValid = bcrypt.compareSync(password, data[0].hash);
						if (isValid) {
							return db.select('*').from('users')
							.where('email', '=', email)
							.then(user => {
								res.json(user[0])
							})
							.catch(err => res.status(400).json('Unable to retrieve user from database'))
						} else {
							res.status(400).json('Unable to find user. Ensure username and password are correct')
						}
					})		

					.catch(err => res.status(400).json('Unable to find user. Ensure username and password are correct'))
				} else {
					res.status(400).json('Please verify your account')
				}	
			})
	}

module.exports = {
			handleSignin: handleSignin
		}

