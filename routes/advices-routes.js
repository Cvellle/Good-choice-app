const Advices = require("../models/Advices");
const crypto = require("crypto");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
var multer = require("multer");

const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
let imageCollection = "uploads";

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("Connection Successful");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
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
    try {
      Advices.aggregate([{ $match: req.query }])
        .then(function (data) {
          res.send(data);
        })
        .catch(function (err) {
          res.json(err);
        });
    } catch (err) {
      console.log(err);
    }
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

  app.put("/api/advices", async (req, res) => {
    const { id, update } = req.body;

    const updated = await Advices.findOneAndUpdate({ _id: id }, update, {
      new: true,
    });
    res.json({ success: true, data: updated });
  });

  app.delete("/api/advices", async (req, res) => {
    const { id } = req.body;

    try {
      await Advices.findOneAndDelete({ _id: id });
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });

  // UPLOAD IMAGES

  let png = "png";
  let jpg = "jpg";
  let gif = "gif";

  app.post("/api/upload", upload.single("files"), (req, res, err) => {
    res.send(req.files);
  });

  app.get("/api/profileImage/:filename", (req, res) => {
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
          file.contentType === "image/png"
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
