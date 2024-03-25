const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/create', (req, res) => {
    const createItemQuery = 'INSERT INTO items (user_id, collection_id, name, tags) VALUES (?, ?, ?, ?)'
    db.query(createItemQuery, Object.values(req.body), (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        return res.json(data.insertId)
    })
})

module.exports = router;
