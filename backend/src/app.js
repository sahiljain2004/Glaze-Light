const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'testdb'
});

db.connect((err) => {
    if (err) {
        console.log('❌ DB Connection Failed:', err.message);
    } else {
        console.log('✅ DB Connected');
    }
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Home
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Backend API Server',
        endpoints: {
            health: 'GET /health',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            users: 'GET /api/auth/users'
        }
    });
});

// REGISTER - Database version
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('📝 Register called');
        const { name, email, phone, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name and password are required'
            });
        }

        // Insert into database
        db.query(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email || null, phone || null, password],
            (err, result) => {
                if (err) {
                    console.log('❌ DB Error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Database error',
                        error: err.message
                    });
                }

                // Get user
                db.query(
                    'SELECT id, name, email, phone FROM users WHERE id = ?',
                    [result.insertId],
                    (err, users) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error fetching user'
                            });
                        }

                        const user = users[0];

                        // Generate token
                        const token = jwt.sign(
                            { id: user.id, email: user.email },
                            process.env.JWT_SECRET || 'mysecretkey',
                            { expiresIn: '7d' }
                        );

                        res.status(201).json({
                            success: true,
                            message: 'Registration successful',
                            token,
                            user
                        });
                    }
                );
            }
        );

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// LOGIN - Database version
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('🔑 Login called');
        console.log('Body:', req.body);

        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/Phone and password are required'
            });
        }

        // Find user
        db.query(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [identifier, identifier],
            (err, users) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Database error'
                    });
                }

                if (users.length === 0) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }

                const user = users[0];

                // Direct password comparison (plain text)
                if (user.password !== password) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }

                // Generate token
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET || 'mysecretkey',
                    { expiresIn: '7d' }
                );

                res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                });
            }
        );

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get all users
app.get('/api/auth/users', (req, res) => {
    db.query('SELECT id, name, email, phone FROM users', (err, users) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        res.json({
            success: true,
            count: users.length,
            users
        });
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Health: http://localhost:${PORT}/health`);
    console.log(`📝 Login: POST http://localhost:${PORT}/api/auth/login`);
    console.log(`📝 Register: POST http://localhost:${PORT}/api/auth/register`);
});