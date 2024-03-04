const Document = require("../models/Document");
const Signer = require("../models/Signer");
const User = require("../models/User");

module.exports = {
  async create(req, res) {
    try {
      const { signers, doc_id, annotations } = req.body;

      await Document.update({ annotations }, { where: { id: doc_id } });

      const unknown_arr = [];
      const exists_arr = [];

      for (let i = 0; i < signers.length; i++) {
        const checkUser = await User.findOne({
          where: {
            mail: signers[i].mail,
          },
        });

        if (checkUser) {
          const checkSigner = await Signer.findOne({
            where: {
              document_id: doc_id,
              user_id: checkUser.id,
            },
          });
          if (checkSigner) {
            exists_arr.push(" " + checkUser.mail);
          } else {
            await Signer.create({
              document_id: doc_id,
              user_id: checkUser.id,
              type: signers[i].type,
              order: signers[i].order,
            });
          }
        } else {
          unknown_arr.push(" " + signers[i].mail);
        }
      }

      return res.status(200).json({
        status: 1,
        message: "Document Signers assignations process completed",
        unknown_arr,
        exists_arr,
      });
    } catch (error) {
      console.log({ "catch error create inscription(registration) ": error });
    }
  },
  async get(req, res) {
    try {
      const signers = await Signer.findAll();
      if (signers == "" || signers == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information about signer.",
        });
      }
      return res
        .status(200)
        .json({ status: 1, length: signers.length, signers });
    } catch (error) {
      console.log({ "catch error get signers ": error });
    }
  },
};
