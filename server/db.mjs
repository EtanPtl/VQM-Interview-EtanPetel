import pg from "pg";
const { Pool } = pg;

// Connecting to correct database at the right port
const pool = new Pool({
    user: "etan",
    password: "33EtanP",
    host: "localhost",
    port: 5432,
    database: "queueapp",
});

export default pool;