import api from './api'

export const getAllTasks = async (projectId) => {
  const res = await api.get(`/tasks?projectId=${projectId}`)
  return res.data
}

export const createTask = async (data) => {
  const res = await api.post('/tasks', data)
  return res.data
}

export const updateTask = async (id, data) => {
  const res = await api.patch(`/tasks/${id}`, data)
  return res.data
}

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`)
  return res.data
}