const Document = require("../models/Document");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { userNames } = req.query;

    if (
      !fs.existsSync(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "files",
          "documents",
          `${userNames}`
        )
      )
    ) {
      await fsPromises.mkdir(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "files",
          "documents",
          `${userNames}`
        )
      );
    }
    cb(
      null,
      path.join(__dirname, "..", "..", "..", "files", "documents", userNames)
    );
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = file.originalname.split(".")[0];
    callback(null, `${fileName}-${Date.now()}.${ext}`);
  },
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype == "application/pdf") {
      callback(null, true);
    } else {
      callback(new Error("Only pdf is allowed..."));
    }
  },
}).single("thumbnails");

module.exports = {
  upload: uploadImage,
  async create(req, res) {
    try {
      const { user_id } = req.body;
      const thumbnails = req?.file?.filename;

      if (!thumbnails) {
        return res.status(400).json({
          status: 0,
          message: `Uploading file failed.`,
        });
      }

      const document = await Document.create({
        user_id,
        title: req?.file?.originalname,
        thumbnails,
      });

      if (document) {
        return res.status(200).json({
          status: 1,
          message: `Document uploaded successfully.`,
          document,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Document uploading failed.`,
      });
    } catch (error) {
      console.log({ "catch error create inscription(registration) ": error });
    }
  },
  async get(req, res) {
    try {
      const _documents = await Document.findAll();
      if (_documents == "" || _documents == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No document uploaded.",
        });
      }
      const documents = _documents.reverse();
      return res
        .status(200)
        .json({ status: 1, length: documents.length, documents });
    } catch (error) {
      console.log({ "catch error get documents ": error });
    }
  },
};
