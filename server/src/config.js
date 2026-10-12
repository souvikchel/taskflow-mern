export function getConfig(env = process.env) {
  const uri = env.MONGODB_URI?.trim()
  if (!uri) {
    throw new Error('MONGODB_URI is required. Set it in the server environment or server/.env.')
  }

  const port = Number(env.PORT || 5000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
  }

  const clientOrigins = (env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return { uri, port, clientOrigins }
}
