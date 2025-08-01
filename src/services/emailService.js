import axios from '@/axios/axios'

export const getEmails = async () => {
  const response = await axios.get('/account/emails')
  return response.data
}

export const sendVerificationCode = async (email) => {
  const response = await axios.post('/account/send-verification-code', {email})
  return response.data
}

export const addEmail = async (email, verificationCode) => {
  const response = await axios.post('/account/add-email', {
    email,
    verificationCode
  })
  return response.data
}

export const removeEmail = async (email, verificationCode) => {
  const response = await axios.post('/account/remove-email', {
    email,
    verificationCode
  })
  return response.data
}

export const verifyEmail = async (email, token) => {
  const response = await axios.post('/account/verify-email', {
    email,
    token
  })
  return response.data
}
