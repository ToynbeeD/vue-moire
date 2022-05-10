<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link" href="#"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Корзина </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">Корзина</h1>
        <span class="content__info"> {{ products.length }} {{ products.length | wordFormat }} </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="product in products" :key="product.basketItemId" :product="product"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">Итого: <span>{{ totalPrice | numberFormat }} ₽</span></p>
          <router-link :to="{name: 'order'}" custom v-slot="{ navigate }">
            <button
            @click="navigate"
            class="cart__button button button--primery"
            type="submit"
            :disabled="products.length <= 0"
            >
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import wordFormat from '@/helpers/wordFormat'
import numberFormat from '@/helpers/numberFormat'
import CartItem from '@/components/CartItem.vue'

export default {
  data () {
    return {
      cartLoading: false,
      cartLoadFailed: false
    }
  },
  components: { CartItem },
  filters: {
    wordFormat,
    numberFormat
  },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice' })
  }
}
</script>
