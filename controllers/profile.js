const handleProfile = (req, res, knex) => {
    const { id } = req.params;
    knex('users').where('id', id)
        .then(data => {
            if (data.length) {
                res.json(data);
                console.log(data)
            } else {
                res.status(400).json('no such user');
            }
        })
        .catch(console.log);
}

module.exports = {
    handleProfile
}
