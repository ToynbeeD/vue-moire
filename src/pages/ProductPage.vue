<template>
  <main class="content container" v-if="productLoading">
    <PreLoader />
  </main>
  <main class="content container" v-else-if="productLoadingFailed">
    <LoadFailed :method="doLoadProduct" />
  </main>
  <main v-else class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'category', params: { id: product.category.id } }"> {{ product.category.title }} </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> {{ product.title }} </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="currentColor.gallery ? currentColor.gallery[0].file.url : 'img/no-image.jpg'"
            :alt="product.title"
          />
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">{{ product.title }}</h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">

              <ProductAmount v-model="formatAmount"/>

              <b class="item__price"> {{ product.price | numberFormat }} ₽ </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <ProductColor v-for="color in product.colors"
                  :key="color.id"
                  :color="color"
                  :check-color.sync="checkedColor"/>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label
                  class="form__label form__label--small form__label--select"
                >
                  <select class="form__select" type="text" name="size" v-model="productSize">
                    <option :value="size.id" v-for="size in product.sizes" :key="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button
            :disabled="formatAmount === 0 || buttonDisadled"
            class="item__button button button--primery"
            type="submit">
              В корзину
            </button>
            <p v-if="addingToCart">Добавляем товар в корзину...</p>
            <p v-else-if="addToCartFailed">Не удалось добавить товар...</p>
            <p v-else-if="addToCartSuccess">Товар успешно добавлен в корзину!</p>
          </form>
        </div>
      </div>
      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a
            href="#"
            @click.prevent="changeContentPage(1)"
            class="tabs__link"
            :class="{'tabs__link--current': itemContentPage === 1}">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a
            href="#"
            @click.prevent="changeContentPage(2)"
            class="tabs__link"
            :class="{'tabs__link--current': itemContentPage === 2}">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div v-if="itemContentPage === 1" class="item__content">
          <h3>Состав:</h3>

          <p>
            60% хлопок<br>
            30% полиэстер<br>
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>

        <div v-else-if="itemContentPage === 2" class="item__content">
          <h3>Доставка:</h3>

          <p>
            1. Курьерская доставка по Москве и Московской области – 290 ₽<br>
            2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь<br>
          </p>

          <h3>Возврат:</h3>

          <p>
            Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br>
            Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в которой Вы осуществили покупку.
            БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по телефону 8 800 600 90 09<br>
          </p>

        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '@/config'
import { mapActions } from 'vuex'
import numberFormat from '@/helpers/numberFormat'
import ProductColor from '@/components/ProductColor.vue'
import ProductAmount from '@/components/ProductAmount.vue'
import PreLoader from '@/components/PreLoader.vue'
import LoadFailed from '@/components/LoadFailed.vue'

export default {
  data () {
    return {
      productAmount: 1,
      itemContentPage: 1,
      buttonDisadled: false,

      addingToCart: false,
      addToCartFailed: false,
      addToCartSuccess: false,

      productData: null,
      checkedColor: null,
      productSize: null,

      productLoading: false,
      productLoadingFailed: false
    }
  },
  components: { ProductColor, ProductAmount, PreLoader, LoadFailed },
  filters: {
    numberFormat
  },
  computed: {
    product () {
      return this.productData ? this.productData : {}
    },
    currentColor () {
      return this.checkedColor ? this.checkedColor : {}
    },
    currentSize () {
      return this.productSize ? this.productSize : {}
    },
    formatAmount: {
      get () {
        return this.productAmount
      },
      set (value) {
        this.productAmount = this.checkValue(value)
      }
    }
  },
  methods: {
    ...mapActions(['addProductToCart']),
    async addToCart () {
      this.buttonDisadled = true
      this.addingToCart = true
      this.addToCartFailed = false
      this.addToCartSuccess = false
      try {
        await this.addProductToCart({
          productId: this.product.id,
          colorId: this.currentColor.color.id,
          sizeId: this.productSize,
          amount: this.productAmount
        })
        this.buttonDisadled = false
        this.addingToCart = false
        this.addToCartSuccess = true
      } catch {
        this.addToCartFailed = true
        this.buttonDisadled = false
      }
    },
    async doLoadProduct () {
      this.productLoading = true
      this.productLoadingFailed = false
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        const data = await response.data
        this.productData = data
        this.checkedColor = data.colors[0]
        this.productSize = data.sizes[0].id
        this.productLoading = false
      } catch (err) {
        if (err.response.status === 404) {
          this.$router.replace({ name: 'notFound' })
        }
        this.productLoading = false
        this.productLoadingFailed = true
      }
    },
    checkValue (value) {
      const valueString = value.toString()
      const trimValue = valueString.trim()
      if (trimValue.length <= 0) return 1

      const regexp = /[^\d]/g
      const formatValue = valueString.replace(regexp, '')

      if (!formatValue) return 1
      else return parseInt(formatValue)
    },
    changeContentPage (number) {
      if (this.itemContentPage === number) {
        return
      }
      this.itemContentPage = number
    }
  },
  watch: {
    '$route.params.id': {
      handler () {
        this.doLoadProduct()
      },
      immediate: true
    }
  }
}
</script>
