const crypto = require('crypto')

function getHmac(password) {
    let myHmac = crypto.createHmac("sha256", process.env.HMAC_KEY)
    myHmac.update(password)
    return myHmac.digest('hex')
}

module.exports = getHmac