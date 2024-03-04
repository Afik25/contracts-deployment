const Contract = require("../models/Contract");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../files", "contracts"));
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
      const { user_id, type } = req.body;
      const thumbnails = req?.file?.filename;

      if (!thumbnails) {
        return res.status(400).json({
          status: 0,
          message: `Uploading file failed.`,
        });
      }

      const contract = await Contract.create({
        user_id,
        title: req?.file?.originalname,
        type,
        thumbnails,
      });

      if (contract) {
        return res.status(200).json({
          status: 1,
          message: `Contract uploaded successfully.`,
          contract,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Contract uploading failed.`,
      });
    } catch (error) {
      console.log({ "catch error create inscription(registration) ": error });
    }
  },
  async get(req, res) {
    try {
      const _contracts = await Contract.findAll();
      if (_contracts == "" || _contracts == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No Contract uploaded.",
        });
      }
      const contracts = _contracts.reverse();
      return res
        .status(200)
        .json({ status: 1, length: contracts.length, contracts });
    } catch (error) {
      console.log({ "catch error get Contracts ": error });
    }
  },
};
