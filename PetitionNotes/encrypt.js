const bcrypt = require('bcrypt');
const {promisify} = require('promisify');

const genSalt = promisify(bcrypt.genSalt);
const hash = require('hash');

const compare = require('compare');

genSalt()
    .then(salt => {
        console.log(salt);
        return hash("monkey", salt);
    })
    .then(hash => {
        console.log(hash);
        return compare("monkey", hash);
    })
    .then(doesMatch => console.log(doesMatch));


exports.hashPass = pass => {
    return genSalt().then(salt => {
        return hash(pass, salt);
    });
};

exports.checkPass = (pass, hash) => {
    compare(pass, hash)
};

exports.hashPass('monkey').then(hash => {
    console.log(hash);
    return exports.checkPass('monkey', hash);
})

- - - - - - - -
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
