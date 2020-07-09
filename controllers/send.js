const validator = require('email-validator');

const passwordVerify = (req, res, db, bcrypt) => {
	const { email, password } = req.body
	const valid = validator.validate(email);
	const hash = bcrypt.hashSync(password);
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission.')
	}
	if (!valid) {
		return res.status(400).json('Not a valid e-mail address.')
	}
	db.transaction(trx => {
        trx.update({
            passwordreset: 'true',
            passchangehash: hash
        })
        .where('email', '=', email)
        .into('verification')
        .then(trx.commit)
        .catch(trx.rollback)
        .then(user => {
        	res.json('Password reset email has been sent. Please select the link contained in the email to reset your password.');
        })



	})
	.catch(err => {
			res.status(400).json('Unable to find email in the database. Please confirm the e-mail is correct')
		})
}

const emailverifystart = (req, res, db) => {
	const { email, id } = req.body
	db.transaction(trx => {
        trx.update({
            passwordreset: 'false'
        })
        .where('email', '=', email)
        .into('verification')
        .then(user => {
        	res.json(user[0]);
        })
        .then(trx.commit)
        .catch(trx.rollback)
        
	})

}

const sendVerify = (req, res, db, smtpTransport) => {
	const { email } = req.body
    db.select('email', 'token', 'passwordreset').from('verification')
				.where('email', '=', email)
				.then(data => {
					const tok = data[0].token;
					const sendto = data[0].email
					const passchange = data[0].passwordreset
					host=req.get('host');
					if (passchange) {
						link="http://"+req.get('host')+"/passwordreset?id="+tok;
						mailOptions={
						    to : sendto,
						    subject : "Password Reset",
						    html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to verify</a>"
						}
						console.log(mailOptions);
						smtpTransport.sendMail(mailOptions, function(error, response){
						 if(error){
						        console.log(error);
						    	res.end("error");
						 }else{
						        console.log("Message sent: " + response.message);
						     	res.end("sent");
						      }
						})

					} else {
						link="http://"+req.get('host')+"/verify?id="+tok;
						mailOptions={
						    to : sendto,
						    subject : "Please confirm your Email address",
						    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
						}
						smtpTransport.sendMail(mailOptions, function(error, response){
						 if(error){
						        console.log(error);
						    	res.end("error");
						 }else{
						        console.log("Message sent: " + response.message);
						     	res.end("sent");
						      }
							})
						}

				 	})
			
	}

module.exports = {
	sendVerify: sendVerify,
	passwordVerify: passwordVerify,
	emailverifystart: emailverifystart
}