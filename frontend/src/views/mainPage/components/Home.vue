<template>
  <div class="home">
    <el-card class="soldOut">
      <div slot="header" class="clearfix">
        <span>Sold out soon</span>
      </div>
      <div v-for="(item,index) in phoneList" :key="index" class="text item">
        <phone-item :phone="item">
          Price:
        </phone-item>
      </div>
    </el-card>
    <el-card class="bestSeller">
      <div slot="header" class="clearfix">
        <span>Best Sellers</span>
      </div>
      <div v-for="(item,index) in bestSeller" :key="index" class="text item">
        <phone-item :phone="item.data[0]" type="rating">
          Rating:
        </phone-item>
      </div>
    </el-card>
  </div>
</template>

<script>
import phoneItem from '../../../components/phoneItem.vue'
import { getPhones, getBestSell } from '@/api/phone'
export default {
  components: { phoneItem },
  data () {
    return {
      phoneList: [],
      bestSeller: []
    }
  },
  methods: {
    async getSoldOutSoon () {
      try {
        const query = {
          query: {
            disabled: false,
            stock: { $gt: 0 }
          },
          sort: {
            stock: 1
          },
          options: {},
          limit: 5
        }
        const { data } = await getPhones(query)
        this.phoneList = data
      } catch (error) {
        console.log(error)
      }
    },
    async getBestSellers () {
      try {
        const { data } = await getBestSell()
        this.bestSeller = data
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    this.getSoldOutSoon()
    this.getBestSellers()
  }
}
</script>

<style lang="less">
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .soldOut {
    width: 480px;
  }
  .bestSeller{
    width: 480px;
  }
  .home{
    display: flex;
    justify-content: space-evenly;
  }
</style>
