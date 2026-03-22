import api from './api'

export const getAllProjects = async () => {
  const res = await api.get('/projects')
  return res.data
}

export const createProject = async (data) => {
  const res = await api.post('/projects', data)
  return res.data
}

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`)
  return res.data
}

export const addMember = async (projectId, userId, role = 'member') => {
  const res = await api.post(`/projects/${projectId}/members`, { userId, role })
  return res.data
}