const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "portfolio",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,

  ...(process.env.DB_SSL === "true"
    ? {
        ssl: {
          rejectUnauthorized:
            process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
        },
      }
    : {}),
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

module.exports = pool;
