<template>
  <div class="Mlisting">
    <el-card>
      <div v-for="(item,index) in products" :key="index" class="text item">
        <sell-product :phone="item" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getSellProduct } from '@/api/user'
import sellProduct from './sellProduct.vue'
export default {
  components: { sellProduct },
  data () {
    return {
      products: []
    }
  },
  created () {
    this.getUserSell()
  },
  methods: {
    async getUserSell () {
      try {
        const { data } = await getSellProduct()
        this.products = data
      } catch (error) {

      }
    }
  }

}
</script>

<style>
.Mlisting{
  width: 1000px;
  margin: auto;
  margin-top: 20px;
}
</style>
