const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '49bf42de6cd74a749700cf299c4f07b5'
});

const handleApiCall = (req, res, db) => {
	const { input } = req.body;
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		}).catch(err => res.status(400).json('unable to work with API'))

}

const handleImage = (req, res, db) => {
	const { id, input, email } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);	
	})
	.then(insert => {
			db.insert({
				imageurl: input,
				email: email
			})
			.into('images')
		    .then(trx.commit)
			.catch(trx.rollback)
		})
	})
	.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleImage,
	handleApiCall
}