const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    favorites: 1,
  })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const user = await User.findById(id)

  if (user) {
    response.status(200).json(user)
  }
})

usersRouter.post('/', async (request, response) => {
  const { username, name, lastname, password } = request.body

  const minLengthPassword = 8

  if (password.length < minLengthPassword) {
    return response
      .status(400)
      .json({
        error: `The password is not long enough, you need at least ${minLengthPassword} characters`,
      })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    lastname,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter
