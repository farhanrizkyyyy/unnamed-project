const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    res.send({
      status: 'Error',
      message: 'Token is required'
    })
  }

  try {
    const decoded = jwt.verify(token, 'value')
    req.user = decoded
  } catch (error) {
    res.send(error)
  }

  return next()
}

module.exports = { verifyToken }