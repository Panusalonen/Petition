const express = require("express");
const app = express();
const fs = require("fs");

const bp = require("body-parser");
const ca = require("chalk-animation");
const db = require("./SQL/db.js");

const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { hashPass, checkPass } = require("./public/hashing.js");

const csurf = require("csurf");
const { promisify } = require("util");

let secret;
if (process.env.secret) {
    secret = process.env.secret;
} else {
    secret = require("./secrets.json").secret;
}

app.set("view engine", "handlebars");

app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);

//////// MIDDLEWARE ////////

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    cookieSession({
        secret: secret,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

//////// CHECK SIGNATURE & LOGIN ////////

function checkIfSign(req, res, next) {
    if (!req.session.user.signID && req.url != "/petition") {
        res.redirect("/petition");
    } else {
        next();
    }
}

function checkIfLogged(req, res, next) {
    if (!req.session.user) {
        res.redirect("/register");
    } else {
        next();
    }
}

//////// GET & POST FOR REGISTERING THE USER ////////

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    // console.log("req.session: ", req.session);
    hashPass(req.body.password)
        .then(hashed => {
            db.registration(
                req.body.first,
                req.body.last,
                req.body.email,
                hashed
            ).then(result => {
                // console.log("result: ", result);
                req.session = {
                    user: {
                        firstName: result.rows[0].first,
                        lastName: result.rows[0].last,
                        userID: result.rows[0].id
                    }
                };
                res.redirect("/profile");
            });
        })
        .catch(err => {
            // console.log(err);
            res.render("register", {
                error: true
            });
        });
});

//////// LOGIN, LOGOUT, & HOME GET/POST ROUTES ////////

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/logout", (req, res) => {
    // req.session.destroy
    req.session = null;
    res.redirect("/register");
    console.log("LOGOUT clicked");
});

app.post("/login", (req, res) => {
    db.returnPass(req.body.email).then(result => {
        req.session = {
            user: {
                firstName: result.rows[0].first,
                lastName: result.rows[0].last,
                userID: result.rows[0].id,
                signID: result.rows[0].id
            }
        };
        let savedPass = result.rows[0].password;
        checkPass(req.body.password, savedPass)
            .then(result => {
                if (result) {
                    res.redirect("/petition");
                    // console.log("yey");
                } else {
                    throw new Error();
                    // window.alert("Wrong Password");
                }
            })
            .catch(err => {
                res.render("login", {
                    error: true
                });
                // console.log("error has occured in login: ", err);
            });
    });
});

//////// GET & POST FOR REG.PROFILE & PROFILE EDIT -PAGE ////////

app.get("/profile", (req, res) => {
    res.render("profile", {
        first: req.session.user.firstName,
        last: req.session.user.lastName
    });
});

app.get("/profile/edit", checkIfLogged, (req, res) => {
    let editProfile = req.session.user.userID;
    db.editProfile(editProfile).then(names => {
        res.render("edit", {
            first: req.session.user.firstName,
            last: req.session.user.lastName,
            userInfo: names.rows[0]
        });
    });
});

app.post("/profile", (req, res) => {
    let url = req.body.homepage;
    if (!req.body.age && !req.body.city && !req.body.homepage) {
        res.redirect("/petition");
        return;
    }
    if (req.body.homepage) {
        if (!url.startsWith("https://")) {
            url = "https://" + url;
        }
    }
    // console.log("req.session: ", req.session);
    db.saveProfile(req.session.user.userID, req.body.age, req.body.city, url)
        .then(result => {
            res.redirect("/petition");
        })
        .catch(err => {
            // console.log("hey");
            res.render("sign", {
                error: true
            });
        });
});

app.post("/profile/edit", (req, res) => {
    if (req.body.password != "") {
        hashPass(req.body.password).then(hashed => {
            // console.log("body: ", req.body);
            db.updateUsersTable(
                req.body.first,
                req.body.last,
                req.body.email,
                hashed,
                req.session.user.userID
            )
                .then(result => {
                    res.redirect("/petition");
                })
                .catch(err => {
                    res.render("home", {
                        error: true
                    });
                });
        });
    } else {
        db.updateUsersTableWithoutPW(
            req.body.first,
            req.body.last,
            req.body.email,
            req.session.user.userID
        ).catch(err => {
            // console.log("error: ", err);
            res.render("profile/edit", {
                error: true
            });
            // console.log("check: ", req.body, typeof req.session.user.userID);
        });
    }
    db.updateUserProfileTable(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.user.userID
    )
        .then(result => {
            res.redirect("/petition");
        })
        .catch(err => {
            // console.log("error: ", err);
            res.render("home", {
                error: true
            });
        });
});

//////// GET & POST FOR SINGNERS -PAGE ////////

app.get("/signers", checkIfLogged, (req, res) => {
    db.signerInfo().then(names => {
        res.render("signers", {
            signers: names.rows,
            count: names.rowCount,
            age: names.age,
            city: names.city,
            first: req.session.user.firstName,
            last: req.session.user.lastName
        });
    });
});

app.get("/signers/:city", checkIfLogged, (req, res) => {
    let cityName = req.params.city;

    db.getCity(cityName).then(names => {
        res.render("signers", {
            signers: names.rows,
            count: names.rowCount,
            age: names.age,
            city: names.city,
            homepage: names.homepage,
            first: req.session.user.firstName,
            last: req.session.user.lastName
        });
    });
});

//////// GET & POST FOR PETITION (SIGNATURE) -PAGE ////////

app.get("/petition", (req, res) => {
    res.render("sign", {
        first: req.session.user.firstName,
        last: req.session.user.lastName
    });
});

app.post("/petition", (req, res) => {
    console.log("req.body.sign, req.session: ", req.body.sign, req.session);
    db.saveSignature(req.body.sign, req.session.user.userID)
        .then(result => {
            req.session.user.signID = result.rows[0].user_id;
            res.redirect("/thanks");
        })
        .catch(err => {
            console.log("hey");
            res.render("sign", {
                error: true
            });
        });
});

//////// GET & POST FOR THE THANKYOU -PAGE, DELETE THE SIGNATURE ////////

app.get("/thanks", checkIfLogged, (req, res) => {
    db.getSignatureById(req.session.user.signID)
        .then(result => {
            res.render("thanks", {
                first: req.session.user.firstName,
                last: req.session.user.lastName,
                signature: result.rows[0].signature
            });
        })
        .catch(err => {
            console.log(err);
            res.render("home", {
                error: true
            });
        });
});

app.post("/thanks", (req, res) => {
    console.log(req.session.user.signID);
    db.deleteSignature(req.session.user.userID)
        .then(result => {
            delete req.session.user.signID;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
            res.render("home", {
                error: true
            });
        });
});

//////// PORT ////////

app.listen(process.env.PORT || 8080, () =>
    ca.rainbow("I am listening, Master")
);
