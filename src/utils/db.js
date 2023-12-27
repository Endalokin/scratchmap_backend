import "dotenv/config";
import pkg from "pg";

const {Pool} = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  host: process.env.DB_HOST,
  database: process.env.DB_ID,
});
