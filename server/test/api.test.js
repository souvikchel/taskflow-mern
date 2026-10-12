import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { createApp } from '../src/app.js'
import Task from '../src/models/Task.js'

let mongoServer
let app

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
  app = createApp()
})

after(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

test('health endpoint reports service and database status', async () => {
  const response = await request(app).get('/api/health').expect(200)
  assert.deepEqual(response.body, { status: 'ok', database: 'connected' })
})

test('creates and lists validated tasks with timestamps', async () => {
  const created = await request(app)
    .post('/api/tasks')
    .send({
      title: '  Ship task API  ',
      description: 'CRUD implementation',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-10-20',
    })
    .expect(201)

  assert.equal(created.body.task.title, 'Ship task API')
  assert.equal(created.body.task.status, 'in-progress')
  assert.ok(created.body.task.createdAt)
  assert.ok(created.body.task.updatedAt)

  const listed = await request(app).get('/api/tasks').expect(200)
  assert.equal(listed.body.tasks.length, 1)
  assert.equal(listed.body.tasks[0]._id, created.body.task._id)
})

test('reads, updates, and deletes an existing task', async () => {
  const task = await Task.create({ title: 'Review API' })
  const id = task.id

  const read = await request(app).get(`/api/tasks/${id}`).expect(200)
  assert.equal(read.body.task.title, 'Review API')

  const updated = await request(app)
    .put(`/api/tasks/${id}`)
    .send({ status: 'done', priority: 'low' })
    .expect(200)
  assert.equal(updated.body.task.status, 'done')
  assert.equal(updated.body.task.priority, 'low')

  await request(app).delete(`/api/tasks/${id}`).expect(204)
  await request(app).get(`/api/tasks/${id}`).expect(404)
})

test('rejects invalid task input, unknown fields, and malformed IDs', async () => {
  const missingTitle = await request(app)
    .post('/api/tasks')
    .send({ description: 'No title' })
    .expect(400)
  assert.match(missingTitle.body.error, /Title is required/)

  const badDate = await request(app)
    .post('/api/tasks')
    .send({ title: 'Bad date', dueDate: '2026-02-30' })
    .expect(400)
  assert.match(badDate.body.error, /valid date/)

  const unknownField = await request(app)
    .post('/api/tasks')
    .send({ title: 'Unexpected', owner: 'someone' })
    .expect(400)
  assert.match(unknownField.body.error, /Unknown task field/)

  await request(app).get('/api/tasks/not-an-id').expect(400)
})

test('rejects missing task IDs and invalid JSON with useful responses', async () => {
  const missing = await request(app)
    .put(`/api/tasks/${new mongoose.Types.ObjectId()}`)
    .send({ title: 'Missing task' })
    .expect(404)
  assert.equal(missing.body.error, 'Task not found.')

  const invalidJson = await request(app)
    .post('/api/tasks')
    .set('Content-Type', 'application/json')
    .send('{"title":')
    .expect(400)
  assert.match(invalidJson.body.error, /invalid JSON/i)
})
