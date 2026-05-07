import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  port: Number(process.env.RDS_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query("SET client_encoding = 'UTF8';");

export default pool;
