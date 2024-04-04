const { authJwt, verifySignUp, verifyEvent } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/user/create",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted,
        ],
        userController.signup
    );

    app.post("/api/user/login", userController.signin);

    app.get(
        "/api/user/attended/:eventid",
        [authJwt.verifyToken, verifyEvent.checkValidEvent],
        userController.attended
    );
};
