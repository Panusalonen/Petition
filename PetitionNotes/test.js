const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets')
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);


changeCuteness(id, name) => {
db.query(
    'SELECT * FROM animals WHERE cuteness > 1'
).then(({rows}) => {
    console.log(rows);
}).catch(err => {
    console.log(err);
});
};


changeCuteness(id, name) => {
db.query(
    `UPDATE animals SET cuteness = $2
    WHERE id = $1`,
    [
        id,
        name
    ]
).then(({rows}) => {
    console.log(rows);
}).catch(err => {
    console.log(err);
});
};

changeCuteness(1, 5)
