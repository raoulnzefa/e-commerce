var express = require("express");
var db = require("../../utils/db");
var router = express.Router();
var mail = require("../../utils/mail");
var md5 = require("md5");

router.get("/", function (req, res) {
    res.send(" auth page");
});
// login
router.post("/login", function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    db.find("userlist", { email, password: md5(password) }).then((value) => {
        if (value.length <= 0) {
            return res.status(400).json({ msg: "Wrong account or password" });
        } else {
            if (value[0].disabled) {
                return res
                    .status(400)
                    .json({ msg: "Please go to email to verify your account" });
            } else {
                res.cookie("user_id", value[0]._id, {
                    httpOnly: true,
                    domain: "localhost",
                    path: "/",
                    maxAge: 14 * 86100000,
                });
                return res.json({ msg: "ok" });
            }
        }
    });
});
// register
router.put("/register", function (req, res, next) {
    let email = req.body.email;
    let password = md5(req.body.password);
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;

    db.find("userlist", { email })
        .then((value) => {
            if (value.length <= 0) {
                let code = parseInt(Math.random() * 10000);
                // verify_codes[email] = code;
                mail.sendMail(email, code,1)
                    .then(() => {
                        console.log({ err: 0, msg: "Verification code sent" });
                        db.insert("userlist", {
                            email,
                            password,
                            firstname,
                            lastname,
                            disabled: code,
                        }).then((value) => {
                            return res.json({
                                msg: "Please go to email for verification",
                            });
                        });
                    })
                    .catch((error) => {
                        console.log({
                            err: 1,
                            msg: "Sending verification code failed",
                        });
                        return res.status(400).json({
                            msg: "Sending verification code failed",
                        });
                    });
            } else {
                if (value[0].disabled != false) {
                    return res.status(400).json({ msg: "Please verify" });

                    // return res.status(400).json({ msg: "Please verify" });
                } else {
                    return res
                        .status(400)
                        .json({ msg: "The email has been registered" });
                }
            }
        })
        .catch((err) => {
            console.log({ err });
        });
});
// password verify
router.post("/verification", function (req, res, next) {
    var body = req.body;
    db.find("userlist", {
        email: body.email,
        password: md5(body.password),
    })
        .then((value) => {
            if (value.length > 0) {
                return res.json({
                    msg: "ok",
                });
            } else {
                return res.status(400).json({
                    msg: "no",
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
router.post("/emailverification", function (req, res, next) {
    let email = req.body.email;
      db.find(
          "userlist",
          { email:email ,disabled: false},
      ).then((value) => {
          if (value.length <= 0) {
            return res.status(200).json({
              code:1,
                msg: "The mailbox has no registered. You can registered",
            });


          } else {
            var user_id=value[0]._id
            console.log(user_id)
            console.log(email)
            mail.sendMail(email,user_id ,2)
                .then(() => {
                    return res.status(200).json({
                      code:0,
                        msg: "Please go to email for verification",
                    });
                })
                .catch((error) => {
                  console.log(error );

                    return res.status(200).json({
                      code:1,
                        msg: "Sending verification code failed",
                    });
                });

          }
      });
});
// email verify
router.get("/verification", function (req, res, next) {
    let code = parseInt(req.query.code);
    let email = req.query.email;
    let mode = req.query.mode;

    if (mode == 1) {
        db.findAndModify(
            "userlist",
            { email, disabled: code },
            { disabled: false }
        ).then((value) => {
            if (value.length <= 0) {
                return res.status(401).json({ msg: "Expired or error" });
            } else {
                return res.json({
                    msg: "The mailbox has been verified. You can log in",
                });
            }
        });
    }
});
router.post("/ResetPsd", function (req, res, next) {
  let id = req.body.id;
  let dbQuery = { _id: id };
  let updateContent = {
    password: md5(req.body.password)
     };
  db.update("userlist", dbQuery, updateContent)
      .then((value) => {
          if (value.modifiedCount > 0) {
              return res.json({ msg: "ok" });
          } else {
              return res.status(200).json({ msg: "two passwords are the same!" });
          }
      })
      .catch(console.error);
});
module.exports = router;
