const express = require("express");
const path = require("path");
const fs = require("node:fs");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});

app.post("/edit", function (req, res) {
  const previousFileName = `./files/${req.body.previous.trim()}`;
  const newFileName = `./files/${req.body.new.trim()}`;

  fs.rename(previousFileName, newFileName, function (err) {
    if (err) {
      console.error("Error renaming file:", err);
      res.status(500).send("Error renaming file: " + err.message);
      return;
    }
    res.redirect("/");
  });

  console.log(req.body);
});

app.get("/file/:filename", function (req, res) {
  const fname = req.params.filename;
  fs.readFile(`./files/${fname}`, "utf-8", function (err, filedata) {
    res.render("show", {
      filename: req.params.filename,
      filedata: filedata,
    });
  });
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.Title.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      res.redirect("/");
    }
  );
});

app.listen(3003);
