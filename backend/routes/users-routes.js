const express = require('express')
const router = express.Router()
const db = require('../db/db')
const getHmac = require('../helpers/getHmac')

const getAllUsers = (req, res) => {
    const getAllQuery = 'SELECT * FROM users'
    db.query(getAllQuery, (err, data) => {
        if (err) {
            console.error('Database Error: ', err)
            return res.json('Error')
        }
        return res.json(data)
    })
}

router.get('/all', getAllUsers)

router.post('/change', (req, res) => {
    const {ids, field, status} = req.body
    let error = false
    const query = status == 'delete' ? 'DELETE FROM users WHERE id = ?' : `UPDATE users SET ${field} = ? WHERE id = ?`
    for (id of ids) {
        const data = status == 'delete' ? [id] : [status, id]
        db.query(query, data, (err, data) => {
            if (err) {
                console.error('Database error:', err);
                error = true;
                return res.json('Error');
            }
        })
        if (error) {break;}
    }
    if(!error) {getAllUsers(req, res);} 
})

router.post('/signup', (req, res) => {
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [req.body.email], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        if (data.length > 0) {
            console.log('Email match', data)
            return res.json('Email exists');
        }

        const insertUserQuery  = 'INSERT INTO users (`name`, `email`,`password`) VALUES (?, ?, ?)'
        const values = [
            req.body.name,
            req.body.email,
            getHmac(req.body.password)
        ]
        db.query(insertUserQuery, values, (err, data) => {
            if(err) {
                console.error('Database error:', err);
                return res.json('Error')
            }
            db.query(checkEmailQuery, [req.body.email], (err, data) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.json('Error');
                }
                return res.json(data[0]);
            })
        })
    })
})

router.post('/login', (req, res) => {
    console.log(db);
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [req.body.email], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        if (data.length > 0) {
            console.log('Email found', data)
            const checkPasswordQuery = 'SELECT * FROM users WHERE `email` = ? AND `password` = ?'
            const values = [
                req.body.email,
                getHmac(req.body.password)
            ]
            db.query(checkPasswordQuery, values, (err, data) => {
                if(err) {
                    console.error('Database error:', err);
                    return res.json('Error')
                }
                if (data.length > 0) {
                    return res.status(200).json(data[0])
                } else {
                    return res.status(400).json('Incorrect password')
                }
            })            
        } else {
            console.log('Email not found', data)
            return res.status(400).json('Incorrect email')
        }
    })    
})

router.post('/user', (req, res) => {
    const getDataQuery = 'SELECT * FROM users where id = ?'; 
    db.query(getDataQuery, [req.body.id], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        return res.json(data); 
    }) 
})  

module.exports = router