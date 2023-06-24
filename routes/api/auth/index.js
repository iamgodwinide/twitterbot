const jwt = require('jsonwebtoken');
// const Admin = require('../../../model/Admin');
const router = require("express").Router();
// const bcrypt = require("bcryptjs");


router.post('/login', (req, res) => {
    // Mock user credentials (replace with your own authentication logic)
    const username = 'admin';
    const password = 'password123';

    const secretKey = process.env.SECRETKEY;

    // Check if the provided credentials are valid
    if (req.body.username === username && req.body.password === password) {
        // Create and sign a JWT token
        const token = jwt.sign({ username: username }, secretKey);
        res.json({ token: token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});


module.exports = router;