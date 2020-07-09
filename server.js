const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');
const nodemailer = require('nodemailer');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const verify = require('./controllers/verify');
const send = require('./controllers/send');
const passwordreset = require('./controllers/passwordreset');



/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    port: 3000,
    auth: {
        user: "ericjones000000@gmail.com",
        pass: "kiwi5555"
    },
    tls: {
    	rejectUnauthorized: false
    }
    

});

 
/*------------------SMTP Over-----------------------------*/


const db = knex ({ 
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'postgres',
    database : 'smart-brain'
  }
});

const app = express();


app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=> {
	res.send('it is working!');
});



app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res, db) })
app.post('/passwordverify', (req, res) => { send.passwordVerify(req, res, db, bcrypt) })
app.post('/send', (req, res) => { send.sendVerify(req, res, db, smtpTransport) })
app.get('/verify', (req, res) => { verify.recieveVerify(req, res, db) })
app.post('/emailverifystart', (req, res) => { send.emailverifystart(req, res, db) })
app.get('/passwordreset', (req, res) => { passwordreset.handlePasswordReset(req, res, db) })




app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`)
})

