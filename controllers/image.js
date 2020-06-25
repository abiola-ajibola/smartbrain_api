const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.API_KEY
});

const handleAPICall = (req, res) => {
    app.models.predict('a403429f2ddf4b49b307e318f00e528b',
        req.body.imgUrl)
        .then(response => res.json(response))
        .catch(console.log)
}

const handleImage = (req, res, knex) => {
    const { id, imgUrl, numberOfFaces } = req.body
    console.log(`Faces present:  ${numberOfFaces} \nImage url : ${imgUrl}`);
    knex('users')
        .returning('*')
        .where('id', '=', id)
        .increment('pictures', numberOfFaces)
        .then(response => {
            res.json(response)
        })
        .catch(e => res.status(400).json('no pictures'));
}

module.exports = {
    handleImage,
    handleAPICall
}
