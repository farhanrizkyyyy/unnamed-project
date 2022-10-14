const { Role } = require('../models')

const createRole = async (req, res) => {
  const { name } = req.body

  try {
    const existingRole = await Role.findOne({ where: { name } })

    if (existingRole) {
      res.send({
        status: 'Error',
        message: 'Role already exist'
      })
    } else {
      const role = await Role.create({ name })

      res.send({
        status: 'Success',
        data: role
      })
    }
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll()

    res.send({
      status: 'Success',
      data: roles
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

module.exports = { createRole, getAllRoles }