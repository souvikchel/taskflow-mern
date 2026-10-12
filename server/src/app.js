import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import Task from './models/Task.js'
import { validateTaskInput } from './validation.js'

const objectIdPattern = /^[a-f\d]{24}$/i

function sendError(res, status, message) {
  return res.status(status).json({ error: message })
}

export function createApp({ TaskModel = Task, clientOrigins = ['http://localhost:5173'] } = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || clientOrigins.includes(origin)) return callback(null, true)
        return callback(new Error('Origin is not allowed by CORS.'))
      },
    }),
  )
  app.use(express.json({ limit: '32kb' }))

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    })
  })

  app.get('/api/tasks', async (_req, res, next) => {
    try {
      const tasks = await TaskModel.find().sort({ createdAt: -1 })
      res.status(200).json({ tasks })
    } catch (error) {
      next(error)
    }
  })

  app.post('/api/tasks', async (req, res, next) => {
    const validation = validateTaskInput(req.body)
    if (validation.error) return sendError(res, 400, validation.error)

    try {
      const task = await TaskModel.create(validation.value)
      return res.status(201).json({ task })
    } catch (error) {
      return next(error)
    }
  })

  app.get('/api/tasks/:id', async (req, res, next) => {
    if (!objectIdPattern.test(req.params.id)) return sendError(res, 400, 'Task ID is invalid.')

    try {
      const task = await TaskModel.findById(req.params.id)
      if (!task) return sendError(res, 404, 'Task not found.')
      return res.status(200).json({ task })
    } catch (error) {
      return next(error)
    }
  })

  app.put('/api/tasks/:id', async (req, res, next) => {
    if (!objectIdPattern.test(req.params.id)) return sendError(res, 400, 'Task ID is invalid.')
    const validation = validateTaskInput(req.body, { partial: true })
    if (validation.error) return sendError(res, 400, validation.error)

    try {
      const task = await TaskModel.findByIdAndUpdate(req.params.id, validation.value, {
        new: true,
        runValidators: true,
      })
      if (!task) return sendError(res, 404, 'Task not found.')
      return res.status(200).json({ task })
    } catch (error) {
      return next(error)
    }
  })

  app.delete('/api/tasks/:id', async (req, res, next) => {
    if (!objectIdPattern.test(req.params.id)) return sendError(res, 400, 'Task ID is invalid.')

    try {
      const task = await TaskModel.findByIdAndDelete(req.params.id)
      if (!task) return sendError(res, 404, 'Task not found.')
      return res.status(204).end()
    } catch (error) {
      return next(error)
    }
  })

  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed') {
      return sendError(res, 400, 'Request body contains invalid JSON.')
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return sendError(res, 400, error.message)
    }
    if (error.message === 'Origin is not allowed by CORS.') {
      return sendError(res, 403, error.message)
    }
    console.error('Unhandled API error:', error)
    return sendError(res, 500, 'An unexpected server error occurred.')
  })

  return app
}
