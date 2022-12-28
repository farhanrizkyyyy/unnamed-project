const { Post, User, sequelize, Sequelize } = require('../models')
const uuid = require('uuid')

const createPost = async (req, res) => {
  const id = uuid.v4()
  const token = req.headers['x-access-token']
  const { description, lat, long } = req.body
  const dateNow = Sequelize.NOW

  const user = await User.findOne({
    where: { token: token },
    returning: true
  })

  if (!user) {
    res.send({
      status: 'Error',
      message: 'Sign in is required to create a post'
    })
  }

  const query = `INSERT INTO posts VALUES(
    '${id}', '${description}', ST_GeomFromText('POINT(${long} ${lat})', 4326),
    '${dateNow}', '${dateNow}', '${user.id}'
    ) RETURNING *`

  try {
    const post = await sequelize.query(query)

    res.send({
      status: 'Success',
      data: post[0][0]
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

const getPostById = async (req, res) => {
  try {
    const id = req.query.id
    const post = await Post.findOne({
      where: { id }
    })

    if (!post) {
      res.send({
        status: 'Error',
        message: 'Post not found'
      })
    }

    res.send({
      status: 'Success',
      data: post
    })
  } catch (error) {

  }
}

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.findAll()

    res.send({
      status: 'Success',
      data: posts
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

const deletePost = async (req, res) => {
  const id = req.query.id
  const token = req.headers['x-access-token']

  try {
    const user = await User.findOne({
      where: { token: token }
    })

    if (!user) {
      res.send({
        status: 'Error',
        message: `Token doesn't match`
      })
    }

    const post = await Post.destroy({
      where: {
        id: id,
        user_id: user.id
      }
    })

    if (!post) {
      res.send({
        status: 'Error',
        message: `Cannot find post with ID ${id} by username ${user.username}`
      })
    } else {
      res.send({
        status: 'Success',
        message: 'Post successfully deleted'
      })
    }

  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

const updatePost = async (req, res) => {
  const id = req.query.id
  const { description, lat, long } = req.body
  const token = req.headers['x-access-token']

  try {
    const post = await Post.findOne({
      where: { id: id }
    })

    if (!post) {
      res.send({
        status: 'Error',
        message: `Cannot find post with id ${id}`
      })
    }

    const user = await User.findOne({
      where: { token: token },
      returning: true
    })

    if (!(id && description && lat && long)) {
      res.send({
        status: 'Error',
        message: 'All input is required'
      })
    }

    const query = `UPDATE posts SET 
      description = '${description}',
      coordinate = ST_GeomFromText('POINT(${long} ${lat})', 4326)
      WHERE id = '${id}' AND user_id = '${user.id}'
      RETURNING *
    `

    const updatedPost = await sequelize.query(query)

    res.send({
      status: 'Success',
      data: updatedPost[0][0]
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

module.exports = { createPost, getAllPost, deletePost, updatePost, getPostById }