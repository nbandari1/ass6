const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

dotenv.config();
const userService = require("./user-service.js");

const HTTP_PORT = process.env.PORT || 8080;
const connectionString = process.env.MONGO_URL;
const jwtSecret = process.env.JWT_SECRET;

// Configure passport
passport.use(new passportJWT.Strategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}, (jwtPayload, cb) => {
    // Check if the user exists in the database based on jwtPayload
    userService.getUserById(jwtPayload._id)
        .then(user => {
            if (user) {
                return cb(null, user);
            } else {
                return cb(null, false);
            }
        })
        .catch(err => {
            return cb(err, false);
        });
}));

// Use passport middleware
app.use(passport.initialize());

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.post("/api/user/register", (req, res) => {
    userService.registerUser(req.body)
        .then((msg) => {
            res.json({ "message": msg });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

app.post("/api/user/login", (req, res) => {
    userService.checkUser(req.body)
        .then((user) => {
            const payload = {
                _id: user._id,
                userName: user.userName
            };
            const token = jwt.sign(payload, jwtSecret);
            res.json({ message: "Login successful", token: token });
        }).catch(msg => {
            res.status(422).json({ "message": msg });
        });
});

// Protected routes
app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getFavourites(req.user._id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        });
});

app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addFavourite(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        });
});

app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.removeFavourite(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        });
});

app.get("/api/user/history", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getHistory(req.user._id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        });
});

app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addHistory(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        });
});

app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.removeHistory(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        });
});

// Start the server
userService.connect()
    .then(() => {
        app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
    })
    .catch((err) => {
        console.log("Unable to start the server: " + err);
        process.exit(1);
    });
