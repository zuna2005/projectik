const express = require('express')
const router = express.Router()
const db = require('../db/db')
const { searchItems, searchTags } = require('../helpers/search')

const getCollItems = (req, res) => {
    const getCollItemsQuery = 'SELECT * FROM items WHERE collection_id = ?'
    db.query(getCollItemsQuery, [req.body.coll_id], (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        return res.json(data)
    })
}
const getItem = (req, res) => {
    const getItemQuery = 'SELECT * FROM items WHERE id = ?'
    db.query(getItemQuery, [req.body.item_id], (err, data) => {
        if (err) {
            console.log('Database error: ', err)
            return res.json('Error')
        }
        return res.json(data)
    })
}

router.post('/getByColl', getCollItems)

router.post('/getById', getItem)

router.get('/getAll', (req, res) => {
    const getAllQuery = `SELECT i.id, i.name, u.name AS user_name, c.name AS collection_name
    FROM items i
    JOIN users u ON i.user_id = u.id
    JOIN collections c ON i.collection_id = c.id
    ORDER BY i.id DESC
    `
    db.query(getAllQuery, (err, data) => {
        if (err) {
            console.log('Database error: ', err)
            return res.json('Error')
        }
        return res.json(data)
    })
})

router.post('/search', (req, res) => {
    const { query } = req.body
    const getAllQuery = `
    SELECT 
        i.*, 
        u.name AS user_name, 
        c.name AS collection_name,
        GROUP_CONCAT(t.name) AS tags_names -- Concatenate tag names
    FROM 
        items i
    JOIN 
        users u ON i.user_id = u.id
    JOIN 
        collections c ON i.collection_id = c.id
    LEFT JOIN 
        tags t ON FIND_IN_SET(t.id, i.tags) -- Search for tag IDs within the comma-separated list
    GROUP BY 
        i.id
    `
    db.query(getAllQuery, (err, data) => {
        if (err) {
            console.log('Database error: ', err)
            return res.json('Error')
        }
        if (query.startsWith('#')) {
            return res.json(searchTags(data, query))
        }
        return res.json(searchItems(data, query))
    })
})

router.post('/create', (req, res) => {
    let queryFields = 'INSERT INTO items ('
    let queryValues = 'VALUES ('
    for (let key of Object.keys(req.body)) {
        if (queryFields.endsWith('(')) {
            queryFields += key
            queryValues += '?'
        }
        else {
            queryFields += ', ' + key
            queryValues += ', ?'
        }
    }
    queryFields += ') '
    queryValues += ')'
    db.query(queryFields + queryValues, Object.values(req.body), (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        return res.json(data.insertId)
    })
})

router.post('/update', (req, res) => {
    let query = 'UPDATE items SET '
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
        return res.json('item updated')
    })
})

router.post('/deleteColl', (req, res) => {
    const deleteCollItemsQuery = 'DELETE FROM items WHERE collection_id = ?'
    for (id of req.body.ids) {
        db.query(deleteCollItemsQuery, id, (err, data) => {
            if (err) {
                console.error('Database error:', err);
                error = true;
                return res.json('Error');
            }
        })
    }
    return res.json('Successfully deleted items of collections') 
})

router.post('/delete', (req, res) => {
    let error = false;
    const deleteQuery = 'DELETE FROM items WHERE id = ?'
    for (id of req.body.ids) {
        db.query(deleteQuery, id, (err, data) => {
            if (err) {
                console.error('Database error:', err);
                error = true;
                return res.json('Error');
            }
            console.log('deleted item with id', id)
        })
        if (error) {break;}
    }
    if (!error) {getCollItems(req, res)}
})

router.post('/like', (req, res) => {
    const {item_id, user_id, like} = req.body
    const oldLikesQuery = 'SELECT likes FROM items WHERE id = ?'
    db.query(oldLikesQuery, [item_id], (err, data) => {
        if (err) {
            console.log('Database error:', err)
            return res.json('Error')
        }
        const oldLikes = data[0].likes
        let newLikes = ''
        if (like){
            newLikes = oldLikes == '' ? user_id : `${oldLikes},${user_id}`
        }
        else {
            newLikes = oldLikes.split(',').filter(val => val != user_id).join(',')
        }
        const updateLikesQuery = 'UPDATE items SET likes = ? WHERE id = ?'
        db.query(updateLikesQuery, [newLikes, item_id], (err, data) => {
            if (err) {
                console.log('Database error', err)
                return res.json('Error')
            }
            getItem(req, res)
        })
    })
})

router.post('/deleteCustomField', (req, res) => {
    const { field, coll_id } = req.body
    let query = `UPDATE items SET ${field}state = ?, ${field}value = ? WHERE collection_id = ?`
    db.query(query, [false, null, coll_id], (err, data) => {
        if (err) {
            console.error('Database error', err)
            return res.json('deleteCustomField error')
        }
        return res.json(`Custom field ${field} deleted from items`)
    })
})

module.exports = router;
