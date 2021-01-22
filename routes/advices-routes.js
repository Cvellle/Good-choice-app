const Advices = require("../models/Advices");
const crypto = require("crypto");

module.exports = function (app) {
  const randomString = crypto.randomBytes(Math.ceil(20 / 2)).toString("hex");
  const registrationKey = `${Date.now()}_${randomString}`;
  const link = process.env.APP_URL_DEVELOPMENT || "http://localhost:3000";

  app.get("/api/advices", (req, res) => {
    Advices.aggregate([{ $match: req.query }])
      .then(function (data) {
        res.send(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post("/api/advices", function (req, res) {
    Advices.create(req.body)
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.put("/api/advices", (req, res) => {
    const { id, update } = req.body;
    Advices.findOneAndUpdate(id, update, (err) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });

  app.delete("/api/advices", (req, res) => {
    const { id } = req.body;
    Advices.findOneAndDelete(id, (err) => {
      if (err) return res.send(err);
      return res.json({ success: true });
    });
  });
};
