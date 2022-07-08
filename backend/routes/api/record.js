var express = require("express");
var db = require("../../utils/db");
const { ObjectId } = require("mongodb");

var router = express.Router();


// decrease the stock number after payments
router.put("/", function (req, res, next) {
    var body = req.body;
    let goods = body.goods;
    let goods_id = [];
    if (goods.length <= 0) {
        return res.status(400).json({ msg: "there is no goods" });
    } else {
        for (const item of goods) {
            goods_id.push({ _id: ObjectId(item.goods_id) });
        }
        let dbQuery = { $or: goods_id };
        db.find("phonelisting", dbQuery)
            .then((value) => {
                if (value.length != goods_id.length) {
                    return res
                        .status(400)
                        .json({ msg: "Some goods are not found" });
                }

                for (const item of goods) {
                    for (const valueItem of value) {
                        if (item.goods_id == valueItem._id) {
                            if (valueItem.stock - item.num < 0) {
                                return res
                                    .status(400)
                                    .json({ msg: "Insufficient quantity" });
                            }
                            break;
                        }
                    }
                }
                for (const item of goods) {
                    for (const valueItem of value) {
                        if (item.goods_id == valueItem._id) {
                            item.price = valueItem.price;
                            let update_content = {};
                            if (valueItem.stock - item.num > 0) {
                                update_content = {
                                    stock: valueItem.stock - item.num,
                                };
                            } else {
                                update_content = {
                                    stock: valueItem.stock - item.num,
                                    disabled: true,
                                };
                            }
                            db.update(
                                "phonelisting",
                                { _id: valueItem._id },
                                update_content
                            );
                            break;
                        }
                    }
                }
                res.json({ msg: "ok" });
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

module.exports = router;
