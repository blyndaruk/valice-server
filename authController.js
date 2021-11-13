const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const User = require('./models/User')
const Role = require('./models/Role')
const { JWT_KEY } = require('./config')

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const generateAccessToken = (id, roles) => {
  const payload = { id, roles }
  return jwt.sign(payload, JWT_KEY, { expiresIn: '24h' })
}


class AuthController {
  async registration (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Errors on registration', errors })
      }
      const { username, password } = req.body
      const candidate = await User.findOne({ username })
      if (candidate) {
        return res.status(400).json({ message: `User with name ${username} already exists` })
      }
      const hashPassword = bcrypt.hashSync(password, salt)
      const userRole = await Role.findOne({ value: 'USER' })
      const user = new User({ username, password: hashPassword, roles: [userRole.value] })
      await user.save()
      return res.json({ message: `User with username ${username} registered` })
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration Error' })
    }
  }

  async login (req, res) {
    try {
      // console.log(req.body);
      // console.log(req.query);
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ message: `User with username ${username} not found!` })
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: 'Password not valid!' })
      }

      const token = generateAccessToken(user._id, user.roles)
      return res.json({ token })
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login Error' })
    }
  }

  async getUsers (req, res) {
    try {
      // TODO: move to separate logic/model (maybe create via some admin panel)
      // const userRole = new Role()
      // const adminRole = new Role({ value: 'ADMIN' })
      // await userRole.save();
      // await adminRole.save();

      const users = await User.find()
      res.json(users)
    } catch (e) {
      res.json('not works')

    }
  }
}

module.exports = new AuthController()
