const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Auth route is working!',
        time: new Date().toISOString()
    });
});

// Register route
router.post('/register', (req, res) => {
    res.json({
        success: true,
        message: '✅ Register endpoint reached!',
        data: req.body
    });
});

// Login route
router.post('/login', (req, res) => {
    res.json({
        success: true,
        message: '✅ Login endpoint reached!',
        data: req.body
    });
});

module.exports = router;