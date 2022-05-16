<template>
  <main v-if="orderInfoLoading" class="content container">
    <PreLoader />
  </main>
  <main v-else-if="orderInfoFailLoad" class="content container">
    <LoadFailed :method="loadOrderInfo" />
  </main>
  <main v-else class="content container">
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

      <h1 class="content__title">Заказ оформлен <span>№ {{ orderInfo.id }}</span></h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
            письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
            в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key"> Получатель </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Адрес доставки </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Телефон </span>
              <span class="dictionary__value"> {{ orderInfo.phone }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Email </span>
              <span class="dictionary__value"> {{ orderInfo.email }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Способ оплаты </span>
              <span class="dictionary__value"> {{ orderInfo.paymentType }} </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <CartOrder
            v-for="item in orderInfo.items"
            :key="item.basketItemId"
            :item="item"/>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ orderInfo.deliveryType.price | numberFormat }} ₽</b></p>
            <p>Итого: <b>{{ orderInfo.basket.items.length }}</b> {{ orderInfo.basket.items.length | wordFormat }} на сумму <b>{{ orderInfo.totalPrice | numberFormat }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import wordFormat from '@/helpers/wordFormat'
import numberFormat from '@/helpers/numberFormat'
import CartOrder from '@/components/CartOrder.vue'
import PreLoader from '@/components/PreLoader.vue'
import LoadFailed from '@/components/LoadFailed.vue'

export default {
  data () {
    return {
      orderInfoLoading: false,
      orderInfoFailLoad: false
    }
  },
  components: { CartOrder, PreLoader, LoadFailed },
  filters: {
    wordFormat,
    numberFormat
  },
  computed: {
    ...mapGetters({ orderInfo: 'detailOrderInfo' || {} })
  },
  methods: {
    async loadOrderInfo () {
      this.orderInfoLoading = true
      this.orderInfoFailLoad = false
      try {
        await this.$store.dispatch('loadOrderInfo', this.$route.params.id)
        this.orderInfoLoading = false
      } catch (error) {
        this.orderInfoLoading = false
        if (error.response.status === 400) {
          this.$router.replace({ name: 'notFound' })
        } else {
          this.orderInfoFailLoad = true
        }
      }
    }
  },
  watch: {
    '$route.params.id': {
      handler () {
        if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
          return
        }
        this.loadOrderInfo()
      },
      immediate: true
    }
  }
}
</script>
