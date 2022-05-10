<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="product.image ? product.image : 'img/no-image.jpg'"
        width="120"
        height="120"
        alt="Название товара"
      />
    </div>
    <h3 class="product__title">{{ product.title }}</h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{'background-color': product.color.code}"></i>
        {{ product.color.title }}
      </span>
    </p>
    <span class="product__code"> Артикул: {{ product.productId }} </span>

    <ProductAmount class="product__counter" v-model.number="amount"/>

    <b class="product__price"> {{ product.amount * product.product.price | numberFormat }} ₽ </b>

    <button
      @click="deleteProduct(product.basketItemId)"
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import numberFormat from '@/helpers/numberFormat'
import ProductAmount from '@/components/ProductAmount.vue'

export default {
  props: ['product'],
  components: { ProductAmount },
  computed: {
    amount: {
      get () {
        return this.product.amount
      },
      set (value) {
        this.$store.dispatch('updateCartProductAmount', {
          productId: this.product.productId,
          basketItemId: this.product.product.id,
          amount: value
        })
      }
    }
  },
  filters: {
    numberFormat
  },
  methods: {
    ...mapActions({ deleteProduct: 'deleteCartProduct' })
  }
}
</script>
