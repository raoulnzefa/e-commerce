var express = require("express");
var router = express.Router();
var db = require("..//utils/db");

// const { MongoClient } = require("mongodb");

var userRouter = require("./api/user.js");
var goodRouter = require("./api/good.js");
var authRouter = require("./api/auth.js");
var recordRouter = require("./api/record.js");

const auth = async (req, res, next) => {
    const user_id = req.cookies.user_id;
    db.find("userlist", { _id: user_id })
        .then((record) => {
            if (record.length > 0) {
                next();
            } else {
                res.status(401).json({ msg: "no auth" });
            }
        })
        .catch((err) => {
            res.status(500).json({ msg: "something wrong" });
        });
};
router.get("/", function (req, res, next) {
    res.send("api page");
});
// router.use("/user", auth, userRouter);
router.use("/user", userRouter);
// router.use("/good", auth, goodRouter);
router.use("/good", goodRouter);
router.use("/auth", authRouter);
router.use("/record", auth, recordRouter);

module.exports = router;
