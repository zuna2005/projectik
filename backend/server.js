  const express = require('express')
 const mysql = require('mysql')
 const cors = require('cors')

 const app = express()
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Davron2009', 
    database: 'signup'
})

const getTable = (req, res) => {
    const getDataQuery = 'SELECT * FROM users'; 
    db.query(getDataQuery, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        return res.json(data); 
    })
}

app.post('/signup', (req, res) => {
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
            req.body.password
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

app.post('/login', (req, res) => {
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
                req.body.password
            ]
            db.query(checkPasswordQuery, values, (err, data) => {
                if(err) {
                    console.error('Database error:', err);
                    return res.json('Error')
                }
                if (data.length > 0) { 
                    updateLastLoginQuery = 'UPDATE users SET last_login = ? WHERE email = ?'
                    updateValues = [
                        req.body.lastLogin,
                        req.body.email
                    ]
                    db.query(updateLastLoginQuery, updateValues, (err, data) => {
                        if(err) {
                            console.error('Database error:', err);
                            return res.json('Error')
                        }
                        console.log('Last login updated');
                    })
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

app.get('/table', getTable)

app.post('/user', (req, res) => {
    const getDataQuery = 'SELECT * FROM users where email = ?'; 
    db.query(getDataQuery, [req.body.email], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.json('Error');
        }
        return res.json(data); 
    }) 
})

app.post('/changeStatus', (req, res) => {
    let error = false;
    for (id of req.body.ids) {
        const updateStateQuery = 'UPDATE users SET status = ? WHERE id = ?'
        db.query(updateStateQuery, [req.body.status, id], (err, data) => {
            if (err) {
                console.error('Database error:', err);
                error = true;
                return res.json('Error');
            }
        })
        if (error) {break;} 
    }
    if(!error) {getTable(req, res);} 
})

app.post('/delete', (req, res) => {
    let error = false;
    for (id of req.body.ids) {
        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteQuery, [id], (err, data) => {
            if (err) {
                console.error('Database error:', err);
                error = true;
                return res.json('Error');
            }
            console.log('Delete user with id', id)
        })
        if (error) {break;} 
    }
    if(!error) {getTable(req, res);} 
})

app.listen(8081, () => {
    console.log('listening')
})
