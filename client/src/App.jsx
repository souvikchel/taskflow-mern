import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'taskflow.tasks'

const starterTasks = [
  {
    id: 'task-1',
    title: 'Map out the new onboarding flow',
    description: 'Outline each step from sign-up to the first successful project.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-10-14',
  },
  {
    id: 'task-2',
    title: 'Review Q4 campaign concepts',
    description: 'Share feedback with the marketing team before the next review.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-10-16',
  },
  {
    id: 'task-3',
    title: 'Update the component library',
    description: 'Document the latest button and form field variants.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-10-19',
  },
  {
    id: 'task-4',
    title: 'Send project handoff notes',
    description: 'Collect decisions and links for the engineering handoff.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-10-11',
  },
]

const emptyTask = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
}

const statusLabels = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

function isTaskList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (task) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.description === 'string' &&
        ['todo', 'in-progress', 'done'].includes(task.status) &&
        ['low', 'medium', 'high'].includes(task.priority) &&
        typeof task.dueDate === 'string',
    )
  )
}

function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyTask)

  useEffect(() => {
    const loadTimeout = window.setTimeout(() => {
      try {
        const storedTasks = window.localStorage.getItem(STORAGE_KEY)
        const initialTasks = storedTasks === null ? starterTasks : JSON.parse(storedTasks)
        if (!isTaskList(initialTasks)) {
          throw new Error('Saved task data is not in the expected format.')
        }
        setTasks(initialTasks)
      } catch (loadError) {
        setError(
          `Tasks could not be loaded from this browser. ${
            loadError instanceof Error ? loadError.message : 'Please check browser storage.'
          }`,
        )
      } finally {
        setIsLoading(false)
      }
    }, 0)
    return () => window.clearTimeout(loadTimeout)
  }, [])

  function saveTasks(updatedTasks) {
    setTasks(updatedTasks)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      setError('')
    } catch (saveError) {
      setError(
        `Changes could not be saved to this browser. ${
          saveError instanceof Error ? saveError.message : 'Please check browser storage.'
        }`,
      )
    }
  }

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesQuery =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery)
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      return matchesQuery && matchesStatus && matchesPriority
    })
  }, [priorityFilter, query, statusFilter, tasks])

  const completedCount = tasks.filter((task) => task.status === 'done').length
  const progressCount = tasks.filter((task) => task.status === 'in-progress').length

  function openNewTaskForm() {
    setEditingId(null)
    setForm({ ...emptyTask, dueDate: new Date().toISOString().slice(0, 10) })
    setIsFormOpen(true)
  }

  function openEditTaskForm(task) {
    setEditingId(task.id)
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    })
    setIsFormOpen(true)
  }

  function closeTaskForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyTask)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const task = { ...form, title: form.title.trim(), description: form.description.trim() }
    if (!task.title) return

    if (editingId) {
      saveTasks(
        tasks.map((currentTask) =>
          currentTask.id === editingId ? { ...currentTask, ...task } : currentTask,
        ),
      )
    } else {
      saveTasks([
        { ...task, id: globalThis.crypto.randomUUID() },
        ...tasks,
      ])
    }
    closeTaskForm()
  }

  function updateStatus(id, status) {
    saveTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    )
  }

  function deleteTask(id) {
    saveTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="TaskFlow dashboard">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>taskflow</span>
        </a>
        <p className="sidebar-label">Workspace</p>
        <nav aria-label="Main navigation">
          <a className="nav-link active" href="#dashboard">
            <span className="nav-icon" aria-hidden="true">▦</span>
            Dashboard
          </a>
          <button className="nav-link" type="button" onClick={() => setStatusFilter('all')}>
            <span className="nav-icon" aria-hidden="true">☷</span>
            All tasks
            <span className="nav-count">{tasks.length}</span>
          </button>
          <button className="nav-link" type="button" onClick={() => setStatusFilter('done')}>
            <span className="nav-icon" aria-hidden="true">✓</span>
            Completed
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-card">
            <span className="workspace-avatar">W</span>
            <span className="workspace-copy"><strong>Workspace</strong><small>Personal space</small></span>
            <span className="workspace-more" aria-hidden="true">···</span>
          </div>
        </div>
      </aside>

      <main id="dashboard" className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span aria-hidden="true">/</span><strong>Dashboard</strong></div>
          <div className="topbar-actions">
            <span className="today-label">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="profile-avatar" aria-label="Your profile">JD</span>
          </div>
        </header>

        <section className="dashboard">
          <div className="page-heading">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h1>Good morning, Jamie <span aria-hidden="true">✦</span></h1>
              <p className="heading-subtitle">Here&apos;s what&apos;s happening with your tasks today.</p>
            </div>
            <button className="primary-button" type="button" onClick={openNewTaskForm}>
              <span aria-hidden="true">+</span> New task
            </button>
          </div>

          <div className="stats-grid" aria-label="Task overview">
            <article className="stat-card">
              <span className="stat-icon violet" aria-hidden="true">☷</span>
              <div><p>Total tasks</p><strong>{tasks.length}</strong></div>
              <span className="stat-note">In your workspace</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon blue" aria-hidden="true">◷</span>
              <div><p>In progress</p><strong>{progressCount}</strong></div>
              <span className="stat-note">Keep the momentum</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon green" aria-hidden="true">✓</span>
              <div><p>Completed</p><strong>{completedCount}</strong></div>
              <span className="stat-note">Nice work!</span>
            </article>
          </div>

          {error && (
            <div className="notice error-notice" role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button>
            </div>
          )}

          {isFormOpen && (
            <section className="form-panel" aria-labelledby="form-title">
              <div className="form-panel-heading">
                <div>
                  <p className="eyebrow">{editingId ? 'UPDATE YOUR WORK' : 'MAKE IT HAPPEN'}</p>
                  <h2 id="form-title">{editingId ? 'Edit task' : 'Create a task'}</h2>
                </div>
                <button className="icon-button" type="button" onClick={closeTaskForm} aria-label="Close task form">×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <label className="field full-field">
                  <span>Task name</span>
                  <input
                    autoFocus
                    maxLength="120"
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    placeholder="What needs to get done?"
                    required
                    value={form.title}
                  />
                </label>
                <label className="field full-field">
                  <span>Description <small>Optional</small></span>
                  <textarea
                    maxLength="500"
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Add a few details..."
                    rows="2"
                    value={form.description}
                  />
                </label>
                <div className="form-fields-row">
                  <label className="field">
                    <span>Status</span>
                    <select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}>
                      <option value="todo">To do</option>
                      <option value="in-progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Priority</span>
                    <select onChange={(event) => setForm({ ...form, priority: event.target.value })} value={form.priority}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Due date</span>
                    <input
                      onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                      type="date"
                      value={form.dueDate}
                    />
                  </label>
                </div>
                <div className="form-actions">
                  <button className="secondary-button" type="button" onClick={closeTaskForm}>Cancel</button>
                  <button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Create task'}</button>
                </div>
              </form>
            </section>
          )}

          <section className="tasks-section" aria-labelledby="tasks-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">STAY ON TOP OF IT</p>
                <h2 id="tasks-heading">Your tasks <span className="task-total">{tasks.length}</span></h2>
              </div>
            </div>
            <div className="filters">
              <label className="search-field">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <span className="visually-hidden">Search tasks</span>
                <input onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." value={query} />
                <kbd>⌘ K</kbd>
              </label>
              <label className="filter-select">
                <span className="visually-hidden">Filter by status</span>
                <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                  <option value="all">All statuses</option>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label className="filter-select">
                <span className="visually-hidden">Filter by priority</span>
                <select onChange={(event) => setPriorityFilter(event.target.value)} value={priorityFilter}>
                  <option value="all">All priorities</option>
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>
              </label>
            </div>

            {isLoading ? (
              <div className="loading-state" role="status"><span className="spinner" />Loading your tasks...</div>
            ) : visibleTasks.length > 0 ? (
              <div className="task-list">
                {visibleTasks.map((task) => (
                  <article className={`task-card ${task.status === 'done' ? 'is-complete' : ''}`} key={task.id}>
                    <span className={`task-check ${task.status === 'done' ? 'checked' : ''}`} aria-hidden="true">
                      {task.status === 'done' ? '✓' : ''}
                    </span>
                    <div className="task-main">
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      <div className="task-meta">
                        <span className={`priority-badge priority-${task.priority}`}>{task.priority} priority</span>
                        {task.dueDate && <span className="due-date"><span aria-hidden="true">◷</span> {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                      </div>
                    </div>
                    <label className={`status-badge status-${task.status}`}>
                      <span className="visually-hidden">Status for {task.title}</span>
                      <select onChange={(event) => updateStatus(task.id, event.target.value)} value={task.status}>
                        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <div className="task-actions">
                      <button className="icon-button" type="button" onClick={() => openEditTaskForm(task)} aria-label={`Edit ${task.title}`}>✎</button>
                      <button className="icon-button delete-button" type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>×</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">✓</span>
                <h3>{tasks.length === 0 ? 'A fresh start' : 'No tasks found'}</h3>
                <p>{tasks.length === 0 ? 'Add a task to start organizing your day.' : 'Try changing your search or filters.'}</p>
                {tasks.length === 0 ? (
                  <button className="primary-button" type="button" onClick={openNewTaskForm}>Create your first task</button>
                ) : (
                  <button className="secondary-button" type="button" onClick={() => { setQuery(''); setStatusFilter('all'); setPriorityFilter('all') }}>Clear filters</button>
                )}
              </div>
            )}
            {!isLoading && visibleTasks.length > 0 && (
              <p className="list-footer">Showing {visibleTasks.length} of {tasks.length} tasks</p>
            )}
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
