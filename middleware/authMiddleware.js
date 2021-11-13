const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../config')

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(400).json({ message: 'Token not found!' })
    }
    req.user = jwt.verify(token, JWT_KEY)
    next()
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'User is not signed in!' })
  }
}
