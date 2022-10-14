const uuid = require('uuid')
const { Post } = require('../models')

const createPost = async (req, res) => {
  const id = uuid.v1()
  const { description } = req.body

  try {
    const post = await Post.create({
      id, description
    })

    res.send({
      status: 'Success',
      data: post
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

module.exports = { createPost }