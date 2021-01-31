const Advices = require("../models/Advices");
const crypto = require("crypto");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
var multer = require("multer");

const mongoURI = process.env.MONGODB_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs;
let imageCollection = "uploads";

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection(imageCollection);
  console.log("Connection Successful");
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        let bucketNameVar =
          process.env.NODE_ENV === "production" ? "uploads-prod" : "uploads";
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: bucketNameVar,
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

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

  // UPLOAD IMAGES

  app.post("/upload", upload.single("files"), (req, res, err) => {
    res.send(req.files);
  });

  let imageRoute = "/profileImage/:filename";
  let png = "png";
  let jpg = "jpg";
  let gif = "gif";

  app.get(imageRoute, (req, res) => {
    (req.params.filename.includes(png) ||
      req.params.filename.includes(jpg) ||
      req.params.filename.includes(gif)) &&
      gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: "No file exists",
          });
        }
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png" ||
          file.contentType === "image/gif"
        ) {
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: "Not an image",
          });
        }
      });
  });
};
