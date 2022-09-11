const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
    lastname: 1,
  })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  if (
    authorization &&
    authorization.toLowerCase().startsWith('bearer ')
  ) {
    return authorization.substring(7)
  }

  return null
}

const verifyUser = async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, config.SECRET)

  if (!token || !decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'Token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  return user
}

notesRouter.post('/', async (request, response) => {
  const { content } = request.body
  const user = await verifyUser(request, response)

  const note = new Note({
    content,
    date: new Date(),
    user: user._id,
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote)
  await user.save()

  const populateNote = await savedNote.populate('user', {
    username: 1,
    name: 1,
    lastname: 1,
  })

  response.json(populateNote)
})

notesRouter.put('/:id', async (request, response, next) => {
  const user = await verifyUser(request, response)

  const id = request.params.id
  const note = await Note.findById(id)

  const isFavorite = note.favorites.includes(user._id)

  if (isFavorite) {
    const newFavorites = note.favorites.filter(
      userId => JSON.stringify(userId) !== JSON.stringify(user._id)
    )

    const newUserFavoriteNotes = user.favoriteNotes.filter(note => {
      return note !== id
    })

    note.favorites = newFavorites
    user.favoriteNotes = newUserFavoriteNotes
  } else {
    note.favorites = [...note.favorites, user._id]
    user.favoriteNotes = [...user.favoriteNotes, id]
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, note, {
      new: true,
    }).populate('user', { username: 1, name: 1, lastname: 1 })

    await user.save()

    response.json(updatedNote)
  } catch (exception) {
    next(exception)
  }
})

module.exports = notesRouter
