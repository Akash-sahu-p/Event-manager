const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

const corsOptions = {
    origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
    .connect(dbConfig.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit();
    });

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application." });
});

require("./app/routes/event.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/review.route")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            const roles = ["user", "organizer", "admin"];
            roles.forEach((role) => {
                new Role({
                    name: role,
                }).save((err) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                        console.log(`added '${role}' to roles collection`);
                    }
                });
            });
        }
    });
}
