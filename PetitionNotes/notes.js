req.body {
    email,
    pw
}

1. query the DB for the stored hashed pw
2. compare the plaintextpw to the hashed pw
3. if it does NOT match, render and Error
4. if it DOES match, set the session with the user info
(dont forget to check if the user has signed the petition,
if they have, you need to set that in the session too)
5. redirect to the next appropriate route


- - - - - - - - - - -

To update the profile:

2 db.queries --> one for users, one for userProfile

userProfile
INSERT INTO userProfile (first, last, email, password, age, city, homepage)
VALUES ()
ON CONFLICT () --> unique
DO UPDATE SET;

users
UPDATE ?

GET for getting the values from the tables
POST to update the infos to new ones

PW:

Did user enter the PW? (is PW != ""?)
YES --> HASH new password --> update user info WITH HASH
NO --> update user info without NEW PW


The value of the conflict(field) should be unique.
Delete the signID on deleting the session cookie.

- - - - - - - - - - - - - -

app.post('/test', (req, res) => {
    console.log('Running POST / test', req.body);


getAllPokemon() => {
    const q = "SELECT * FROM pokemon";

            db.query(q)
    .then(results => results.rows) // --> returns results.rows
    .catch(err => {
        console.log('Error in fetching balabala: ', err);
    })
}

getSinglePokemon(pokemonId) => {

    const q = "SELECT * FROM pokemon WHERE id = $1";
    const params = [pokemonId];

    return dv.query(q, params)
        .then(results => {
            return results.rows[0]
        })
}

getSinglePokemonId(pokemonId) => {

    const q = "SELECT * FROM pokemon WHERE id = $1";
    const params = [pokemonId];

    return dv.query(q, params)
        .then(results => results.rows[0].id) // --> returns Id
}

- - - - - - - - - - - - -

const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(`{$__dirname}`.)
})



app.listen(process.env.PORT || 8080);

- - - - - - - - - - - - - -

const session = require('express-session'),
const Store = require('connect-redis')(session);

app.use(session({
    store: new Store({
        ttl: 3600,
        host: 'localhost',
        port: 6379
    }),
    resave: false,
    saveUninitialized: true,
    secret: secret
}));

////////

app.get('/', function(req, res, next) {
    if (!req.session.user) {
        return res.sendStatus(403);
    }
    if (!req.session.user._) {
        req.session.user._ = [];
    }
    res.render('register', {
        _: req.session.user._
    });
});
