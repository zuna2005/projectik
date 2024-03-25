const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/allTags', (req, res) => {
    const getTagsQuery = "SELECT * FROM tags"
    db.query(getTagsQuery, (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        return res.json(data)
    })
})

router.post('/create', async (req, res) => {
    const { newTags } = req.body
    let tagIds = []
    try {
        for (let tagName of newTags) {
            const insertTagResult = await new Promise((resolve, reject) => {
                const createTagQuery = 'INSERT INTO tags (name) VALUES (?)';
                db.query(createTagQuery, [tagName], (err, data) => {
                    if (err) {
                        console.log('Database error:', err);
                        reject(err);
                    } else {
                        resolve(data.insertId);
                    }
                });
            });
            tagIds.push(insertTagResult);
        }
        return res.json(tagIds);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/byId', (req, res) => {
    const ids = req.body.ids.split(',').map(id => parseInt(id))
    const getTagsbyIdQuery = 'SELECT name FROM tags WHERE id IN (?)'
    db.query(getTagsbyIdQuery, [ids], (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        return res.json(data)
    })
})

module.exports = router;