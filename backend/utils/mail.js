const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true,
    port: 465,
    secure: true,
    auth: {
        user: "122014635@qq.com", 
        pass: "okjuobenaihqbida",
    },
});

function sendMail(mail, code,index) {
    let html=`<a href="http://localhost:3000/api/auth/verification?code=${code}&email=${mail}&mode=1">verification</a>`
    if(index==2){
      console.log(code+"11")
      console.log(mail+"22")
      html=`<a href="http://localhost:8080/#/ResetPassword?resetid=${code}">Reset Password</a>`
    }
    let mailOptions = {
        from: '" verification " <122014635@qq.com>',
        to: mail,
        subject: index==1?"verification":"Reset Password",
        html: html,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          console.log(error)
            if (error) reject();
            else {
                console.log(`Message: ${info.messageId}`);
                console.log(`sent: ${info.response}`);
                resolve();
            }
        });
    });
}

module.exports = { sendMail };
