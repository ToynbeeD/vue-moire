import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userAccessKey: null,

    cartProducts: [],
    cartProductsData: [],

    orderInfo: null
  },
  getters: {
    cartDetailProducts (state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData.find((p) => p.id === item.basketItemId)

        return {
          ...item,
          color: {
            ...product.color.color
          },
          title: product.product.title,
          image: product.color.gallery ? product.color.gallery[0].file.url : 'img/no-image.jpg',
          product: {
            ...product
          }
        }
      })
    },
    cartTotalPrice (state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
    },
    detailOrderInfo (state) {
      const items = state.orderInfo.basket.items.map(item => {
        return {
          product: {
            ...item.product
          },
          title: item.product.title,
          color: {
            ...item.color,
            title: item.color.color.title
          },
          amount: item.quantity,
          productId: item.product.id,
          basketItemId: item.id
        }
      })
      return {
        ...state.orderInfo,
        items
      }
    }
  },
  mutations: {
    updateOrderInfo (state, orderInfo) {
      state.orderInfo = orderInfo
    },
    resetCart (state) {
      state.cartProducts = []
      state.cartProductsData = []
    },
    updateUserAccessKey (state, accessKey) {
      state.userAccessKey = accessKey
    },
    updateCartProductAmount (state, { basketItemId, amount }) {
      const item = state.cartProducts.find((product) => product.basketItemId === basketItemId)

      if (item) item.amount = amount
    },
    updateCartProductsData (state, items) {
      state.cartProductsData = items
    },
    deleteCartProduct (state, basketItemId) {
      state.cartProducts = state.cartProducts.filter((item) => item.basketItemId !== basketItemId)
    },
    syncCartProducts (state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        basketItemId: item.id,
        amount: item.quantity
      }))
    }
  },
  actions: {
    async loadOrderInfo (context, orderId) {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
      const data = await response.data
      context.commit('updateOrderInfo', data)
    },
    async loadCart (context) {
      const response = await axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
      const data = await response.data
      if (!context.state.userAccessKey) {
        localStorage.setItem('userAccessKey', data.user.accessKey)
        context.commit('updateUserAccessKey', data.user.accessKey)
      }
      context.commit('updateCartProductsData', data.items)
      context.commit('syncCartProducts')
    },
    async addProductToCart (context, { productId, colorId, sizeId, amount }) {
      const response = await axios.post(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        colorId,
        sizeId,
        quantity: amount
      }, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
      const data = await response.data
      context.commit('updateCartProductsData', data.items)
      context.commit('syncCartProducts')
    },
    async updateCartProductAmount (context, {
      basketItemId,
      amount
    }) {
      context.commit('updateCartProductAmount', { basketItemId, amount })

      if (amount < 1) {
        return
      }
      try {
        const response = await axios.put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity: amount
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        const data = await response.data
        context.commit('updateCartProductsData', data.items)
      } catch {
        context.commit('syncCartProducts')
      }
    },
    async deleteCartProduct (context, basketItemId) {
      context.commit('deleteCartProduct', basketItemId)
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/baskets/products`, {
          data: {
            basketItemId
          },
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        const data = await response.data
        context.commit('updateCartProductsData', data.items)
        context.commit('syncCartProducts')
      } catch {
        context.commit('syncCartProducts')
      }
    }
  },
  modules: {
  }
})
