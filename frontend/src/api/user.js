import request from '@/utils/request'

export const getUserInfo = params => {
  return request({
    url: '/user',
    method: 'GET',
    params
  })
}
export const updateUserInfo = data => {
  return request({
    url: '/user',
    method: 'PUT',
    data
  })
}
export const resetPwd = data => {
  return request({
    url: '/user/resetpassword',
    method: 'PUT',
    data
  })
}
export const getSellProduct = params => {
  return request({
    url: '/user/saleproduct',
    method: 'GET',
    params
  })
}
export const disableitem = data => {
  return request({
    url: '/user/disableitem',
    method: 'PUT',
    data
  })
}
