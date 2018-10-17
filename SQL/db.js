const spicedPg = require("spiced-pg");
// const db = spicedPg(process.env.DATABASE_URL || secrets.dbUrl);

let dbUrl;

if (process.env.DATABASE_URL) {
    dbUrl = process.env.DATABASE_URL;
} else {
    let secret = require("../secrets.json")
    dbUrl = secret.dbUrl
}

let db = spicedPg(dbUrl);

exports.saveSignature = (signature, user_id) => {
    const q =
            `
            INSERT INTO signatures (signature, user_id)
            VALUES ($1, $2)
            RETURNING id, user_id
            `;
    return db.query(q, [signature || null, user_id]);
};

exports.getSignatureById = user_id => {
    const q =
            `
            SELECT signature
            FROM signatures
            WHERE user_id = ($1)
            `;
    return db.query(q, [user_id]);
};

exports.registration = (first, last, email, password) => {
    const q =
            `
            INSERT INTO users (first, last, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING first, last, id
            `;
    return db.query(q, [
        first || null,
        last || null,
        email || null,
        password || null
    ]);
};

exports.signerInfo = () => {
    return db.query(
            `
            SELECT users.first, users.last, userProfile.age, userProfile.city, userProfile.homepage
            FROM users
            LEFT JOIN userProfile
            ON users.id = userProfile.user_id
            `
        );
};

exports.getCity = city => {
    const q = `
            SELECT users.first, users.last, userProfile.age, userProfile.city, userProfile.homepage
            FROM users
            JOIN userProfile
            ON users.id = userProfile.user_id
            WHERE city = ($1)
            `;
    return db.query(q, [city]);
};

exports.returnPass = email => {
    const q = `
            SELECT password, first, last, id
            FROM users
            WHERE email = ($1);
            `;
    return db.query(q, [email]);
};

exports.saveProfile = (user_id, age, city, homepage) => {
    const q =
            `
            INSERT INTO userProfile (user_id, age, city, homepage)
            VALUES ($1, $2, $3, $4);
            `
    return db.query(q, [user_id, age || null, city || null, homepage || null]);
};

exports.editProfile = user_id => {
    const q =
            `
            SELECT users.first, users.last, users.email, userProfile.age, userProfile.city, userProfile.homepage
            FROM users
            JOIN userProfile
            ON users.id = userProfile.user_id
            WHERE users.id = ($1);
            `;
    return db.query(q, [user_id]);
};

exports.updateUsersTableWithoutPW = (first, last, email, userID) => {
    const q =
            `
            UPDATE users
            SET first = $1, last = $2, email = $3
            WHERE id = $4;
            `;
    return db.query(q, [first, last, email, userID]);
};

exports.updateUsersTable = (first, last, email, password, userID) => {
    const q =
            `
            UPDATE users
            SET first = $1, last = $2, email = $3, password = $4
            WHERE id = $5;
            `;
    return db.query(q, [first, last, email, password, userID]);
};

exports.updateUserProfileTable = (age, city, homepage, userID) => {
    console.log("heyhey");
    const q =
            `
            INSERT INTO userProfile (age, city, homepage, user_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id)
            DO UPDATE SET age = $1, city = $2, homepage = $3;
            `;
    return db.query(q, [age || null, city || null, homepage || null, userID]);
};

exports.deleteSignature = (user_id) => {
    const q =
            `
            DELETE FROM signatures
            WHERE user_id = ($1)
            `;
    return db.query(q, [user_id]);
};
