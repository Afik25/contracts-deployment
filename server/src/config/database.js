require("dotenv").config("../.env");
module.exports = {
  host:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_HOST
      : process.env.DB_HOST,
  port:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_PORT
      : process.env.DB_PORT,
  dialect:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_DIALECT
      : process.env.DB_DIALECT,
  dialectModule: require("pg"),
  database:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_DATABASE_NAME
      : process.env.DB_NAME,
  username:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_USER
      : process.env.DB_USER,
  password:
    process.env.APP_ENV == "dev"
      ? process.env.DEV_DB_PASSWORD
      : process.env.DB_PASSWORD,
  dialectOptions: {
    connectionString: process.env.DB_CONNECTION_URL,
    ssl: process.env.DB_CONNECTION_URL ? true : false
  },
  pool: {
    max: 5,
    min: 0,
    idle: 20000,
    evict: 15000,
    acquire: 30000,
  },
  // dialectOptions: {
  //   bigNumberStrings: true,
  //   // it must be decomment for production's mode
  //   // ssl: {
  //   //   ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
  //   // },
  // },
};
