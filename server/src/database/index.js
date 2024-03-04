const sequelize = require("sequelize");
const database = require("../config/database");
const connection = new sequelize(database);
//
const User = require("../api/v1/models/User");
const Login = require("../api/v1/models/Login");
const Inscription = require("../api/v1/models/Inscription");
const Document = require("../api/v1/models/Document");
const Contract = require("../api/v1/models/Contract");
const Signer = require("../api/v1/models/Signer");
//
//
// Models connection links
//
User.init(connection);
Login.init(connection);
Inscription.init(connection);
Document.init(connection);
Contract.init(connection);
Signer.init(connection);
//

module.exports = connection;
