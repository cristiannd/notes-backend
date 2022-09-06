const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await Note.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'usertest',
    name: 'Test',
    passwordHash: 'test123',
  }

  const savedUser = await api.post('/api/users').send(newUser)

  const credentials = {
    username: 'usertest',
    password: 'test123',
  }

  const loggedUser = await api.post('/api/login').send(credentials)
  const { token } = loggedUser.body

  const newNote = {
    content: 'Nota creada desde Postman',
    important: true,
    userId: savedUser.id,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .set('Authorization', `bearer ${token}`)
})

afterAll(() => {
  mongoose.connection.close()
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with status code 404 if note deos not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api.get(`/api/notes/${validNonExistingId}`).expect(404)
  })

  test('fails with status code 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/notes/${invalidId}`).expect(400)
  })
})

describe('addition of a new note', () => {
  test.only('succeeds with valid data', async () => {
    const credentials = {
      username: 'usertest',
      password: 'test123',
    }

    const loggedUser = await api.post('/api/login').send(credentials)
    const { token } = loggedUser.body

    const newNote = {
      content: 'Nota creada desde Postman',
      important: true,
      userId: savedUser.id,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .set('Authorization', `bearer ${token}`)

    // const res = await api
    //   .post('/api/login')
    //   .send(credentials)

    // console.log(res)

    // const newNote = {
    //   content: 'async/await simplifies making async calls',
    //   important: true,
    // }

    // await api
    //   .post('/api/notes')
    //   .send(newNote)
    //   .expect(200)
    //   .expect('Content-Type', /application\/json/)

    // const notesAtEnd = await helper.notesInDb()
    // expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    // const contents = notesAtEnd.map(n => n.content)
    // expect(contents).toContain('async/await simplifies making async calls')
  })

  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true,
    }

    await api.post('/api/notes').send(newNote).expect(400)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({
      username: 'root',
      passwordHash,
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'cristiannd',
      name: 'Cristian Donalicio',
      password: 'test123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /aplication\/json/)

    const usersAtEnd = await helper.usersInDb
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.initialNotes

    const newUser = {
      username: 'root',
      name: 'Repeated Username',
      password: 'test123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
