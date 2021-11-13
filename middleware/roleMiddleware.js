const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next()
    }

    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(400).json({ message: 'Token not found!' })
      }
      const { roles: UserRoles } = jwt.verify(token, JWT_KEY)
      let hasRoles = false
      UserRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRoles = true
        }
      })
      if (!hasRoles) {
        return res.status(400).json({ message: 'Not allowed for this role!' })
      }
      next()
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'User is not signed in!' })
    }
  }
}
