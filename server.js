const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // this enables cross origin resource sharing
const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const validatePW = (pw) => {
    return (/[0-9]/.test(pw) && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\W/.test(pw))
};

const validateEm = (mail) => {
    if (mail.match(/@/g)) {
        return (!(mail.match(/@/g).length > 1) && /\./.test(mail))
    }
};

const validateName = (nm) => {
    return (!(/[\W0-9]/.test(nm)) && /[a-zA-Z]/.test(nm))
};

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.status(200).json('Welcome to the place!')});
app.post('/signin', (request, response) => {
    signin.handleSignin(request, response, knex, bcrypt, validateEm, validatePW)
});
app.post('/register', (req, res) => {
    register.handleRegister(req, res, knex, bcrypt, validateName, validatePW, validateEm)
});
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, knex)});
app.put('/image', (req, res) => {image.handleImage(req, res, knex)});
app.post('/imgApi', (req, res) => {image.handleAPICall(req,res)})

app.listen(process.env.PORT, () => {
    console.log(`API server listening on port: ${process.env.PORT}`);
});
