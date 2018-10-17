// IN EXPRESS session is located
// on req..... aka req.session

app.get('/thanks', (req, res) => {
    req.session = {
        signID: theIdOfTheSignature
    }
    req.session.signID
})

app.post('/create-user', (req, res) => {
    if (!req.session.signID){
        req.redirect('/thanks')
    }
})

let cookieSession = require('cookie-session');

app.use(cookieSession => ({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

`SELECT * FROM signatures WHERE id = $1`;

const q =
`
INSERT INTO signatures (name)
VALUES ('$1')
RETURNING *
`

const params = ['']

return db.query(q, params)
.then(results => {
    return results.rows[0].id
})

app.post('/thanks', (req, res) => {
    if (req.body.check){
        req.session.check = true;
    }
    res.redirect('/thanks');
})


// = to check if user signed petition
// if they have, proceed with whatever they were doing
// if not, redirect them elsewhere

app.use((req, res, next) => {
    if(!req.session.check){
        res.redirect('/petition');
    } else {
        next();
    }
});

checkForSign(req, res, next) => {
    if(!req.session.check){
        res.redirect('/petition');
    } else {
        next();
    }
}

- - - - - - - - -

const express = require('express')
const app = express();
const db = require('./db');
const secrets = require('secrets');
app.disable()


app.use((req, res) => {
    res.setHeader('x-frame-options', 'DENY');
    next();
})

app.get('/redirect', (req, res) => {
    if (req.query.url.startsWith('/')){
        req.redirect(req.query.url)
    }
})
