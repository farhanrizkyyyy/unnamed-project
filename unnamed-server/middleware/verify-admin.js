const { User } = require('./../models')

const verifyAdmin = async (req, res) => {
  const token = req.headers['x-access-token']
  const user = await User.findOne({
    where: { token: token }
  })

  return user
}

module.exports = { verifyAdmin }