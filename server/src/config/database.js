require("dotenv").config("../.env");
module.exports = {
  host:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_HOST
      : process.env.PROD_DB_HOST,
  port:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_PORT
      : process.env.PROD_DB_PORT,
  dialect:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_DIALECT
      : process.env.PROD_DB_DIALECT,
  dialectModule: require("pg"),
  database:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_DATABASE_NAME
      : process.env.PROD_DB_DATABASE_NAME,
  username:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_USER
      : process.env.PROD_DB_USER,
  password:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_PASSWORD
      : process.env.PROD_DB_PASSWORD,
  dialectOptions: {
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
