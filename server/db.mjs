import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: "etan",
    password: "33EtanP",
    host: "localhost",
    port: 5432,
    database: "queueapp",
});

export default pool;