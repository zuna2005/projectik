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

module.exports = getTable;