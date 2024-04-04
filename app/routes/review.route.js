const { authJwt, verifyEvent, verifyReview } = require("../middlewares");
const reviewController = require("../controllers/review.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/review/submit/:eventid",
        [authJwt.verifyToken, verifyEvent.checkValidEvent],
        reviewController.createReview
    );

    app.get(
        "/api/review/like/:reviewid",
        [authJwt.verifyToken, verifyReview.checkValidReview],
        reviewController.like
    );

    app.get(
        "/api/review/report/:reviewid",
        [authJwt.verifyToken, verifyReview.checkValidReview],
        reviewController.report
    );

    app.post(
        "/api/review/respond/:reviewid",
        [
            authJwt.verifyToken,
            authJwt.isOrganizer,
            verifyReview.checkValidReview,
        ],
        reviewController.createResponse
    );
};
