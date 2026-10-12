import assert from 'node:assert/strict'
import test from 'node:test'
import { createTask } from '../src/taskCreation.js'

test('a successful create response inserts the returned task without a list refetch', async () => {
  const apiTask = {
    _id: 'task-123',
    title: 'Write regression test',
    description: 'Verify immediate task visibility.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-10-12',
  }
  const existingTask = { id: 'task-123', title: 'Earlier copy' }
  let tasks = [existingTask]
  let postCalls = 0
  let getCalls = 0
  const api = {
    async post(path, payload) {
      postCalls += 1
      assert.equal(path, '/tasks')
      assert.equal(payload.title, apiTask.title)
      return { data: { task: apiTask } }
    },
    async get() {
      getCalls += 1
      throw new Error('Task creation should not refetch the list.')
    },
  }
  const setTasks = (update) => {
    tasks = typeof update === 'function' ? update(tasks) : update
  }

  const createdTask = await createTask(api, { title: apiTask.title }, setTasks)

  assert.equal(postCalls, 1)
  assert.equal(getCalls, 0)
  assert.equal(createdTask.id, apiTask._id)
  assert.equal(tasks.length, 1)
  assert.equal(tasks[0].title, apiTask.title)
})
