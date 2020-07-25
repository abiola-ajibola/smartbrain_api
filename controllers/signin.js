const fetch = require('node-fetch');

const handleSignin = (request, response, knex, bcrypt, validatePW, validateEm) => {
    const { email, password, recaptcha } = request.body;
    console.log('Email', email, validateEm(email));
    console.log('Password', password, validatePW(password));
    console.log(recaptcha);

    ///////////////////////////////
    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6LdjSrIZAAAAAGbAFZOMiL_vZMoasCCBvJoN_HIq&response=${recaptcha}`,{
        method: 'POST'
    })
    .then(res => res.json())
    .then(resObj => console.log(resObj))
    .catch(console.log)
    ////////////////////////////

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
                                console.log(user[0])
                                console.log('found')
                                response.json(Object.assign({}, user[0], { comment: "good request" }))
                            })
                            .catch((e) => console.error('user not found', e))
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
