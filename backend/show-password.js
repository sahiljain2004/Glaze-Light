const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'testdb'
});

connection.connect((err) => {
    if (err) {
        console.log('❌ Connection failed:', err.message);
        return;
    }

    connection.query('SELECT id, name, email, phone, password FROM users', (err, users) => {
        if (err) {
            console.log('❌ Error:', err.message);
            connection.end();
            return;
        }

        console.log('\n📋 Users with Passwords:');
        console.log('='.repeat(80));

        users.forEach((user, index) => {
            console.log(`\n👤 User ${index + 1}:`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email || 'Not set'}`);
            console.log(`   Phone: ${user.phone || 'Not set'}`);
            console.log(`   Password: ${user.password}`);
            console.log(`   Password Length: ${user.password ? user.password.length : 0}`);
            console.log(`   Is Hashed: ${user.password && user.password.startsWith('$2') ? 'Yes (bcrypt)' : 'No (plain text)'}`);
        });

        connection.end();
    });
});