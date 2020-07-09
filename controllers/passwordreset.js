const validator = require('email-validator');


const handlePasswordReset = (req, res, db) => {
    console.log(req.protocol+":/"+req.get('host'));
    db.select('email', 'token', 'passchangehash').from('verification')
                    .where('token', '=', req.query.id)
                    .then(data => {
                        const tok = data[0].token;
                        const email = data[0].email;
                        const hash = data[0].passchangehash;
                    	if((req.protocol+"://"+req.get('host'))==("http://"+host)) {
                    		console.log("Domain is matched. Information is from Authentic email");
                    	}
                  
	                    	if (req.query.id==tok) {
	                    		db.transaction(trx => {
							        trx.update({
							            hash: hash
							        })
							        .where('email', '=', email)
							        .into('login')
							        .then(trx.commit)
									.catch(trx.rollback)
							        .then(reset => {
										db.transaction(trx => {
									        trx.update({
									            passwordreset: false,
									            passchangehash: null
									        })
									        .where('email', '=', email)
									        .into('verification')
									        .then(trx.commit)
									        .catch(trx.rollback)
									    })
	                    		res.send("<h1>Password has been successfully updated</h1>");
	                    	})
	                    })

                    }
                })

}


module.exports = {
	handlePasswordReset: handlePasswordReset
}