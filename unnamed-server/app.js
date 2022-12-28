const app = require('express')()
const bodyParser = require('body-parser')
const { sequelize } = require('./models')
const cors = require('cors')
const userController = require('./controllers/user')
const roleController = require('./controllers/role')
const postController = require('./controllers/post')
const authController = require('./controllers/auth')
const routeController = require('./controllers/route')
const authMiddleware = require('./middleware/verify-token')

const PORT = process.env.PORT || 3100

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Still an unnamed project')
})

//Auth
app.post('/api/sign-up', userController.createUser)
app.post('/api/sign-in', authController.signIn)
app.post('/api/sign-out', authController.signOut)

//User
app.get('/api/user', userController.getAllUser)
app.get('/api/user/:username', userController.getUserByUsername)

//Role
app.post('/api/role', roleController.createRole)
app.get('/api/role', authMiddleware.verifyToken, roleController.getAllRoles)

//Route
app.post('/api/route/create', routeController.createRoute)

//Post
app.get('/api/posts', postController.getAllPost)
app.get('/api/post', postController.getPostById)
app.post('/api/post/create', authMiddleware.verifyToken, postController.createPost)
app.delete('/api/post/delete', authMiddleware.verifyToken, postController.deletePost)
app.put('/api/post/update', authMiddleware.verifyToken, postController.updatePost)

app.listen(PORT, async () => {
  // await sequelize.sync({ alter: true })
  console.log(`App is running on http://localhost:${PORT}`)
})