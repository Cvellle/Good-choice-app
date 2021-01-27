const Advices = require("../models/Advices");
const crypto = require("crypto");

var formidable = require("formidable");
var fs = require("fs");
var multer = require("multer");
// var upload = multer({ dest: "./uploads/" });

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    var dir = "./client/src/uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).array("files", 12);

// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     var dir = "./uploads";
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     callback(null, dir);
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });
// var upload = multer({ storage: storage }).array("files", 12);

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

  app.post("/upload", function (req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        return res.end("Something went wrong:(");
      }
      res.end();
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
