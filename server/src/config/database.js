require("dotenv").config("../.env");
module.exports = {
  host: process.env.PROD_DEV_DB_HOST,
  port: process.env.PROD_DEV_DB_PORT,
  dialect: process.env.PROD_DEV_DB_DIALECT,
  dialectModule: require("pg"),
  database: process.env.PROD_DEV_DB_DATABASE_NAME,
  username: process.env.PROD_DEV_DB_USER,
  password: process.env.PROD_DEV_DB_PASSWORD,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  ssl: true,
  keepAlive: true,
  define: {
    underscored: true,
    freezeTableName: false,
    charset: "utf8",
    timestamps: false,
  },
  dialectOptions: {
    collate: "utf8_general_ci",
    bigNumberStrings: true,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  // dialectOptions: {
  //   bigNumberStrings: true,
  //   // it must be decomment for production's mode
  //   // ssl: {
  //   //   ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
  //   // },
  // },
};
