const app = require('express')()
const bodyParser = require('body-parser')
const { sequelize } = require('./models')
const userController = require('./controllers/user')
const roleController = require('./controllers/role')
const postController = require('./controllers/post')

const PORT = process.env.PORT || 3100

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/api', (req, res) => {
  res.send('Still an unnamed project')
})

//Auth
app.post('/api/sign-up', userController.createUser)

//User
app.get('/api/user', userController.getAllUser)
app.get('/api/user/:username', userController.getUserByUsername)

//Role
app.post('/api/role', roleController.createRole)
app.get('/api/role', roleController.getAllRoles)

//Post
app.post('/api/posts', postController.createPost)

app.listen(PORT, async () => {
  // await sequelize.sync({ alter: true, force: true })
  console.log(`App is running on http://localhost:${PORT}`)
})