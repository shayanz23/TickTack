import "dotenv/config";
import postgres from 'postgres';
import { stringToInteger } from "../services/converters.js";

const sql = postgres({
  host                 : process.env.DB_HOST,            // Postgres ip address[s] or domain name[s]
  port                 : stringToInteger(process.env.DB_PORT as string),          // Postgres server port[s]
  database             : process.env.DB_NAME,          // Name of database to connect to
  username             : process.env.DB_USERNAME,            // Username of database user
  password             : process.env.DB_PASSWORD,            // Password of database user
})

export default sql;