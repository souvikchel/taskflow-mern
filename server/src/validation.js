const allowedFields = new Set(['title', 'description', 'status', 'priority', 'dueDate'])
const statuses = new Set(['todo', 'in-progress', 'done'])
const priorities = new Set(['low', 'medium', 'high'])
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/

function isDateOnly(value) {
  if (value === '') return true
  if (typeof value !== 'string' || !dateOnlyPattern.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export function validateTaskInput(input, { partial = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Request body must be a JSON object.' }
  }

  const fields = Object.keys(input)
  const unknown = fields.filter((field) => !allowedFields.has(field))
  if (unknown.length) {
    return { error: `Unknown task field${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}.` }
  }
  if (fields.length === 0) return { error: 'Provide at least one task field.' }
  if (!partial && (!Object.hasOwn(input, 'title') || !input.title?.trim())) {
    return { error: 'Title is required and cannot be empty.' }
  }

  const normalized = {}
  for (const [field, value] of Object.entries(input)) {
    switch (field) {
      case 'title':
        if (typeof value !== 'string' || !value.trim()) {
          return { error: 'Title is required and cannot be empty.' }
        }
        if (value.trim().length > 120) return { error: 'Title cannot exceed 120 characters.' }
        normalized.title = value.trim()
        break
      case 'description':
        if (typeof value !== 'string') return { error: 'Description must be a string.' }
        if (value.trim().length > 500) {
          return { error: 'Description cannot exceed 500 characters.' }
        }
        normalized.description = value.trim()
        break
      case 'status':
        if (!statuses.has(value)) return { error: 'Status must be todo, in-progress, or done.' }
        normalized.status = value
        break
      case 'priority':
        if (!priorities.has(value)) return { error: 'Priority must be low, medium, or high.' }
        normalized.priority = value
        break
      case 'dueDate':
        if (!isDateOnly(value)) {
          return { error: 'Due date must be a valid date in YYYY-MM-DD format.' }
        }
        normalized.dueDate = value
        break
      default:
        return { error: `Unsupported task field: ${field}.` }
    }
  }

  return { value: normalized }
}
