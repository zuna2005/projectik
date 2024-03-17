const express = require('express');
const router = express.Router();
const db = require('../db/db');

const getMyColl = (req, res) => {
    const getCollectionsQuery = `
        SELECT c.id, c.name AS collection_name, c.description, cat.name AS category_name
        FROM collections c
        INNER JOIN categories cat ON c.category_id = cat.id
        WHERE c.user_id = ?`;
    
    db.query(getCollectionsQuery, [req.body.user_id], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        return res.json(data);        
    });
}

router.post('/mycollections', getMyColl);

router.post('/delete', (req, res) => {
    let error = false;
    const deleteQuery = 'DELETE FROM collections WHERE id = ?'
    for (id of req.body.ids) {
        db.query(deleteQuery, id, (err, data) => {
            if (err) {
                console.error('Database error:', err);
                error = true;
                return res.json('Error');
            }
            console.log('deleted collection with id ', id)
        })
        if (error) {break;}
    }
    if(!error) {getMyColl(req, res);} 
})

module.exports = router;
