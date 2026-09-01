const db = require('../config/database');

class User {
    // Register new user
    static async create({ name, email, phone, password }) {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email || null, phone || null, password]
        );
        return result.insertId;
    }

    // Find user by email OR phone (for login)
    static async findByIdentifier(identifier) {
        const [rows] = await db.execute(
            `SELECT id, name, email, phone, password, created_at 
             FROM users 
             WHERE email = ? OR phone = ?
             LIMIT 1`,
            [identifier, identifier]
        );
        return rows[0];
    }

    // Find user by email
    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT id, name, email, phone, password, created_at FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Find user by phone
    static async findByPhone(phone) {
        const [rows] = await db.execute(
            'SELECT id, name, email, phone, password, created_at FROM users WHERE phone = ?',
            [phone]
        );
        return rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Check if email exists
    static async emailExists(email) {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM users WHERE email = ?',
            [email]
        );
        return rows[0].count > 0;
    }

    // Check if phone exists
    static async phoneExists(phone) {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM users WHERE phone = ?',
            [phone]
        );
        return rows[0].count > 0;
    }

    // Update user
    static async update(id, data) {
        const fields = [];
        const values = [];

        if (data.name) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.email) {
            fields.push('email = ?');
            values.push(data.email);
        }
        if (data.phone) {
            fields.push('phone = ?');
            values.push(data.phone);
        }
        if (data.password) {
            fields.push('password = ?');
            values.push(data.password);
        }

        values.push(id);
        const [result] = await db.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }
}

module.exports = User;