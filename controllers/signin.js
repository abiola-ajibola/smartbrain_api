const handleSignin = (request, response, knex, bcrypt, validatePW, validateEm) => {
    const { email, password } = request.body;
    console.log('Email', email, validateEm(email));
    console.log('Password', password, validatePW(password));
    if ((validateEm(email) && validatePW(password))) {
        console.log('mail', validateEm(email))
        console.log('pw', validatePW(password))
        return response.status(400).json('Not allowed')
    } else {
        knex('login').where({
            email: email
        }).select('email', 'hash')
            .then(data => {
                // console.log(data[0])
                bcrypt.compare(password, data[0].hash, function (err, res) {
                    if (res) {
                        return knex('users').where('email', email)
                            .then(user => {
                                // console.log(user[0])
                                response.json(Object.assign({}, user[0], { comment: "good request" }))
                            })
                            .catch((e) => console.error('inside bcrypt e:', e))
                    } else {
                        response.status(400).json('Passed1: Incorrect credentials')
                    }
                })
            })
            .catch(() => response.status(400).json('Passed2: Incorrect credentials'))
    }
}

module.exports = {
    handleSignin: handleSignin
}