const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Checking MySQL Table...\n');

// Connection config
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'testdb'
});

// Connect to database
connection.connect((err) => {
    if (err) {
        console.error('❌ Connection Failed!');
        console.error('Error:', err.message);
        console.log('\n💡 Check .env file credentials');
        return;
    }

    console.log('✅ Connected to Database!');
    console.log('📊 Database:', process.env.DB_NAME || 'testdb');
    console.log('\n🔍 Checking "users" table...\n');

    // Check if table exists
    connection.query('SHOW TABLES LIKE "users"', (err, results) => {
        if (err) {
            console.error('❌ Error:', err.message);
            connection.end();
            return;
        }

        if (results.length === 0) {
            console.log('❌ "users" table does NOT exist!');
            connection.end();
            return;
        }

        console.log('✅ "users" table exists!\n');

        // Check table structure
        console.log('📋 Table Structure:');
        connection.query('DESCRIBE users', (err, fields) => {
            if (err) {
                console.error('❌ Error:', err.message);
                connection.end();
                return;
            }

            console.table(fields);

            // Get all users with password
            connection.query('SELECT id, name, email, phone, password FROM users', (err, users) => {
                if (err) {
                    console.error('❌ Error fetching users:', err.message);
                    connection.end();
                    return;
                }

                console.log(`\n👤 Total Users: ${users.length}`);

                if (users.length > 0) {
                    console.log('\n📋 All Users (with password):');
                    console.table(users.map(u => ({
                        ID: u.id,
                        Name: u.name,
                        Email: u.email || 'Not set',
                        Phone: u.phone || 'Not set',
                        'Password (Hashed)': u.password ? u.password.substring(0, 30) + '...' : 'No password'
                    })));

                    // Show full password for first user
                    console.log('\n🔑 Full Password Hash for first user:');
                    console.log(users[0].password);

                } else {
                    console.log('\n📭 No users found in table');
                }

                connection.end();
                console.log('\n✅ Check Complete!');
            });
        });
    });
});