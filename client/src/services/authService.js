import api from './api'

export const login = async (email, password) => {
    const res = await api.post('/users/login', {email, password })
    return res.data
}

export const signup = async(name, email, password, confirmPassword) => {
    const res = await api.post('/users/signup', { name, email, password, passwordConfirm: confirmPassword })
    console.log('login response:', res.data)
    return res.data
}