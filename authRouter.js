const Router = require('express')
const router = new Router()
const { check } = require('express-validator')

const controller = require('./authController')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
  check('username', 'Username field is not valid!').notEmpty(),
  check('password', 'Password field is not valid!').isLength({ min: 4, max: 12 }),
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware('ADMIN'), controller.getUsers)

module.exports = router
