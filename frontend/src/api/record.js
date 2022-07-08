import request from '@/utils/request'

export const addRecord = data => {
  return request({
    url: '/record',
    method: 'PUT',
    data
  })
}
