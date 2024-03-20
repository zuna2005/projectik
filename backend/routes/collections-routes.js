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

const getColl = (req, res) => {
    const getCollectionQuery = `
    SELECT collections.*, categories.name AS category
    FROM collections
    INNER JOIN categories ON collections.category_id = categories.id
    WHERE collections.id = ?`;
    db.query(getCollectionQuery, [req.body.coll_id], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        return res.json(data);        
    });
}

router.post('/mycollections', getMyColl)

router.post('/getcollection', getColl)

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
            console.log('deleted collection with id', id)
        })
        if (error) {break;}
    }
    if(!error) {getMyColl(req, res);} 
})

router.post('/create', (req, res) => {
    let {name, description, category, user_id, customNames} = req.body
    let values = [name, description, category, user_id]
    const oldInsertCollQuery = 'INSERT INTO collections (`name`, `description`, `category_id`, `user_id`) VALUES (?, ?, (SELECT id FROM categories WHERE name = ?), ?)'
    let queryFields = 'INSERT INTO collections (`name`, `description`, `category_id`, `user_id`'
    let queryValues = 'VALUES (?, ?, (SELECT id FROM categories WHERE name = ?), ?'
    console.log(customNames)
    for (let fieldType of Object.keys(customNames)) {
        console.log(fieldType)
        let dbFieldType = ''
        switch (fieldType) {
            case ('String'):
                dbFieldType = 'string'
                break
            case ('Integer'):
                dbFieldType = 'int'
                break
            case ('Multiline Text'):
                dbFieldType = 'text'
                break
            case ('Boolean Checkbox'):
                dbFieldType = 'checkbox'
                break
            case ('Date'):
                dbFieldType = 'date'
                break
        }
        console.log(dbFieldType)
        for (let i = 1; i <= customNames[fieldType].length; i++) {
            queryFields += ', ' + `custom_${dbFieldType}${i}_state, custom_${dbFieldType}${i}_name`
            queryValues += ', ' + `true, '${customNames[fieldType][i - 1]}'`
            // values.push('true')
            // values.push(customNames[fieldType][i - 1])
        }
    }
    queryFields += ') '
    queryValues += ')'
    const insertCollQuery = queryFields + queryValues

    db.query(insertCollQuery, values, (err, data) => {
        if (err) {
            console.log('Database error', err)
            return res.json('Error')
        }
        return res.json('Successfully created new collection')
    })
})

router.get('/categories', (req, res) => {
    const getCategsQuery = 'SELECT * FROM categories'
    db.query(getCategsQuery, (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        return res.json(data)
    })
})

module.exports = router;
