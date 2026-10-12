import 'dotenv/config'
import mongoose from 'mongoose'
import { createApp } from './app.js'
import { getConfig } from './config.js'

let server

async function start() {
  const { uri, port, clientOrigins } = getConfig()
  await mongoose.connect(uri)
  server = createApp({ clientOrigins }).listen(port, () => {
    console.log(`TaskFlow API listening on port ${port}`)
  })
}

async function shutdown(signal) {
  console.log(`${signal} received; shutting down TaskFlow API.`)
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }
  await mongoose.disconnect()
}

process.once('SIGINT', () => shutdown('SIGINT').catch((error) => {
  console.error('Failed to shut down cleanly:', error)
  process.exitCode = 1
}))
process.once('SIGTERM', () => shutdown('SIGTERM').catch((error) => {
  console.error('Failed to shut down cleanly:', error)
  process.exitCode = 1
}))

start().catch((error) => {
  console.error('Failed to start TaskFlow API:', error.message)
  process.exitCode = 1
})
