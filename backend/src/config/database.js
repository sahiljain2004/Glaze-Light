const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const promisePool = pool.promise();

(async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Aiven MySQL Connected!');
        connection.release();
    } catch (error) {
        console.error('❌ Aiven MySQL Connection Failed:', error.message);
    }
})();

module.exports = promisePool;
