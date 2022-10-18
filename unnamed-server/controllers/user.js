const md5 = require('md5')
const jwt = require('jsonwebtoken')
const { User, sequelize } = require('../models')

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll()

    res.send({
      status: 'Success',
      data: users
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

const getUserByUsername = async (req, res) => {
  const username = req.params.username

  try {
    const user = await User.findOne({
      where: { username: username }
    })

    if (user) {
      res.send({
        status: 'Success',
        data: user
      })
    } else {
      res.send({
        status: 'Error',
        message: 'Username does not exist'
      })
    }
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

const createUser = async (req, res) => {
  const { username, password, name, phone_number, address, role_id } = req.body
  const encryptedPassword = md5(password)
  const lowerCasedUsername = username.toLowerCase()

  const token = jwt.sign(
    { username: username },
    process.env.TOKEN_KEY || 'value',
    { expiresIn: "2h" }
  )

  if (!(username && password && name && phone_number && address)) {
    res.send({
      status: 'Error',
      message: 'All input is required'
    })
  }

  try {
    const existingUser = await User.findOne({
      where: { username: username }
    })

    if (existingUser) {
      res.send({
        status: 'Error',
        message: 'Username already exist'
      })
    } else {
      const user = await User.create({
        username: lowerCasedUsername,
        password: encryptedPassword,
        name, phone_number, address, token,
        role_id: role_id || 2
      })
      res.send({
        status: 'Success',
        data: user
      })
    }
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

module.exports = { getAllUser, createUser, getUserByUsername }