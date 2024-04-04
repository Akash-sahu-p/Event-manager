const db = require("../models");
const Event = db.event;

const checkValidEvent = (req, res, next) => {
    let eventid = req.params.eventid;

    if (!eventid.match(/^[0-9a-z\-]+$/i)) {
        res.status(400).send({
            message: "Failed! eventid should be alphanumeric only!",
        });
        return;
    }

    Event.findOne({
        eventid: eventid,
    }).exec((err, event) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!event) {
            res.status(400).send({
                message: "Failed! Event does not exist!",
            });
            return;
        }

        req.eventObjId = event._id;
        req.eventObjTitle = event.title;
        next();
    });
};

const checkDuplicateEvent = (req, res, next) => {
    let eventid = req.body.eventid;

    if (!eventid.match(/^[0-9a-z\-]+$/i)) {
        res.status(400).send({
            message: "Failed! eventid should be alphanumeric only!",
        });
        return;
    }

    Event.findOne({
        eventid: eventid,
    }).exec((err, event) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (event) {
            res.status(400).send({
                message: "Failed! Event with the same eventid already exists!",
            });
            return;
        }

        next();
    });
};

const verifyEvent = {
    checkDuplicateEvent,
    checkValidEvent,
};

module.exports = verifyEvent;
