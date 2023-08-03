const shortid = require("shortid");
const db = require("../database");
const validateUrl = require("../../utils/validateURL");

const shortURLList = async (req, res, next) => {
  try {
    const bdata = req.body;
    const per_page = parseInt(bdata.per_page) || 10;
    const page_no = parseInt(bdata.page_no) || 1;

    const offset = (page_no - 1) * per_page;

    const sql = "SELECT * FROM login WHERE username = ? AND email = ?";
    const totalData = await db(sql, [bdata.username, bdata.email]);

    if (totalData.length === 0) {
      return res.status(401).json({ message: "Data not found", status: false });
    }

    const sqlData = "SELECT * FROM url WHERE email = ? ORDER BY id LIMIT ?, ?";
    const results = await db(sqlData, [bdata.email, offset, per_page]);

    if (results.length === 0) {
      res.status(200).json({
        message: "Shorten URL List",
        data: results,
        totalPageCount: Math.ceil(results.length / per_page),
        currentPage: page_no,
        totalShortenUrlList: results.length,
        status: true,
      });
    } else {
      const totalDataList = await db("SELECT * FROM url WHERE email = ?", [
        bdata.email,
      ]);
      res.status(200).json({
        message: "Shorten URL List",
        data: results,
        totalPageCount: Math.ceil(totalDataList.length / per_page),
        currentPage: page_no,
        totalShortenUrlList: totalDataList.length,
        status: true,
      });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Internal Server Error", status: false });
  }
};

const shortURL = async (req, res, next) => {
  try {
    const bdata = req.body;
    const fullUrl = bdata.fullUrlLink;

    // const base = `http://localhost:8080`;
    const base = `http://api.avinya-software.dedicave.com`;

    if (!bdata.username) {
      return res
        .status(401)
        .json({ message: "Username not provide", status: false });
    }
    if (!bdata.email) {
      return res
        .status(401)
        .json({ message: "Email not provide", status: false });
    }
    if (!fullUrl) {
      return res.status(401).json({ message: "Enter URL", status: false });
    }
    if (!validateUrl.validateUrl(fullUrl)) {
      return res
        .status(401)
        .json({ message: "Invalid Original Url", status: false });
    }

    const sql = "SELECT * FROM login WHERE username = ? AND email = ?";
    const rows = await db(sql, [bdata.username, bdata.email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Data not found", status: false });
    } else {
      const sql = "SELECT * FROM `url` WHERE `fullURL` = ? AND `email` = ?";
      const results = await db(sql, [fullUrl, bdata.email]);

      if (results.length === 0) {
        const shortID = shortid.generate();
        const short = `${base}/${shortID}`;
        const url = {
          username: bdata.username,
          email: bdata.email,
          fullUrl: fullUrl,
          shortUrlLink: short,
          shortUrl: shortID,
          counts: 1,
          created_At: new Date(),
        };
        const sql = "INSERT INTO `url` SET ?";
        const data = await db(sql, [url]);

        if (data.affectedRows === 1) {
          url.id = data.insertId; // id set
          res.status(200).json({
            message: "Shorten URL Successfully",
            data: url,
            status: true,
          });
        }
      } else {
        const url = {
          id: results[0]?.id,
          username: results[0]?.username,
          email: results[0]?.email,
          fullUrl: results[0]?.fullURL,
          shortUrlLink: results[0]?.shortUrlLink,
          shortUrl: results[0]?.shortUrl,
          counts: results[0]?.counts + 1,
        };
        const sql = "UPDATE url SET counts = ? WHERE email = ? AND fullURL = ?";
        const rows = await db(sql, [url.counts, bdata.email, fullUrl]);

        if (rows.affectedRows === 1) {
          res.status(200).json({ data: url, status: true });
        }
      }
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Internal Server Error", status: false });
  }
};

const shortURLCountUpdate = async (req, res) => {
  try {
    const bdata = req.body;
    const id = bdata.id;
    const shortUrlLink = bdata.shortUrlLink;

    if (!id) {
      return res.status(401).json({ message: "ID not found", status: false });
    }
    if (!shortUrlLink) {
      return res
        .status(401)
        .json({ message: "ShortUrlLink not found", status: false });
    }
    const sql = "SELECT id, fullURL, counts FROM url WHERE shortUrlLink = ?";
    const results = await db(sql, [shortUrlLink]);
    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Short URL not found", status: false });
    }
    const sqlQ = "UPDATE `url` SET `counts` = ? WHERE `id` = ?";
    const data = await db(sqlQ, [results[0]?.counts + 1, results[0]?.id]);

    if (data.affectedRows === 1) {
      const sqls = "SELECT * FROM url WHERE id = ?";
      const countdata = await db(sqls, [id]);
      res.status(200).json({ counts: countdata[0]?.counts, status: true });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Internal Server Error", status: false });
  }
};

const shortURLDelete = async (req, res) => {
  try {
    const id = req.params.id;
    var sql = "DELETE FROM url WHERE id = ?";
    const data = await db(sql, [id]);
    if (data.affectedRows === 1) {
      res.status(200).json({ message: "Record Deleted", status: true });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Internal Server Error", status: false });
  }
};

// WITH OUT AUTH
const shortenURL = async (req, res, next) => {
  try {
    const bdata = req.body;
    const fullUrl = bdata.fullUrlLink;

    // const base = `http://localhost:8080`;
    const base = `http://api.avinya-software.dedicave.com`;

    if (!fullUrl) {
      return res.status(401).json({ message: "Enter URL", status: false });
    }
    if (!validateUrl.validateUrl(fullUrl)) {
      return res
        .status(401)
        .json({ message: "Invalid Original Url", status: false });
    }

    const shortID = shortid.generate();
    const short = `${base}/${shortID}`;
    const url = {
      fullUrl: fullUrl,
      shortUrlLink: short,
      shortUrl: shortID,
      counts: 1,
      created_At: new Date(),
    };
    const sql = "INSERT INTO `shortenurl` SET ?";
    const data = await db(sql, [url]);

    if (data.affectedRows === 1) {
      url.id = data.insertId; // id set
      res.status(200).json({
        message: "Shorten URL Successfully",
        data: url,
        status: true,
      });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Internal Server Error", status: false });
  }
};

module.exports = {
  shortURLList,
  shortURL,
  shortURLCountUpdate,
  shortURLDelete,
  shortenURL,
};
