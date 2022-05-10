<template>
  <li class="cart__order">
    <h3>{{ item.title }} ({{ item.color.title }}). {{ item.amount }}шт.</h3>
    <b>{{ item.product.price * item.amount | numberFormat }} ₽</b>
    <span>Артикул: {{ item.productId }}</span>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat'

export default {
  props: ['item'],
  filters: {
    numberFormat
  }
}
</script>
