<template>
  <div class="form__counter">
    <button
      type="button"
      aria-label="Убрать один товар"
      :disabled="amount <= 1"
      @click="change(amount - 1)"
    >
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <label>
      <input type="text" :value="amount" name="count" @change="change($event.target.value)" :key="renderKey"/>
    </label>

    <button type="button" aria-label="Добавить один товар" @click="change(amount + 1)">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      renderKey: 0
    }
  },
  model: {
    prop: 'amount',
    event: 'change'
  },
  props: ['amount'],
  methods: {
    change (value) {
      this.$emit('change', value)
      this.renderKey++
    }
  }
}
</script>
