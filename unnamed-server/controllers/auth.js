const jwt = require('jsonwebtoken')
const md5 = require('md5')
const { User } = require('../models')

const signIn = async (req, res) => {
  const { username, password } = req.body
  const encryptedPassword = md5(password)

  if (!(username && password)) {
    res.send({
      status: 'Error',
      message: 'All input is required'
    })
  }

  try {
    const user = await User.findOne({
      where: { username: username }
    })

    if (!user) {
      res.send({
        status: 'Error',
        message: 'Username have not been registered'
      })
    }

    if (encryptedPassword !== user.password) {
      res.send({
        status: 'Error',
        message: 'Password is invalid'
      })
    }

    const token = jwt.sign(
      { username: username },
      process.env.TOKEN_KEY || 'value',
      { expiresIn: '2h' }
    )

    user.token = token

    await User.update(
      { token: token },
      {
        where: { id: user.id },
        returning: true
      }
    )

    res.send({
      status: 'Success',
      data: user
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

const signOut = async (req, res) => {

}

module.exports = { signIn, signOut }