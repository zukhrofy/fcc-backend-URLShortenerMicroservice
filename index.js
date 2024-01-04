require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;
const Schema = mongoose.Schema;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true },
});

const Urls = mongoose.model("Urls", urlSchema);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const urlParam = req.params.short_url;
  try {
    const url = await Urls.findOne({ short_url: urlParam });
    // if exist
    if (url) return res.redirect(url.original_url);
    // if does not exist
    return res.json({
      error: "No short URL found for the given input",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/shorturl", async (req, res) => {
  const urlString = req.body.url;
  // check if valid url
  try {
    const parsedUrl = new URL(urlString);
    // check if url already in database
    const url = await Urls.findOne({ original_url: urlString });
    // if url already in database
    if (url)
      return res.json({
        original_url: url.original_url,
        short_url: url.short_url,
      });

    // check if valid hostname
    dns.lookup(parsedUrl.host, async (error, address) => {
      if (error) {
        res.json({
          error: "Invalid URL",
        });
      } else {
        const totalDocument = await Urls.countDocuments({});
        const newUrl = await Urls.create({
          original_url: urlString,
          short_url: totalDocument + 1,
        });
        return res.json(newUrl);
      }
    });
  } catch (e) {
    return res.json({
      error: "Invalid URL",
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://abbarzukhrofy:mamasasa@zukhrofy.xvvdwqj.mongodb.net/URL-Shortener-Microservice",
  )
  .then(() => {
    // listen for requests
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });
