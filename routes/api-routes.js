const Data = require("../models/Data");
const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../models/Data");
const crypto = require("crypto");

module.exports = function (app) {
  const randomString = crypto.randomBytes(Math.ceil(20 / 2)).toString("hex");
  const registrationKey = `${Date.now()}_${randomString}`;
  const link = process.env.APP_URL_PRODUCTION || "http://localhost:3000";

  const processDev = process.env.USERS_ROUTE_DEVELOPMENT;
  const processProd = process.env.USERS_ROUTE_PRODUCTION;

  let usersCollection = "datas";

  app.get(`/api/${usersCollection}`, (req, res) => {
    Data.aggregate([{ $match: req.query }])
      .then(function (data) {
        res.send(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post(`/api/${usersCollection}`, function (req, res) {
    Data.create(req.body)
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
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
      to: [
        { address: req.body.email },
        { name: "Receiver", address: "cuekisa@yahoo.com" },
      ],
      subject: "Konfirmacija - Good Choice",
      html: `<h3 style="color:red">Dobrodošli na Good Choice!</h3> <br>
      Zahvaljujemo se na registraciji.<br><br>
      <b>Ulogujte se i uživajte, nastavite ka sajtu klikom na <a href="${link}">LINK</a>
      <hr>
      `,
    };

    transporter
      .sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      })
      .then(() => console.log("Email sent successfully."))
      .catch((error) => console.log(error));

    transporter
      .sendMail(mailOptions2, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      })
      .then(() => console.log("Email sent successfully."))
      .catch((error) => console.log(error));
  });

  app.put(`/api/${usersCollection}`, (req, res) => {
    const { email, update } = req.body;
    Data.findOneAndUpdate(email, update, (err) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });

  app.put("/api/changeImage", (req, res) => {
    const { email, update } = req.body;
    Data.findOneAndUpdate(email, update, (err) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });

  app.delete(`/api/${usersCollection}`, (req, res) => {
    const { email } = req.body;
    Data.findOneAndDelete(email, (err) => {
      if (err) return res.send(err);
      return res.json({ success: true });
    });
  });
};
