import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'ECON_USER'
export default new Vuex.Store({
  state: {
    user: getItem(TOKEN_KEY),
    cart: getItem('Cart') || []
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      setItem(TOKEN_KEY, state.user)
    },
    changeQuantity (state, data) {
      if (data.quantity === 0) {
        state.cart.splice(state.cart.findIndex(item => item.title === data.title), 1)
      } else {
        state.cart.forEach(element => {
          if (element.title === data.title) {
            element.quantity = data.quantity
          }
        })
      }
      setItem('Cart', state.cart)
    },
    removeCartItem (state, data) {
      state.cart.splice(state.cart.findIndex(item => item.title === data.title), 1)
      setItem('Cart', state.cart)
    },
    addCartItem (state, data) {
      if (state.cart.length === 0 || !state.cart.some(item => item.title === data.title)) {
        // state.cart = []
        state.cart.push(data)
      } else {
        state.cart.map(item => {
          if (item.title === data.title) {
            item.quantity = data.quantity
          }
        })
      }
      setItem('Cart', state.cart)
    },
    resetCart (state) {
      setItem('Cart', [])
      state.cart = []
    }
  },
  actions: {
  },
  modules: {
  }
})
