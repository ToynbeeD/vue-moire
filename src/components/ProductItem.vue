<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img
        :src="
          checkedColor.gallery
            ? checkedColor.gallery[0].file.url
            : 'img/no-image.jpg'
        "
        :alt="product.title"
      />
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{ name: 'product', params: { id: product.id } }">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat }} ₽ </span>

    <ul class="colors colors--black">
      <ProductColor
        v-for="color in colors"
        :key="color.id"
        :color="color"
        :check-color.sync="checkedColor"
      />
    </ul>
  </li>
</template>

<script>
import ProductColor from './ProductColor.vue'
import numberFormat from '@/helpers/numberFormat'

export default {
  data () {
    return {
      colors: this.product ? this.product.colors : [],
      checkedColor: this.product.colors[0]
    }
  },
  components: { ProductColor },
  props: ['product'],
  filters: {
    numberFormat
  }
}
</script>
