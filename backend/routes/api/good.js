var express = require("express");
var db = require("../../utils/db");

var router = express.Router();

// serach phone with complex query
router.post("/", function (req, res, next) {
    let body = req.body;
    let sort = body.sort;
    let options = body.options;
    let limit = body.limit;
    let skip = body.skip;
    delete body.sort;
    delete body.limit;
    let dbQuery = body.query;
    db.find("phonelisting", dbQuery, options, sort, limit, skip)
        .then((value) => {
            res.json(value);
        })
        .catch((err) => {
            res.send(`${err}`);
        });
});

//title serach
router.get("/",function(req,res,next){
    let query = req.query
    let title = query.title
    let reg = new RegExp(title,"i")
    let sort = query.sort;
    let options = query.options;
    let limit = query.limit;
    let skip = query.skip;
    delete query.sort;
    delete query.limit;
    let dbQuery = {title:reg,disabled:false}
    db.find("phonelisting", dbQuery, options, sort, limit, skip)
        .then((value) => {
            res.json(value);
        })
        .catch((err) => {
            res.send(`${err}`);
        });
})

//Get 5 best sales products
router.get("/bestsale", (req, res, next) => {
    db.findbest()
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.send(`error message: ${err}`);
        });
})

// get brand
router.get("/brand", function (req, res, next) {
    db.getBrand().then((brands) => {
        return res.json(brands);
    });
});
// add product
router.put("/", function (req, res, next) {
    let dbQuery = req.body;
    dbQuery.seller = req.cookies.user_id;
    dbQuery.disabled = false;
    dbQuery.reviews = []
    dbQuery.stock = parseInt(dbQuery.stock)
    dbQuery.price = parseInt(dbQuery.price)
    db.insert("phonelisting", dbQuery)
        .then((value) => {
            if (value.insertedCount > 0) {
                return res.json({
                    msg: "ok",
                    good_id: value.insertedIds[0],
                });
            } else {
                return res.status(400).json({
                    msg: "failed",
                });
            }
        })
        .catch((err) => {
            res.send(`${err}`);
        });
});
// delete phone
router.delete("/", function (req, res, next) {
    let body = req.body;
    let _id = body._id;
    let user_id = req.cookies.user_id;
    db.find("phonelisting", { _id, _id }).then((value) => {
        if (value.length <= 0) {
            return res.status(400).json({ msg: "no such phone" });
        }
        if (value[0].seller == user_id) {
            let deleteQuery = { _id: _id };
            db.deleteItem("phonelisting", deleteQuery)
                .then((value) => {
                    res.json({ msg: "ok" });
                })
                .catch((err) => {
                    res.send(`${err}`);
                });
        } else {
            return res
                .status(400)
                .json({ msg: "You are not the owner of this item" });
        }
    });
});
// comment
router.post("/review", function (req, res, next) {
    let body = req.body;
    let _id = body._id;
    let review = body.review;
    db.updateComment("phonelisting", { _id }, { $push: { reviews: review } }).then(
        (value) => {
            if (value.modifiedCount > 0) {
                return res.json({ msg: "ok" });
            } else {
                return res.status(400).json({ msg: "fail" });
            }
        }
    );
});

module.exports = router;
