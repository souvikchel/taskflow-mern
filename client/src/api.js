import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

export function getApiErrorMessage(error) {
  return error.response?.data?.error || error.message || 'The API request failed.'
}

export default api
