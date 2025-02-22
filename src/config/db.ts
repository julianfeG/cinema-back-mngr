import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: "localhost", // Host de tu RDS
  user: "master_cinema", // Usuario de la BD
  password: "cinema123", // Contraseña
  database: "postgres", // Nombre de la BD
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

pool.query("SET client_encoding = 'UTF8';");

export default pool;
