import mongoose from 'mongoose'

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [1, 'Title cannot be empty.'],
      maxlength: [120, 'Title cannot exceed 120 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
      default: '',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: String,
      default: '',
      validate: {
        validator(value) {
          if (value === '') return true
          if (typeof value !== 'string' || !dateOnlyPattern.test(value)) return false
          const date = new Date(`${value}T00:00:00.000Z`)
          return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
        },
        message: 'Due date must be a valid date in YYYY-MM-DD format.',
      },
    },
  },
  { timestamps: true, versionKey: false },
)

export default mongoose.models.Task || mongoose.model('Task', taskSchema)
