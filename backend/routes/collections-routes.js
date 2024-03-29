const express = require('express')
const router = express.Router()
const db = require('../db/db')
const { searchCollections } = require('../helpers/search')

const getMyColl = (req, res) => {
    const getCollectionsQuery = `
        SELECT c.id, c.name AS collection_name, c.description, cat.name AS category_name, c.items_count
        FROM collections c
        INNER JOIN categories cat ON c.category_id = cat.id
        WHERE c.user_id = ?`
    
    db.query(getCollectionsQuery, [req.body.user_id], (err, data) => {
        if (err) {
            console.error('Database error:', err)
            return res.json('Error')
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

router.get('/top5', (req, res) => {
    const getTop5Query = `SELECT c.id, c.name, c.description, u.name AS user_name, cat.name AS category_name, c.items_count
    FROM collections c
    JOIN users u ON c.user_id = u.id
    JOIN categories cat ON c.category_id = cat.id
    ORDER BY c.items_count DESC
    LIMIT 5;
    `
    db.query(getTop5Query, (err, data) => {
        if (err) {
            console.error('Database error: ', err)
            return res.json('Error')
        }
        return res.json(data)
    })
})

router.post('/search', (req, res) => {
    const { query } = req.body
    const getAllQuery = `SELECT c.*, u.name AS user_name, cat.name AS category_name
    FROM collections c
    JOIN users u ON c.user_id = u.id
    JOIN categories cat ON c.category_id = cat.id
    `
    db.query(getAllQuery, (err, data) => {
        if (err) {
            console.error('Database error: ', err)
            return res.json('Error')
        }
        if (query.startsWith('#')) {
            return res.json([])
        }
        return res.json(searchCollections(data, query))
    })
})

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
    let queryFields = 'INSERT INTO collections (`name`, `description`, `category_id`, `user_id`'
    let queryValues = 'VALUES (?, ?, (SELECT id FROM categories WHERE name = ?), ?'
    for (let fieldType of Object.keys(customNames)) {
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
        for (let i = 1; i <= customNames[fieldType].length; i++) {
            queryFields += ', ' + `custom_${dbFieldType}${i}_state, custom_${dbFieldType}${i}_name`
            queryValues += ', ' + `true, '${customNames[fieldType][i - 1]}'`
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

router.post('/items-count', (req, res) => {
    const {coll_id, change} = req.body
    const oldItemsQuery = 'SELECT items_count FROM collections WHERE id = ?'
    db.query(oldItemsQuery, [coll_id], (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        const newItems = data[0].items_count + change
        const updateItemsQuery = 'UPDATE collections SET items_count = ? WHERE id = ?'
        db.query(updateItemsQuery, [newItems, coll_id], (err, data) => {
            if (err) {
                console.log('Database error:', err)
                return res.json('Error')
            }
            return res.json(`Item count changed by ${change}`)
        })
    })
})

router.post('/deleteCustomField', (req, res) => {
    const { field, coll_id } = req.body
    let query = `UPDATE collections SET ${field}state = ?, ${field}name = ? WHERE id = ?`
    db.query(query, [false, null, coll_id], (err, data) => {
        if (err) {
            console.error('Database error', err)
            return res.json('deleteCustomField error')
        }
        return res.json(`Custom field ${field} deleted from collections`)
    })
})

router.post('/update', (req, res) => {
    let query = 'UPDATE collections SET '
    let keys = Object.keys(req.body)
    for (let key of keys.slice(0, keys.length - 1)) {
        query += query.endsWith('SET ') ? `${key} = ?` : `, ${key} = ?`
    }
    query += ' WHERE id = ?'
    db.query(query, Object.values(req.body), (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        return res.json(`collection with id ${req.body.coll_id} updated`)
    })
})

module.exports = router;
