<template>
  <div class="phoneItem" @click="handleClick">
    <el-card :body-style="{ padding: '0px' }" class="phone">
      <img :src="require('../assets/' + this.phone.image)" class="image">
      <span><slot></slot>{{type==="rating"? (phone.reviews.reduce((sum,item)=>sum+item.rating,0)/phone.reviews.length).toFixed(2) : phone[type]}}</span>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    phone: Object,
    type: {
      type: String,
      default: 'price'
    }
  },
  methods: {
    handleClick () {
      this.$router.push({
        name: 'phone',
        params: {
          phoneId: this.phone._id
        }
      })
    }
  }
}
</script>

<style>
  .image {
    width: 120px;
    height: 120px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 100px;
  }
  .phone{
    display: flex;
    justify-content: space-between;
    font-size: 15px;
  }
  .phoneItem:hover{
    cursor: pointer;
  }

</style>
