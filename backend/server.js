const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true }));

// ============================================
// API REQUEST LOGGER
// ============================================

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl } = req;
        const status = res.statusCode;
        console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} -> ${status} (${duration}ms)`);
    });
    next();
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        console.error('❌ Invalid JSON body:', (req.rawBody || '').toString().slice(0, 200));
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON body'
        });
    }
    next(err);
});

// ============================================
// DATABASE
// ============================================

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'glazelight',
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false },
    connectionLimit: 10
});

db.query('SELECT 1', (err) => {
    if (err) {
        console.error('❌ Database Failed:', err.message);
    } else {
    }
});

const promiseDb = db.promise();

// ============================================
// VERIFY TOKEN
// ============================================

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token format'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// ============================================
// ROUTES
// ============================================

// Health
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server running' });
});

// Login
app.post('/api/auth/login', (req, res) => {

    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email/Phone and password required'
        });
    }

    db.query(
        'SELECT * FROM users WHERE email = ? OR phone = ?',
        [identifier, identifier],
        (err, users) => {
            if (err) {
                console.error('❌ DB Error during login:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Server error. Please try again.'
                });
            }

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const user = users[0];

            const isPlainMatch = user.password === password;

            bcrypt.compare(password, user.password, (bcryptErr, isBcryptMatch) => {
                if ((bcryptErr && !isPlainMatch) || (!isBcryptMatch && !isPlainMatch)) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }

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
            });
        }
    );
});

// ✅ GET TRANSACTIONS
app.get('/api/transactions', verifyToken, (req, res) => {

    db.query(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC',
        [req.userId],
        (err, transactions) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }


            res.json({
                success: true,
                transactions: transactions || []
            });
        }
    );
});
// ============================================
// DELETE TRANSACTION
// ============================================

app.delete('/api/transactions/:id', verifyToken, (req, res) => {
    const transactionId = req.params.id;
    const userId = req.userId;


    db.query(
        'SELECT items FROM transactions WHERE id = ? AND user_id = ?',
        [transactionId, userId],
        (fetchErr, rows) => {
            if (fetchErr) {
                console.error('❌ DB Error:', fetchErr);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            const rawItems = rows.length > 0 ? rows[0].items : null;
            const txnItems = rawItems ? (typeof rawItems === 'string' ? JSON.parse(rawItems) : rawItems) : [];

            const restoreStock = async () => {
                for (const item of txnItems) {
                    const dbId = parseInt(item.dbId ?? item.itemId, 10);
                    const qty = Number(item.quantity || 1);
                    if (!qty || qty <= 0) continue;
                    if (dbId) {
                        await promiseDb.query('UPDATE items SET stock = stock + ? WHERE id = ? AND user_id = ?', [qty, dbId, userId]);
                    } else {
                        await promiseDb.query('UPDATE items SET stock = stock + ? WHERE name = ? AND user_id = ?', [qty, String(item.name || '').trim(), userId]);
                    }
                }
            };

            restoreStock().then(() => {
                db.query(
                    'DELETE FROM transactions WHERE id = ? AND user_id = ?',
                    [transactionId, userId],
                    (err, result) => {
                        if (err) {
                            console.error('❌ DB Error:', err);
                            return res.status(500).json({ success: false, message: 'Database error' });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({ success: false, message: 'Transaction not found' });
                        }


                        res.json({ success: true, message: 'Transaction deleted successfully' });
                    }
                );
            }).catch(e => {
                console.error('❌ Stock restore error:', e.message);
                res.status(500).json({ success: false, message: 'Stock restore failed' });
            });
        }
    );
});





// ✅ UPDATE TRANSACTION
app.put('/api/transactions/:id', verifyToken, (req, res) => {

    const {
        customerName,
        phoneNumber,
        address,
        description,
        saleType,
        totalAmount,
        receivedAmount,
        dueAmount,
        paymentMethod,
        items,
        date
    } = req.body;

    // First fetch old transaction to adjust stock
    db.query(
        'SELECT items FROM transactions WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId],
        (fetchErr, rows) => {
            if (fetchErr) {
                console.error('❌ DB Error:', fetchErr);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            const rawOldItems = rows.length > 0 ? rows[0].items : null;
            const oldItems = rawOldItems ? (typeof rawOldItems === 'string' ? JSON.parse(rawOldItems) : rawOldItems) : [];
            const newItems = items || [];

            // Restore old stock
            const adjustStock = async () => {
                for (const oldItem of oldItems) {
                    const oldId = parseInt(oldItem.dbId ?? oldItem.itemId, 10);
                    const oldQty = Number(oldItem.quantity || 1);
                    if (!oldQty || oldQty <= 0) continue;
                    if (oldId) {
                        await promiseDb.query('UPDATE items SET stock = stock + ? WHERE id = ? AND user_id = ?', [oldQty, oldId, req.userId]);
                    } else {
                        await promiseDb.query('UPDATE items SET stock = stock + ? WHERE name = ? AND user_id = ?', [oldQty, String(oldItem.name || '').trim(), req.userId]);
                    }
                }
                // Apply new stock
                for (const newItem of newItems) {
                    const newId = parseInt(newItem.dbId ?? newItem.itemId, 10);
                    const newQty = Number(newItem.quantity || 1);
                    if (!newQty || newQty <= 0) continue;
                    if (newId) {
                        await promiseDb.query('UPDATE items SET stock = stock - ? WHERE id = ? AND user_id = ? AND stock >= ?', [newQty, newId, req.userId, newQty]);
                    } else {
                        await promiseDb.query('UPDATE items SET stock = stock - ? WHERE name = ? AND user_id = ? AND stock >= ?', [newQty, String(newItem.name || '').trim(), req.userId, newQty]);
                    }
                }
            };

            adjustStock().then(() => {
                // Update the transaction
                db.query(
                    `UPDATE transactions SET
                        customer_name = ?,
                        phone_number = ?,
                        address = ?,
                        description = ?,
                        sale_type = ?,
                        total_amount = ?,
                        received_amount = ?,
                        due_amount = ?,
                        payment_method = ?,
                        is_received = ?,
                        items = ?,
                        date = ?
                    WHERE id = ? AND user_id = ?`,
                    [
                        customerName,
                        phoneNumber || null,
                        address || null,
                        description || null,
                        saleType || 'sale',
                        totalAmount || 0,
                        receivedAmount || 0,
                        dueAmount || 0,
                        paymentMethod || 'Cash',
                        dueAmount === 0 ? 1 : 0,
                        items ? JSON.stringify(items) : null,
                        date || new Date().toISOString().split('T')[0],
                        req.params.id,
                        req.userId
                    ],
                    (err, result) => {
                        if (err) {
                            console.error('❌ DB Error:', err);
                            return res.status(500).json({
                                success: false,
                                message: 'Database error',
                                error: err.message
                            });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({
                                success: false,
                                message: 'Transaction not found'
                            });
                        }


                        res.json({
                            success: true,
                            message: 'Transaction updated successfully'
                        });
                    }
                );
            }).catch(e => {
                console.error('❌ Stock adjust error:', e.message);
                res.status(500).json({ success: false, message: 'Stock adjust failed' });
            });
        }
    );
});
// ✅ CREATE TRANSACTION
app.post('/api/transactions', verifyToken, (req, res) => {

    const {
        customerName,
        phoneNumber,
        address,
        description,
        saleType,
        totalAmount,
        receivedAmount,
        dueAmount,
        paymentMethod,
        items,
        date
    } = req.body;

    if (!customerName) {
        return res.status(400).json({
            success: false,
            message: 'Customer name is required'
        });
    }

    const transactionNumber = `TXN-${Date.now().toString().slice(-6)}`;

    db.query(
        `INSERT INTO transactions (
            user_id, customer_name, phone_number, address, description,
            sale_type, total_amount, received_amount, due_amount,
            payment_method, transaction_number, is_received, items, date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            req.userId,
            customerName,
            phoneNumber || null,
            address || null,
            description || null,
            saleType || 'Cash',
            totalAmount || 0,
            receivedAmount || 0,
            dueAmount || 0,
            paymentMethod || 'Cash',
            transactionNumber,
            dueAmount === 0 ? 1 : 0,
            items ? JSON.stringify(items) : null,
            date || new Date().toISOString().split('T')[0]
        ],
        (err, result) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error: ' + err.message
                });
            }


            // ============================================
            // DECREMENT STOCK FOR BILLED ITEMS
            // ============================================

            const decrementStock = async () => {
                if (!Array.isArray(items) || items.length === 0) return;

                for (const billItem of items) {
                    const dbId = parseInt(
                        billItem.dbId ?? billItem.itemId,
                        10
                    );
                    const qty = Number(billItem.quantity || 1);

                    if (!qty || qty <= 0) continue;

                    // Update stock by DB id if available, otherwise match by name
                    if (dbId) {
                        await promiseDb.query(
                            `UPDATE items
                             SET stock = stock - ?
                             WHERE id = ? AND user_id = ? AND stock >= ?`,
                            [qty, dbId, req.userId, qty]
                        );
                    } else {
                        await promiseDb.query(
                            `UPDATE items
                             SET stock = stock - ?
                             WHERE name = ? AND user_id = ? AND stock >= ?`,
                            [
                                qty,
                                String(billItem.name || '').trim(),
                                req.userId,
                                qty
                            ]
                        );
                    }
                }
            };

            decrementStock().catch((error) => {
                console.error('❌ Stock decrement error:', error.message);
            });

            res.status(201).json({
                success: true,
                message: 'Transaction created',
                transactionId: result.insertId
            });
        }
    );
});
// ============================================
// SALE REPORT ROUTE - ✅ YE ADD KARO
// ============================================

app.get('/api/sale-report', verifyToken, (req, res) => {

    const userId = req.userId;

    db.query(
        `SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC`,
        [userId],
        (err, transactions) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            const totalSale = transactions.reduce((sum, t) => sum + Number(t.total_amount || 0), 0);
            const totalReceived = transactions.reduce((sum, t) => sum + Number(t.received_amount || 0), 0);
            const balanceDue = transactions.reduce((sum, t) => sum + Number(t.due_amount || 0), 0);

            res.json({
                success: true,
                summary: {
                    totalTransactions: transactions.length,
                    totalSale: Number(totalSale).toFixed(2),
                    totalReceived: Number(totalReceived).toFixed(2),
                    balanceDue: Number(balanceDue).toFixed(2),
                },
                transactions: transactions.map(t => ({
                    id: String(t.id),
                    customerName: t.customer_name,
                    amount: Number(t.total_amount).toFixed(2),
                    balance: Number(t.due_amount).toFixed(2),
                    transactionNumber: t.transaction_number,
                    date: t.date,
                    totalAmount: Number(t.total_amount),
                    dueAmount: Number(t.due_amount),
                    receivedAmount: Number(t.received_amount),
                    paymentMethod: t.payment_method,
                }))
            });
        }
    );
});

// ============================================
// ITEMS ROUTES
// ============================================

// ✅ CREATE ITEM
app.post('/api/items', verifyToken, (req, res) => {

    const { name, category, unit, price, stock } = req.body;

    // Validation
    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Item name is required'
        });
    }

    if (!price || Number(price) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid price is required'
        });
    }

    db.query(
        `INSERT INTO items (user_id, name, category, unit, price, stock) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            req.userId,
            name.trim(),
            category || 'Lighting',
            unit || 'PCS',
            Number(price),
            Number(stock) || 0
        ],
        (err, result) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    error: err.message
                });
            }


            res.status(201).json({
                success: true,
                message: 'Item added successfully',
                itemId: result.insertId,
                item: {
                    id: String(result.insertId),
                    name: name.trim(),
                    category: category || 'Lighting',
                    unit: unit || 'PCS',
                    price: Number(price),
                    stock: Number(stock) || 0
                }
            });
        }
    );
});

// ✅ GET ALL ITEMS
app.get('/api/items', verifyToken, (req, res) => {

    db.query(
        'SELECT * FROM items WHERE user_id = ? ORDER BY id DESC',
        [req.userId],
        (err, items) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }


            res.json({
                success: true,
                items: items.map(item => ({
                    id: String(item.id),
                    name: item.name,
                    category: item.category,
                    unit: item.unit,
                    price: Number(item.price),
                    stock: Number(item.stock),
                    createdAt: item.created_at,
                    updatedAt: item.updated_at
                }))
            });
        }
    );
});

// ✅ GET SINGLE ITEM
app.get('/api/items/:id', verifyToken, (req, res, next) => {
    if (req.params.id === 'search') {
        return next();
    }


    db.query(
        'SELECT * FROM items WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId],
        (err, items) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            if (items.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            const item = items[0];

            res.json({
                success: true,
                item: {
                    id: String(item.id),
                    name: item.name,
                    category: item.category,
                    unit: item.unit,
                    price: Number(item.price),
                    stock: Number(item.stock),
                    createdAt: item.created_at,
                    updatedAt: item.updated_at
                }
            });
        }
    );
});

// ✅ UPDATE ITEM
app.put('/api/items/:id', verifyToken, (req, res) => {

    const { name, category, unit, price, stock } = req.body;

    db.query(
        `UPDATE items SET 
            name = ?, 
            category = ?, 
            unit = ?, 
            price = ?, 
            stock = ? 
        WHERE id = ? AND user_id = ?`,
        [
            name.trim(),
            category || 'Lighting',
            unit || 'PCS',
            Number(price),
            Number(stock),
            req.params.id,
            req.userId
        ],
        (err, result) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }


            res.json({
                success: true,
                message: 'Item updated successfully'
            });
        }
    );
});

// ✅ DELETE ITEM
app.delete('/api/items/:id', verifyToken, (req, res) => {

    db.query(
        'DELETE FROM items WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId],
        (err, result) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }


            res.json({
                success: true,
                message: 'Item deleted successfully'
            });
        }
    );
});

// ✅ SEARCH ITEMS
app.get('/api/items/search/:query', verifyToken, (req, res) => {

    const searchTerm = `%${req.params.query}%`;

    db.query(
        'SELECT * FROM items WHERE user_id = ? AND (name LIKE ? OR category LIKE ?) ORDER BY name ASC',
        [req.userId, searchTerm, searchTerm],
        (err, items) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            res.json({
                success: true,
                items: items.map(item => ({
                    id: String(item.id),
                    name: item.name,
                    category: item.category,
                    unit: item.unit,
                    price: Number(item.price),
                    stock: Number(item.stock)
                }))
            });
        }
    );
});
// ✅ SEARCH TRANSACTIONS - WITH PHONE NUMBER
app.get('/api/transactions/search', verifyToken, (req, res) => {

    const userId = req.userId;
    const query = req.query.q || '';
    const searchTerm = `%${query}%`;

    db.query(
        `SELECT * FROM transactions 
        WHERE user_id = ? 
        AND (
            customer_name LIKE ? OR 
            phone_number LIKE ? OR 
            transaction_number LIKE ?
        )
        ORDER BY date DESC, id DESC`,
        [userId, searchTerm, searchTerm, searchTerm],
        (err, transactions) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }


            res.json({
                success: true,
                transactions: transactions.map(t => ({
                    id: String(t.id),
                    name: t.customer_name,
                    customerName: t.customer_name,
                    amount: Number(t.total_amount).toFixed(2),
                    balance: Number(t.due_amount).toFixed(2),
                    transactionNumber: t.transaction_number,
                    date: t.date,
                    phoneNumber: t.phone_number || '',
                    address: t.address || '',
                    description: t.description || '',
                    saleType: t.sale_type || 'sale',
                    totalAmount: Number(t.total_amount),
                    receivedAmount: Number(t.received_amount),
                    dueAmount: Number(t.due_amount),
                    paymentMethod: t.payment_method || 'Cash',
                    isReceived: t.is_received === 1,
                    items: t.items ? JSON.parse(t.items) : []
                }))
            });
        }
    );
});

app.get('/api/dashboard/summary', verifyToken, (req, res) => {

    const userId = req.userId;

    // ✅ Query WITHOUT sale_type filter (saare transactions)
    db.query(
        `SELECT 
            COUNT(*) as totalTransactions,
            COALESCE(SUM(total_amount), 0) as totalSales,
            COALESCE(SUM(received_amount), 0) as totalReceived,
            COALESCE(SUM(due_amount), 0) as totalDue,
            COUNT(CASE WHEN due_amount > 0 THEN 1 END) as pendingPayments,
            COUNT(CASE WHEN is_received = 1 THEN 1 END) as completedPayments,
            COUNT(CASE WHEN DATE(date) = CURDATE() THEN 1 END) as todayTransactions,
            COALESCE(SUM(CASE WHEN DATE(date) = CURDATE() THEN total_amount ELSE 0 END), 0) as todaySales
        FROM transactions 
        WHERE user_id = ?`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            const data = results[0] || {};

            res.json({
                success: true,
                summary: {
                    totalTransactions: data.totalTransactions || 0,
                    totalSales: Number(data.totalSales || 0).toFixed(2),
                    totalReceived: Number(data.totalReceived || 0).toFixed(2),
                    totalDue: Number(data.totalDue || 0).toFixed(2),
                    pendingPayments: data.pendingPayments || 0,
                    completedPayments: data.completedPayments || 0,
                    todayTransactions: data.todayTransactions || 0,
                    todaySales: Number(data.todaySales || 0).toFixed(2)
                }
            });
        }
    );
});

// ✅ GET RECENT TRANSACTIONS
app.get('/api/dashboard/recent', verifyToken, (req, res) => {

    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 5;

    // ✅ Query WITHOUT sale_type filter
    db.query(
        `SELECT 
            id,
            customer_name,
            total_amount,
            due_amount,
            transaction_number,
            date,
            payment_method,
            is_received
        FROM transactions 
        WHERE user_id = ?
        ORDER BY date DESC, id DESC
        LIMIT ?`,
        [userId, limit],
        (err, transactions) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }


            res.json({
                success: true,
                recentTransactions: transactions.map(t => ({
                    id: String(t.id),
                    customerName: t.customer_name,
                    amount: Number(t.total_amount).toFixed(2),
                    balance: Number(t.due_amount).toFixed(2),
                    transactionNumber: t.transaction_number,
                    date: t.date,
                    isReceived: t.is_received === 1,
                    paymentMethod: t.payment_method || 'Cash'
                }))
            });
        }
    );
});
// ============================================
// UPDATE ITEM STOCK (when sale happens)
// ============================================

app.put('/api/items/stock/:id', verifyToken, (req, res) => {

    const userId = req.userId;
    const { quantity, itemName } = req.body; // quantity sold

    if (!quantity || quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid quantity is required'
        });
    }

    // Match by id OR by item name (for manual items with no id)
    let whereClause = 'id = ? AND user_id = ?';
    const whereParams = [req.params.id, userId];

    if (!Number(req.params.id) && itemName) {
        whereClause = 'name = ? AND user_id = ?';
        whereParams[0] = String(itemName).trim();
    }

    // Check current stock
    db.query(
        `SELECT stock FROM items WHERE ${whereClause}`,
        whereParams,
        (err, results) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            const currentStock = results[0].stock;
            const newStock = currentStock - quantity;

            if (newStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock! Available: ${currentStock}`
                });
            }

            // Update stock
            db.query(
                `UPDATE items SET stock = ? WHERE ${whereClause}`,
                [newStock, ...whereParams],
                (err, result) => {
                    if (err) {
                        console.error('❌ DB Error:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Database error'
                        });
                    }


                    res.json({
                        success: true,
                        message: 'Stock updated successfully',
                        oldStock: currentStock,
                        newStock: newStock
                    });
                }
            );
        }
    );
});

// ✅ SEARCH ITEMS (for auto-suggest)
app.get('/api/items/search', verifyToken, (req, res) => {

    const userId = req.userId;
    const query = req.query.q || '';
    const searchTerm = `%${query}%`;

    db.query(
        `SELECT id, name, category, unit, price, stock 
        FROM items 
        WHERE user_id = ? 
        AND (name LIKE ? OR category LIKE ?)
        AND stock > 0
        ORDER BY name ASC
        LIMIT 10`,
        [userId, searchTerm, searchTerm],
        (err, items) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }


            res.json({
                success: true,
                items: items.map(item => ({
                    id: String(item.id),
                    name: item.name,
                    category: item.category,
                    unit: item.unit,
                    price: Number(item.price),
                    stock: Number(item.stock)
                }))
            });
        }
    );
});
// ============================================
// WAKEUP (keeps Render free tier alive)
// ============================================

app.get('/wakeup', (req, res) => {
    res.json({ status: 'awake', time: new Date().toISOString() });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, '0.0.0.0', () => {

    // Self-ping every 14 min 59 sec to prevent Render spin-down
    const BASE_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const WAKEUP_URL = `${BASE_URL}/wakeup`;
    setInterval(() => {
        fetch(WAKEUP_URL)
            .catch(err => console.error('❌ Wakeup ping failed:', err.message));
    }, 14 * 60 * 1000 + 59 * 1000); // 14:59 min
});