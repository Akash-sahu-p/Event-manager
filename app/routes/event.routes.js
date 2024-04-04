const { authJwt, verifyEvent } = require("../middlewares");
const eventController = require("../controllers/event.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/event/create",
        [
            authJwt.verifyToken,
            authJwt.isOrganizer,
            verifyEvent.checkDuplicateEvent,
        ],
        eventController.create
    );
};
