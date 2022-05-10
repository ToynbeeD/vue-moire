<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info"> {{ productsTotal }} {{ productsTotal | wordFormat }} </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :color-ids.sync="filterColors"
        :material-ids.sync="filterMaterials"
        :season-ids.sync="filterSeasons"
      />
      <section v-if="productsLoading" class="catalog">
        <PreLoader/>
      </section>
      <section v-else-if="productsLoadFail" class="catalog">
        <LoadFailed :method="doLoadProducts" />
      </section>
      <section v-else class="catalog">
        <ProductList :products="productsData" />
        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import PreLoader from '@/components/PreLoader.vue'
import LoadFailed from '@/components/LoadFailed.vue'
import ProductList from '@/components/ProductList.vue'
import BasePagination from '@/components/BasePagination.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import wordFormat from '@/helpers/wordFormat'
import { API_BASE_URL } from '@/config'
import axios from 'axios'

export default {
  data () {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColors: [],
      filterMaterials: [],
      filterSeasons: [],

      productsData: null,
      productsTotal: 0,

      page: 1,
      productsPerPage: 12,

      productsLoading: false,
      productsLoadFail: false
    }
  },
  filters: {
    wordFormat
  },
  components: { PreLoader, ProductList, BasePagination, ProductFilter, LoadFailed },
  methods: {
    async doLoadProducts () {
      this.productsLoading = true
      this.productsLoadFail = false
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            colorIds: this.filterColors,
            materialIds: this.filterMaterials,
            seasonIds: this.filterSeasons
          }
        })
        const data = await response.data
        this.productsLoading = false
        this.productsData = data.items
        this.productsTotal = data.pagination.total
      } catch (err) {
        this.productsLoading = false
        this.productsLoadFail = true
      }
    }
  },
  computed: {
    countProducts () {
      return this.productsData ? this.productsTotal : 0
    }
  },
  watch: {
    page () {
      this.doLoadProducts()
    },
    filterPriceFrom () {
      this.doLoadProducts()
    },
    filterPriceTo () {
      this.doLoadProducts()
    },
    filterCategoryId () {
      this.doLoadProducts()
    },
    filterMaterials () {
      this.doLoadProducts()
    },
    filterSeasons () {
      this.doLoadProducts()
    },
    filterColors () {
      this.doLoadProducts()
    }
  },
  created () {
    this.doLoadProducts()
  }
}
</script>
