const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'f78712ca6c684e0a998b98a1eb7054c9'
});

const handleAPICall = (req, res) => {
    app.models.predict('a403429f2ddf4b49b307e318f00e528b',
        req.body.imgUrl)
        .then(response => res.json(response))
        .catch(console.log)
}

const handleImage = (req, res, knex) => {
    const { id, imgUrl } = req.body
    knex('users')
        .returning('*')
        .where('id', '=', id)
        .increment('pictures', 1)
        .then(response => {
            res.json(response)
        })
        .catch(e => res.status(400).json('no pictures'));
}

module.exports = {
    handleImage,
    handleAPICall
}
