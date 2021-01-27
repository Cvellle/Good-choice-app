const Data = require("../models/Data");
const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../models/Data");
const crypto = require("crypto");

module.exports = function(app) {
    const randomString = crypto.randomBytes(Math.ceil(20 / 2)).toString("hex");
    const registrationKey = `${Date.now()}_${randomString}`;
    const link = process.env.APP_URL_DEVELOPMENT || "http://localhost:3000";

    app.get("/api/datas", (req, res) => {
        Data.aggregate([{ $match: req.query }])
            .then(function(data) {
                res.send(data);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    app.post("/api/datas", function(req, res) {
        Data.create(req.body)
            .then(function(data) {
                res.json(data);
            })
            .catch(function(err) {
                res.json(err);
            });

        var transporter = nodemailer.createTransport({
            type: "SMTP",
            host: "smtp.gmail.com",
            auth: {
                user: "n.cuekisa@gmail.com",
                pass: process.env.EMAIL_SEND_PASSWORD,
            },
        });

        var mailOptions = {
            from: "n.cuekisa@gmail.com",
            to: "cuekisa@yahoo.com",
            subject: "Konfirmacija - Good Choice",
            html: `<h3 style="color:red">Dobrodošli na Good Choice!</h3> <br>
      Zahvaljujemo se na registraciji.<br><br>
      <b>Molimo te da klikneš na sledeći <a href="${link}/login?registrationKey=${registrationKey}&mode=registration">LINK</a>
      kako bi aktivirao svoj nalog.</b> <br>
      <hr>
      `,
        };

        transporter
            .sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            })
            .then(() => console.log("Email sent successfully."))
            .catch((error) => console.log(error));
    });

    app.put("/api/datas", (req, res) => {
        const { email, update } = req.body;
        Data.findOneAndUpdate(email, update, (err) => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    });

    app.delete("/api/datas", (req, res) => {
        const { id } = req.body;
        Data.findOneAndDelete(id, (err) => {
            if (err) return res.send(err);
            return res.json({ success: true });
        });
    });
};