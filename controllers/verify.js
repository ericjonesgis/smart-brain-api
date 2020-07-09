const recieveVerify = (req, res, db) => {
    console.log(req.protocol+":/"+req.get('host'));
    db.select('email', 'token').from('verification')
                    .where('token', '=', req.query.id)
                    .then(data => {
                        const tok = data[0].token
                        const email = data[0].email
                        if((req.protocol+"://"+req.get('host'))==("http://"+host)) {
                            console.log("Domain is matched. Information is from Authentic email");
                            if(req.query.id==tok)
                            {
                                console.log("email is verified");
                                db.transaction(trx => {
                                trx.update({
                                    emailverify: 'true'
                                })
                                .where('email', '=', email)
                                .into('users')
                                .then(trx.commit)
                                .catch(trx.rollback)
                            })
                                res.end("<h1>Email "+mailOptions.to+" has been Successfully verified, you will now be able to sign in");
                            }
                            else
                            {
                                console.log("email is not verified");
                                res.end("<h1>Bad Request</h1>");
                            }
                        }
                        else
                        {
                            res.end("<h1>Request is from unknown source");
                        }
                        })
                        };
module.exports = {
    recieveVerify: recieveVerify
}