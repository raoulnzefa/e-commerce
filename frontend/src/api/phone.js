import request from '@/utils/request'

export const getPhones = data => {
  return request({
    url: '/good',
    method: 'POST',
    data
  })
}
export const searchPhones = params => {
  return request({
    url: '/good',
    method: 'GET',
    params
  })
}
export const postComment = data => {
  return request({
    url: '/good/review',
    method: 'POST',
    data
  })
}
export const getBestSell = params => {
  return request({
    url: '/good/bestsale',
    method: 'GET',
    params
  })
}
export const addPhone = data => {
  return request({
    url: '/good',
    method: 'PUT',
    data
  })
}
export const deletePhone = data => {
  return request({
    url: '/good',
    method: 'DELETE',
    data
  })
}
export const getBrands = params => {
  return request({
    url: '/good/brand',
    method: 'GET',
    params
  })
}
