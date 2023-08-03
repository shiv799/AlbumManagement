const avinyaAppProject = require("../../../utils/firebaseConfigAvinya");
const avinyadb = avinyaAppProject.firestore();

const dedicaveAppProject = require("../../../utils/firebaseConfigDedicave");
const dedicavedb = dedicaveAppProject.firestore();

const nodemailer = require("nodemailer");
const Contact = require("../../models/contact");
require("dotenv").config();

// Avinya
const addContact = async (req, res, next) => {
  try {
    const bdata = req.body;
    let date = new Date();
    bdata.date = date;

    let selectedOption = "submitted";
    bdata.selectedOption = selectedOption;

    if (!bdata.email) {
      res.status(401).json({ message: "Enter Email", status: false });
      return false;
    }

    // if (!validEmail(bdata.email)) {
    //   res.status(401).json({ message: "Enter Valid Email", status: false });
    //   return false;
    // }

    if (!bdata.message) {
      res.status(401).json({ message: "Enter Message", status: false });
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.AVINYA_HOST,
      port: 8889,
      secure: false,
      auth: {
        type: "login",
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      ignoreTLS: false,
    });

    let info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: bdata.email,
      subject: "Avinya Software Solution",
      html: `
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
        <div style="display: block; margin: auto; max-width: 600px;" class="main">
          <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Hello ${bdata.name},</h1>
          <p>We have received your message and would like to thank you for writing to us.
          If your inquiry is urgent, please use the 8140900565 talk to one of our staff members. </p>
          <p>Otherwise, we will reply by email as soon as possible.</p>
        </div>
        <style>
          .main { background-color: white; }
          a:hover { border-left-width: 1em; min-height: 2em; }
        </style>

        <h5>Thanks & Regards,</h5>
        <p>Avinya Software Solution</p>
      </body>
    </html>
  `,
    });

    if (!info.messageId) {
      res.status(401).json({ message: "Something went wrong", status: false });
      return false;
    }

    await avinyadb.collection("contact").doc().set(bdata);
    res
      .status(200)
      .json({ message: "Message sent successfully", status: true });
  } catch (error) {
    res.status(401).json({ message: error.message, status: false });
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const bdata = req.body;
    const per_page = parseInt(bdata.per_page) || 10;
    const page_no = parseInt(bdata.page_no) || 1;
    const offset = (page_no - 1) * per_page;

    const contactsData = (await bdata.search)
      ? avinyadb
          .collection("contact")
          .limit(per_page)
          .where("selectedOption", "==", bdata.search)
          .offset(offset)
      : avinyadb
          .collection("contact")
          .orderBy("name")
          .limit(per_page)
          .offset(offset);

    const data = await contactsData.get();
    const totaldata = await avinyadb.collection("contact").get();
    const searchData = await avinyadb
      .collection("contact")
      .where("selectedOption", "==", bdata.search)
      .get();

    const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No records found" });
    } else {
      let total = 0;
      data.forEach((item) => {
        const employee = new Contact(
          item.id,
          item.data().name,
          item.data().email,
          item.data().message,
          item.data().selectedOption,
          item.data().date,
          item.data().comment
        );
        arr.push(employee);
        total = total + 1;
      });

      let totalContacts = bdata.search ? searchData._size : totaldata._size;
      let totalPageCount = bdata.search
        ? searchData._size / per_page
        : totaldata._size / per_page;

      res.status(200).json({
        data: arr,
        totalContacts: totalContacts,
        totalPageCount: Math.ceil(totalPageCount),
        currentPage: page_no,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const employee = await avinyadb.collection("contact").doc(id);
    const data = await employee.get();
    if (!data.exists) {
      res.status(404).json({ message: "Record not found" });
    } else {
      res.status(200).json(data.data());
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const bdata = req.body;
    let date = new Date();
    bdata.date = date;
    const employee = await avinyadb.collection("contact").doc(id);
    await employee.update(bdata);
    res
      .status(200)
      .json({ message: "Record updated successfully", status: true });
  } catch (error) {
    res.status(401).json({ message: error.message, status: false });
  }
};

// const deleteContact = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     await avinyadb.collection("contact").doc(id).delete();
//     res.status(204).json({ message: "Record deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// DEDICAVE

const dedicaveAddContact = async (req, res, next) => {
  try {
    const bdata = req.body;
    let date = new Date();
    bdata.date = date;

    if (!bdata.email) {
      res.status(401).json({ message: "Enter Email", status: false });
      return false;
    }
    if (!bdata.message) {
      res.status(401).json({ message: "Enter Message", status: false });
      return false;
    }
    const transporter = nodemailer.createTransport({
      host: process.env.DEDICAVE_HOST,
      port: 8889,
      secure: false,
      auth: {
        type: "login",
        user: process.env.DEDICAVE_USER_EMAIL,
        pass: process.env.DEDICAVE_USER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      ignoreTLS: false,
    });
    let info = await transporter.sendMail({
      from: process.env.DEDICAVE_HOST,
      to: bdata.email,
      subject: "Dedicave Team",
      html: `
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
        <div style="display: block; margin: auto; max-width: 600px;" class="main">
          <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Hello ${bdata.name},</h1>
          <p>We have received your message and would like to thank you for writing to us.</p>
          <p>We will reply by email as soon as possible.</p>
        </div>
        <style>
          .main { background-color: white; }
          a:hover { border-left-width: 1em; min-height: 2em; }
        </style>

        <h5>Thanks & Regards,</h5>
        <p>Dedicave Team</p>
      </body>
    </html>
  `,
    });

    if (!info.messageId) {
      res.status(401).json({ message: "Something went wrong", status: false });
      return false;
    }
    await dedicavedb.collection("contact").doc().set(bdata);
    res
      .status(200)
      .json({ message: "Message sent successfully", status: true });
  } catch (error) {
    res.status(401).json({ message: error.message, status: false });
  }
};

module.exports = {
  addContact,
  getAllContacts,
  getContact,
  updateContact,
  // deleteContact,
  dedicaveAddContact,
};
