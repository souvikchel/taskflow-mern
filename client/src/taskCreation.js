export async function createTask(api, task, setTasks) {
  const { data } = await api.post('/tasks', task)
  if (!data?.task?._id) {
    throw new Error('The API created the task but did not return its task ID.')
  }

  const createdTask = { ...data.task, id: data.task._id }
  setTasks((currentTasks) => [
    createdTask,
    ...currentTasks.filter((currentTask) => currentTask.id !== createdTask.id),
  ])
  return createdTask
}
