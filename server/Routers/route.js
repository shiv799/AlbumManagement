const express = require("express");
const router = express.Router();
const message = require("../controller/Message/message");
const url = require("../controller/shorturl");
const auth = require("../controller/Auth/Login");
const gallery = require("../controller/gallery/image");
const verifyToken = require("../middleware/auth");

// AVINYA AUTH
router.post("/addcontact", message.addContact);
router.post("/getcontacts", message.getAllContacts);
router.get("/editcontact/:id", message.getContact);
router.put("/updatecontact/:id", message.updateContact);

// ADD CONTACT DEDICAVE
router.post("/dedicaveaddcontact", message.dedicaveAddContact);
// router.delete("/contact/:id", message.deleteContact);

// Auth
router.post("/user/signup", auth.register);
router.post("/user/login", auth.login);
router.post("/user/logout", verifyToken, auth.logout);

// WITH AUTH Shorten URL
router.post("/shorturl-list", verifyToken, url.shortURLList);
router.post("/shorturladd", verifyToken, url.shortURL);
router.post("/shorturlcountupdate", verifyToken, url.shortURLCountUpdate);
router.delete("/shorturldelete/:id", verifyToken, url.shortURLDelete);

// WITH OUT AUTH Shorten URL
router.post("/shortenurl", url.shortenURL);

router.post("/upload-image", gallery.uploadImage);

module.exports = router;
