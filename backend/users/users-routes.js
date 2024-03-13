const express = require('express')
const router = express.Router()
const db = require('../db/db')
const getHmac = require('./getHmac')


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
        //const {email , name , password} = req.body
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
            console.log('Inserted data:', data);
            return res.json(data);
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
                    return res.json('Success')
                } else {
                    return res.json('Incorrect password')
                }
            })            
        } else {
            console.log('Email not found', data)

            return res.json('Incorrect email')
        }
    })    
})

router.post('/user', (req, res) => {
    const getDataQuery = 'SELECT * FROM users where email = ?'; 
    db.query(getDataQuery, [req.body.email], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        return res.json(data); 
    }) 
})

// router.post('/change', (req, res) => {
//     let error = false;
//     const getDataQuery = 'SELECT * FROM users where id = ?'; 
//     db.query(getDataQuery, [req.body.userid], (err, data) => {
//         if (data.length && data[0].status === 'Active') {
//             const deleteQuery = 'DELETE FROM users WHERE id = ?'
//             const updateStateQuery = 'UPDATE users SET status = ? WHERE id = ?'
//             console.log((req.body.status === 'Delete' ? deleteQuery : updateStateQuery))
//             const changeQuery = (req.body.status === 'Delete' ? deleteQuery : updateStateQuery)
//             for (id of req.body.ids) {
//                 const queryData = (req.body.status === 'Delete' ? [id] : [req.body.status, id])
//                 db.query(changeQuery, queryData, (err, data) => {
//                     if (err) {
//                         console.error('Database error:', err);
//                         error = true;
//                         return res.json('Error');
//                     }
//                 })
//                 if (error) {break;} 
//             }
//             if(!error) {getTable(req, res);} 
//         }
//         else {
//             return res.status(404).send({message: 'user error'})
//         }
//     })
    
// })

module.exports = router