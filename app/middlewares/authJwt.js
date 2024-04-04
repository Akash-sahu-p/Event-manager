const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        req.userName = decoded.username;
        next();
    });
};

const checkUserRole = (roleName) => (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }

                const roleFound = roles.some(role => role.name === roleName);
                if (roleFound) {
                    next();
                } else {
                    return res.status(403).send({ message: `Require ${roleName} Role!` });
                }
            }
        );
    });
};

const isAdmin = checkUserRole("admin");
const isOrganizer = checkUserRole("organizer");

const authJwt = {
    verifyToken,
    isAdmin,
    isOrganizer,
};

module.exports = authJwt;
