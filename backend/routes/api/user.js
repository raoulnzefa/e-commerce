var express = require("express");
var db = require("../../utils/db");
var md5 = require("md5");
const { ObjectId } = require("mongodb");

var router = express.Router();
// get user info
router.get("/", function (req, res, next) {
    var query = req.query;
    // let _id = query._id;
    // let dbQuery = { _id: _id };
    const options = {
        projection: { password: 0 },
    };
    db.find("userlist", query, options, (sort = {}), (limit = undefined))
        .then((value) => {
            if (value.length <= 0) {
                return res.status(100).json({
                    msg: "not found",
                });
            } else {
                return res.json(value);
            }
        })
        .catch((err) => {
            res.status(500).send(`${err}`);
        });
});

//Get the products user are selling
router.get("/saleproduct", (req, res, next) => {
    let sellerid = req.cookies.user_id;
    db.find("phonelisting", {seller: sellerid})
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json({msg: "No product you are selling"})
        })
})

//Enable or disable the product
router.put("/disableitem", (req, res, next) => {
    let user_id = req.cookies.user_id;
    let product_id = req.body.product_id;
    let isDisabled = req.body.disabled;
    db.update("phonelisting", {_id: ObjectId(product_id), seller: user_id}, {disabled: isDisabled})
        .then((result) => {
            res.json({msg: "disable successfully"})
        })
        .catch((err) => {
            res.status(400).send(`${err}`);
        })
})

router.put("/", function (req, res, next) {
    let user_id = req.cookies.user_id;
    var body = req.body;
    if (body.email) {
        db.find("userlist", { email: body.email }).then((value) => {
            var _str = value[0]._id.toString()
            if (value.length > 0 && _str!==body._id) {
                return res.status(400).json({
                    msg: "email already exists",
                });
            }
            let dbQuery = { _id: user_id };
            delete body._id
            let updateContent = body;
            db.update("userlist", dbQuery, updateContent)
                .then((value) => {
                    res.json({ msg: "ok" });
                })
                .catch((err) => {
                    res.status(400).send(`${err}`);
                });
        });
    }
});

// reset password
router.put("/resetpassword", function (req, res, next) {
    var body = req.body;
    const user_id = req.cookies.user_id;
    let dbQuery = { _id: user_id };
    let updateContent = { password: md5(body.password) };
    db.update("userlist", dbQuery, updateContent)
        .then((value) => {
            if (value.modifiedCount > 0) {
                return res.json({ msg: "ok" });
            } else {
                return res.status(401).json({ msg: "two passwords are the same!" });
            }
        })
        .catch(console.error);
    // .catch(() => {
    //     return res.status(500).json({msg:"err"});
    // });
});

module.exports = router;
