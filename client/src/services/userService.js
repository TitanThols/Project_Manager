import api from './api'

export const getAllUsers = async () => {
  const res = await api.get('/users')
  return res.data
}

export const searchUsers = async (query) => {
  const res = await api.get(`/users?search=${query}`)
  return res.data
}