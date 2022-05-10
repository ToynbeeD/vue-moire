<template>
  <aside class="filter">
    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit()"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="filterPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="filterPriceTo"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="checkbox"
                name="color"
                :value="color.id"
                v-model.number="currentColorIds"
              />
              <span
                class="colors__value"
                :style="{ 'background-color': color.code }"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="material in materials"
            :key="material.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                v-model.number="currentMaterialIds"
                :value="material.id"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="season in seasons"
            :key="season.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                v-model.number="currentSeasonIds"
                :value="season.id"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button
        v-if="isFilter"
        @click="reset"
        class="filter__reset button button--second"
        type="button"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '@/config'
export default {
  data () {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColorIds: [],
      currentMaterialIds: [],
      currentSeasonIds: [],
      isHasFilter: false,

      categoriesData: null,
      materialsData: null,
      seasonsData: null,
      colorsData: null
    }
  },
  props: [
    'priceFrom',
    'priceTo',
    'categoryId',
    'minPrice',
    'maxPrice',
    'materialIds',
    'seasonIds',
    'colorIds'
  ],
  computed: {
    categories () {
      return this.categoriesData ? this.categoriesData.items : []
    },
    colors () {
      return this.colorsData ? this.colorsData.items : []
    },
    materials () {
      return this.materialsData ? this.materialsData.items : []
    },
    seasons () {
      return this.seasonsData ? this.seasonsData.items : []
    },
    filterPriceFrom: {
      get () {
        return this.currentPriceFrom
      },
      set (value) {
        this.currentPriceFrom = this.checkValue(value)
      }
    },
    filterPriceTo: {
      get () {
        return this.currentPriceTo
      },
      set (value) {
        this.currentPriceTo = this.checkValue(value) < this.currentPriceFrom ? 0 : this.checkValue(value)
      }
    },
    isFilter () {
      return this.isHasFilter
    }
  },
  methods: {
    submit () {
      this.$emit('update:priceFrom', this.filterPriceFrom)
      this.$emit('update:priceTo', this.filterPriceTo)
      this.$emit('update:categoryId', this.currentCategoryId)
      this.$emit('update:colorIds', this.currentColorIds)
      this.$emit('update:materialIds', this.currentMaterialIds)
      this.$emit('update:seasonIds', this.currentSeasonIds)
      this.checkFilter()
    },
    reset () {
      this.$emit('update:priceFrom', 0)
      this.$emit('update:priceTo', 0)
      this.$emit('update:categoryId', 0)
      this.$emit('update:colorIds', [])
      this.$emit('update:materialIds', [])
      this.$emit('update:seasonIds', [])
      this.isHasFilter = false
    },
    async doLoadFeatures () {
      const endpoints = [
        `${API_BASE_URL}/api/productCategories`,
        `${API_BASE_URL}/api/materials`,
        `${API_BASE_URL}/api/seasons`,
        `${API_BASE_URL}/api/colors`
      ]
      const response = await axios.all(
        endpoints.map((endpoint) => axios.get(endpoint))
      )
      const [categories, materials, seasons, colors] = response.map(
        (obj) => obj.data
      )

      this.categoriesData = categories
      this.materialsData = materials
      this.seasonsData = seasons
      this.colorsData = colors
    },
    checkValue (value) {
      if (!Number(value)) return 0
      else if (value < 0) return 0
      else return value
    },
    checkFilter () {
      if (
        this.currentPriceFrom === 0 &&
        this.currentPriceTo === 0 &&
        this.currentCategoryId === 0 &&
        this.currentColorIds.length === 0 &&
        this.currentMaterialIds.length === 0 &&
        this.currentSeasonIds.length === 0
      ) {
        this.isHasFilter = false
      } else this.isHasFilter = true
    }
  },
  watch: {
    priceFrom (value) {
      this.currentPriceFrom = value
    },
    priceTo (value) {
      this.currentPriceTo = value
    },
    categoryId (value) {
      this.currentCategoryId = value
    },
    colorIds (value) {
      this.currentColorIds = value
    },
    materialIds (value) {
      this.currentMaterialIds = value
    },
    seasonIds (value) {
      this.currentSeasonIds = value
    }
  },
  created () {
    this.doLoadFeatures()
  }
}
</script>
