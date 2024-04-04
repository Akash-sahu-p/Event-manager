const db = require("../models");
const Review = db.review;

const checkValidReview = (req, res, next) => {
    const reviewid = req.params.reviewid;

    if (!reviewid.match(/^[0-9a-zA-Z]+$/i)) {
        return res.status(400).send({
            message: "Failed! reviewid should be alphanumeric only!",
        });
    }

    Review.findById(reviewid).exec((err, review) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!review) {
            return res.status(400).send({
                message: "Failed! Review does not exist!",
            });
        }

        req.reviewObj = review;
        next();
    });
};

const verifyReview = {
    checkValidReview,
};

module.exports = verifyReview;
