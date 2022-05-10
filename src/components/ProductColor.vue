<template>
  <li class="colors__item">
    <label class="colors__label">
      <input
        @input="$emit('update:checkColor', color)"
        class="colors__radio sr-only"
        type="radio"
        :name="color.id"
        :value="color.color.title"
        :checked="checkColor.id === color.id"
      />
      <span class="colors__value" :style="{ 'background-color': color.color.code }"> </span>
    </label>
  </li>
</template>

<script>
export default {
  props: ['color', 'checkColor']
}
</script>
