const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Test connection
(async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ MySQL Connected Successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ MySQL Connection Failed:', error.message);
    }
})();

module.exports = promisePool;