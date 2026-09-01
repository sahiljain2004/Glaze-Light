const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Sahil's credentials
const identifier = 'sahiljain1352@gmail.com';  // Email
const password = 'sahil6139';                   // Password

console.log('🔑 Testing Login for Sahil\n');
console.log('📋 Credentials:');
console.log('   Email:', identifier);
console.log('   Phone:', '7587682814');
console.log('   Password:', password);
console.log('');

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

    console.log('✅ Connected to Database\n');

    // Find user by email or phone
    connection.query(
        'SELECT * FROM users WHERE email = ? OR phone = ?',
        [identifier, '7587682814'],
        async (err, results) => {
            if (err) {
                console.log('❌ Query error:', err.message);
                connection.end();
                return;
            }

            if (results.length === 0) {
                console.log('❌ User NOT FOUND!');
                console.log('   Email: sahiljain1352@gmail.com');
                console.log('   Phone: 7587682814');
                console.log('\n💡 Please register first!');
                connection.end();
                return;
            }

            const user = results[0];

            console.log('✅ User Found!');
            console.log('   ID:', user.id);
            console.log('   Name:', user.name);
            console.log('   Email:', user.email);
            console.log('   Phone:', user.phone);
            console.log('   Hashed Password:', user.password);
            console.log('');

            // Check password
            console.log('🔍 Checking Password...');
            const isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
                console.log('✅✅✅ PASSWORD IS CORRECT!');
                console.log('🎉 LOGIN SUCCESSFUL!');
                console.log(`   Welcome ${user.name}!`);

                // Generate JWT token
                const jwt = require('jsonwebtoken');
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET || 'mysecretkey',
                    { expiresIn: '7d' }
                );
                console.log('\n📝 JWT Token:');
                console.log(token);

            } else {
                console.log('❌❌❌ PASSWORD IS INCORRECT!');
                console.log('💡 Login Failed!');
                console.log('\n💡 Troubleshooting:');
                console.log('1. Password should be: sahil6139');
                console.log('2. Check if password is hashed properly');
                console.log('3. Try registering again through API');
            }

            connection.end();
            console.log('\n✅ Test Complete!');
        }
    );
});