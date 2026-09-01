const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register User
const register = async (req, res) => {
    try {
        console.log('📝 Register request:', req.body);

        const { name, email, phone, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name and password are required'
            });
        }

        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Either email or phone is required'
            });
        }

        // Check if user exists
        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [email || null, phone || null]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or phone'
            });
        }

        // 🔥 Store password as plain text (no hashing)
        const [result] = await db.execute(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email || null, phone || null, password]
        );

        const userId = result.insertId;

        const [users] = await db.execute(
            'SELECT id, name, email, phone FROM users WHERE id = ?',
            [userId]
        );

        const user = users[0];

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'mysecretkey',
            { expiresIn: '7d' }
        );

        console.log('✅ User registered:', user);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user
        });

    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Login User - Plain Text Password
const login = async (req, res) => {
    try {
        console.log('🔑 Login request:', req.body);

        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/Phone and password are required'
            });
        }

        // Find user by email or phone
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            console.log('❌ User not found:', identifier);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // 🔥 Direct plain text password comparison
        if (user.password !== password) {
            console.log('❌ Password mismatch for:', identifier);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('✅ Login successful for:', identifier);

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name
            },
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

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, name, email, phone FROM users'
        );
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register, login, getAllUsers };