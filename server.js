const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/contact", async (req, res) => {
  try {
    const { Name, Email, Subject, Message } = req.body;

    if (!Name || !Email || !Subject || !Message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      replyTo: Email,
      subject: `New Portfolio Contact Message - ${Subject}`,
      html: `
        <h2>New Contact Form Message</h2>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td><strong>Name</strong></td>
            <td>${Name}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>${Email}</td>
          </tr>
          <tr>
            <td><strong>Subject</strong></td>
            <td>${Subject}</td>
          </tr>
          <tr>
            <td><strong>Message</strong></td>
            <td>${Message}</td>
          </tr>
        </table>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Email not sent. Please check server email settings."
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});