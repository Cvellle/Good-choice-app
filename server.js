const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3001 || "https://good-choice.herokuapp.com/";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require('cors');
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://cvele:cvelePass@posts.jzao1.mongodb.net/posts",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(cors())
require("./routes/api-routes")(app);
require("./routes/advices-routes")(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    });
}

app.listen(PORT, function () {
  console.log(`??  ==> API Server now listening on PORT ${PORT}!`);
});
