import request from '@/utils/request'

export const login = data => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}
export const pwdVerify = data => {
  return request({
    url: '/auth/verification',
    method: 'POST',
    data
  })
}
export const register = data => {
  return request({
    url: '/auth/register',
    method: 'PUT',
    data
  })
}
export const verification = data => {
  return request({
    url: '/auth/emailverification',
    method: 'POST',
    data
  })
}
export const ResetPsd = data => {
  return request({
    url: '/auth/ResetPsd',
    method: 'POST',
    data
  })
}
