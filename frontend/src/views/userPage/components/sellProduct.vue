<template>
  <div class="sell">
    <el-card :body-style="{ padding: '0px' }" class="sellProduct">
      <img :src="require('@/assets/' + phone.image)" class="sellImage">
      <span class="sellTitle">{{phone.title}}</span>
      <el-button type="primary" v-if="phone.disabled===false" @click="handleDisable">Disable</el-button>
      <el-button type="primary" v-else @click="handleDisable">Enable</el-button>
      <el-button type="danger" @click="handleRemove">Remove</el-button>
      <div><strong>comments:</strong></div>
      <div v-for="(item,index) in phone.reviews" :key="index" class="text item">
        {{item.comment}}
      </div>
    </el-card>
  </div>
</template>

<script>
import { disableitem } from '@/api/user'
import { deletePhone } from '@/api/phone'
export default {
  props: {
    phone: Object
  },
  methods: {
    async handleDisable () {
      try {
        const body = {
          product_id: this.phone._id,
          disabled: !this.phone.disabled
        }
        await disableitem(body)
        location.reload()
        this.$message('successful!!')
      } catch (error) {
        this.$message('error')
      }
    },
    async handleRemove () {
      try {
        const body = {
          _id: this.phone._id
        }
        await deletePhone(body)
        location.reload()
      } catch (error) {
        this.$message('Error')
      }
    }
  }
}
</script>

<style>
.sellImage{
  width: 50px;
  height: 50px;
  margin-right: 10px;
  vertical-align: middle;
}
.sellProduct{
  width: 600px;
  margin: auto;
}
.sellTitle{
  margin-right:10px;
}
</style>
