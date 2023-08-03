const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./Routers/route");
const db = require("./database");
const PORT = process.env.PORT || 8080;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Body parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: true }));

// Cors

app.use(function (req, res, next) {
  var whitelist = [
    process.env.FRONT_LOCAL_URL,
    process.env.SERVER_LOCAL_URL,
    process.env.FRONT_URL,
  ];
  var host = req.get("host");
  whitelist.forEach(function (val, key) {
    if (host.indexOf(val) > -1) {
      res.setHeader("Access-Control-Allow-Origin", host);
    }
  });
  next();
});


// var corsOptions = {
//   origin: "http://localhost:3000",
// };

// app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Content-Type", "text/html");

//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-Requested-With"
//   );
//   next();
// });

// Connecting to database
process.on("SIGINT", () => {
  db.end((err) => {
    if (err) {
      return console.error("Error closing the connection pool:", err);
    } else {
      console.log("Connection pool closed.");
      process.exit(0);
    }
  });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  const sql = "SELECT id, fullURL, counts FROM url WHERE shortUrl = ?";
  const results = await db(sql, [shortUrl]);
  if (results.length === 1) {
    const sqlQ = "UPDATE `url` SET `counts` = ? WHERE `id` = ?";
    await db(sqlQ, [results[0]?.counts + 1, results[0]?.id]);

    const fullUrl = results[0]?.fullURL;
    res.redirect(fullUrl);
  } else {
    const sql = "SELECT id, fullURL, counts FROM shortenurl WHERE shortUrl = ?";
    const results = await db(sql, [shortUrl]);
    if (results.length === 1) {
      const sqlQ = "UPDATE `shortenurl` SET `counts` = ? WHERE `id` = ?";
      await db(sqlQ, [results[0]?.counts + 1, results[0]?.id]);

      const fullUrl = results[0]?.fullURL;
      res.redirect(fullUrl);
    } else {
      return res
        .status(401)
        .json({ message: "Shorten URL not found", status: false });
    }
  }
});

app.use("/api", routes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
