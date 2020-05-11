const handleRegister = (req, res, knex, bcrypt, validateName, validatePW, validateEm) => {
    const { name, email, password } = req.body;
    console.log('Name:',validateName(name));
    console.log('Email',validateEm(email));
    console.log('Password',validatePW(password));
    if (!(validateEm(email) && validatePW(password) && validateName(name))) {
        console.log(validateName(name))
        console.log(validateEm(email))
        console.log(validatePW(password))
        return response.status(400).json('Not allowed')
    } else {
        bcrypt.genSalt(12, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                knex.transaction(trx => {
                    return trx
                        .insert({
                            email: email,
                            hash: hash
                        }, 'email')
                        .into('login')
                        .then(loginEmail => {
                            return trx
                                .insert({
                                    email: loginEmail[0],
                                    name: name,
                                    joined: new Date()
                                }, '*')
                                .into('users')
                                .then(userDetails => res.json(userDetails[0]))
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                })
                    .catch((e) => {
                        res.status(400).json('Unable to register')
                        console.log(e);
                    })
            });
        });
    }
}

module.exports = {
    handleRegister: handleRegister
}
