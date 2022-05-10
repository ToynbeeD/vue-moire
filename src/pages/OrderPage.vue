<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link" href="#"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'cart'}" class="breadcrumbs__link" href="#"> Корзина </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit.prevent="doOrder()"
      >
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              v-model="formData.name"
              title="ФИО"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
            />

            <BaseFormText
              v-model="formData.address"
              title="Адрес доставки"
              :error="formError.address"
              placeholder="Введите ваш адрес"
            />

            <BaseFormText
              v-model="formData.phone"
              type="tel"
              title="Телефон"
              :error="formError.phone"
              placeholder="Введите ваш телефон"
            />

            <BaseFormText
              v-model="formData.email"
              type="email"
              title="Email"
              :error="formError.email"
              placeholder="Введи ваш Email"
            />

            <BaseFormTextarea
              v-model="formData.comment"
              title="Комментарий к заказу"
              placeholder="Ваши пожелания"
            />
          </div>

          <div class="cart__options">
            <p v-if="formError.deliveryTypeId" style="color: #e02d71">
              {{ formError.deliveryTypeId }}
            </p>
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li
                class="options__item"
                v-for="type in deliveryTypes"
                :key="type.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="type.id"
                    @input="changeDeliveryType(type.id)"
                  />
                  <span class="options__value">
                    {{ type.title }}
                    <b>{{ type.price === "0" ? "бесплатно" : type.price }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <p v-if="!deliveryType">Выберите способ доставки</p>
            <p v-else-if="paymentsLoading">Проверяем способы оплаты...</p>
            <p v-else-if="paymentsLoadFailed">Что-то пошло не так...</p>
            <ul v-else-if="paymentTypes" class="cart__options options">
              <li
                class="options__item"
                v-for="item in paymentTypes"
                :key="item.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="item.id"
                    @input="changePaymentType(item.id)"
                  />
                  <span class="options__value"> {{ item.title }} </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <CartOrder
              v-for="product in products"
              :key="product.basketItemId"
              :item="product"
            />
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ (deliveryType ? deliveryType.price : 0) | numberFormat }} ₽</b>
            </p>
            <p>
              Итого: <b>{{ products.length }}</b> {{ products.length | wordFormat }} на сумму
              <b>{{ (deliveryType ? totalPrice + parseInt(deliveryType.price) : totalPrice) | numberFormat }} ₽</b>
            </p>
          </div>

          <button :disabled="addingOrder" class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>

        <div v-if="formErrorMessage" class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { API_BASE_URL } from '@/config'
import { mapGetters } from 'vuex'
import axios from 'axios'
import wordFormat from '@/helpers/wordFormat'
import numberFormat from '@/helpers/numberFormat'
import CartOrder from '@/components/CartOrder.vue'
import BaseFormText from '@/components/BaseFormText.vue'
import BaseFormTextarea from '@/components/BaseFormTextarea.vue'

export default {
  data () {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      formSending: false,

      deliveryData: null,
      deliveryType: null,

      addingOrder: false,

      paymentsData: null,
      paymentType: null,
      paymentsLoading: false,
      paymentsLoadFailed: false
    }
  },
  components: { CartOrder, BaseFormText, BaseFormTextarea },
  filters: {
    wordFormat,
    numberFormat
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice'
    }),
    deliveryTypes () {
      return this.deliveryData ? this.deliveryData : {}
    },
    paymentTypes () {
      return this.paymentsData ? this.paymentsData : {}
    }
  },
  methods: {
    async getDeliveryData () {
      const response = await axios.get(`${API_BASE_URL}/api/deliveries`)
      const data = await response.data
      this.deliveryData = data
    },
    async getPaymentsData (deliveryId) {
      this.paymentsLoading = true
      this.paymentsLoadFailed = false
      try {
        const response = await axios.get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: deliveryId
          }
        })
        const data = await response.data
        this.paymentsLoading = false
        this.paymentsData = data
      } catch {
        this.paymentsLoading = false
        this.paymentsLoadFailed = true
      }
    },
    async doOrder () {
      this.formError = {}
      this.formErrorMessage = ''
      this.formSending = true
      this.addingOrder = true
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/orders`,
          {
            ...this.formData,
            deliveryTypeId: this.deliveryType ? this.deliveryType.id : 0,
            paymentTypeId: this.paymentType ? this.paymentType.id : 0
          },
          {
            params: {
              userAccessKey: this.$store.state.userAccessKey
            }
          }
        )
        const data = await response.data
        this.formSending = false
        this.addingOrder = false
        this.$store.commit('resetCart')
        this.$store.commit('updateOrderInfo', data)
        this.$router.push({
          name: 'orderInfo',
          params: { id: data.id }
        })
      } catch (error) {
        this.formSending = false
        this.addingOrder = false
        this.formError = error.response.data.error.request || {}
        this.formErrorMessage = error.response.data.error.message
      }
    },
    changeDeliveryType (id) {
      if (this.deliveryType && this.deliveryType.id === id) {
        return
      }
      this.deliveryType = this.deliveryData.find((item) => item.id === id)
      this.paymentType = null
    },
    changePaymentType (id) {
      this.paymentType = this.paymentsData.find((item) => item.id === id)
    }
  },
  created () {
    this.getDeliveryData()
  },
  watch: {
    deliveryType () {
      this.getPaymentsData(this.deliveryType.id)
    }
  }
}
</script>
