import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/mainPage'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/mainPage/components/Home')
      },
      {
        path: '/search/:title',
        name: 'search',
        component: () => import('@/views/mainPage/components/Search'),
        props: true
      },
      {
        path: '/phone/:phoneId',
        name: 'phone',
        component: () => import('@/views/mainPage/components/Item'),
        props: true
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/checkOut',
    name: 'checkOut',
    component: () => import('@/views/checkOut')
  },
  {
    path: '/userPage',
    name: 'userPage',
    component: () => import('@/views/userPage')
  },
  {
    path: '/ResetPassword',
    name: 'ResetPassword',
    component: () => import('@/views/login/ResetPassword')
  }
]

const router = new VueRouter({
  routes
})

export default router
