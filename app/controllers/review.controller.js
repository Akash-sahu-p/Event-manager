const db = require("../models");
const User = db.user;
const Event = db.event;
const Review = db.review;

exports.createReview = (req, res) => {
    Review.findOne(
        {
            user: req.userId,
            event: req.eventObjId,
        },
        (err, review) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (review) {
                res.status(400).send({
                    message: `Failed! User's review is already submitted for ${req.eventObjTitle} event!`,
                });
                return;
            } else {
                const newReview = new Review({
                    comment: req.body.comment,
                    registration_exp: req.body.registration_exp,
                    breakfast_exp: req.body.breakfast_exp,
                    event_exp: req.body.event_exp,
                    overall_exp: req.body.overall_exp,
                    likes: [],
                    reports: [],
                    is_flagged: false,
                    organizer_response: "",
                });

                User.findById(req.userId).exec((err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    if (user.events.includes(req.eventObjId)) {
                        newReview.user = user._id;
                        newReview.event = req.eventObjId;
                        newReview.save((err) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }

                            res.status(200).send({
                                message: `User ${user.username}'s review submitted for ${req.eventObjTitle} event successfully!`,
                                reviewid: newReview._id,
                            });
                        });
                    } else {
                        res.status(400).send({
                            message: `User ${user.username} cannot submit review as they did not attend ${req.eventObjTitle} event!`,
                        });
                    }
                });
            }
        }
    );
};

exports.like = (req, res) => {
    const review = req.reviewObj;

    if (review.is_flagged) {
        res.status(400).send({
            message: `Failed! Review is flagged!`,
        });
        return;
    }

    if (review.likes.includes(req.userId)) {
        res.status(400).send({
            message: `Failed! User has already liked the review!`,
        });
        return;
    } else if (review.reports.includes(req.userId)) {
        res.status(400).send({
            message: `Failed! User has already reported the review!`,
        });
        return;
    }

    review.likes.push(req.userId);
    review.save((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.send({
            message: `User liked the review successfully!`,
        });
    });
};

exports.report = (req, res) => {
    const review = req.reviewObj;

    if (review.reports.includes(req.userId)) {
        res.status(400).send({
            message: `Failed! User has already reported the review!`,
        });
        return;
    } else if (review.likes.includes(req.userId)) {
        res.status(400).send({
            message: `Failed! User has already liked the review!`,
        });
        return;
    }

    review.reports.push(req.userId);
    if (review.reports.length > 4) {
        review.is_flagged = true;
    }
    review.save((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.send({
            message: `User ${req.userName} reported the review successfully!`,
        });
    });
};

exports.createResponse = (req, res) => {
    const review = req.reviewObj;

    if (review.is_flagged) {
        res.status(400).send({
            message: `Cannot respond! Review is flagged!`,
        });
        return;
    }

    if (review.organizer_response !== "") {
        res.status(400).send({
            message: `Failed! Organizer ${req.userName} has already responded to the review!`,
        });
        return;
    }

    Event.findById(review.event).exec((err, event) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.userId !== event.organizer.toString()) {
            res.status(400).send({
                message: `Organizer ${req.userName} did not organize the ${event.title} event. Hence cannot respond!`,
            });
        } else {
            review.organizer_response = req.body.organizer_response;
            review.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.status(200).send({
                    message: `Organizer ${req.userName} submitted response for event successfully!`,
                    comment: review.organizer_response,
                });
            });
        }
    });
};
