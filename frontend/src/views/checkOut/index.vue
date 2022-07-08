<template>
  <div class="checkOut">

    <el-card class="bigCart">
        <i class="el-icon-back back" @click="handleBack"></i>
        <strong class="cartText">Cart</strong>
        <div class="cart" v-for="(item,index) in cart" :key="index">
          <cart-item :cartItem="item" @changed="handleChange" class="cartItem"/>
        </div>
        <div v-if="cart.length===0">
          <hr />
          Empty Cart
        </div>
        <div v-else class="checkOutFooter">
          <span>Total Price: </span>
          <strong class="total">{{totalPrice.toFixed(2)}}</strong>
          <el-button type="warning" @click="handlePay">PAY</el-button>
        </div>
    </el-card>
  </div>
</template>

<script>
import cartItem from './components/cartItem.vue'
import { getItem } from '@/utils/storage'
import { addRecord } from '@/api/record'
export default {
  components: { cartItem },
  data () {
    return {
      cart: getItem('Cart') || [],
      totalPrice: 0
    }
  },
  methods: {
    handleBack () {
      this.$router.back()
    },
    handleChange () {
      this.cart = getItem('Cart')
    },
    handlePay () {
      this.$confirm('Are you sure to pay?', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'success'
      }).then(async () => {
        const goods = []
        this.cart.forEach(element => {
          const good = { goods_id: element._id, num: element.quantity }
          goods.push(good)
        })
        try {
          const body = { goods: goods }
          await addRecord(body)
        } catch (error) {
          console.log(error)
        }
        this.$store.commit('resetCart')
        this.cart = []
        this.$router.push('/')
        this.$message({
          showClose: true,
          message: 'Transaction complete',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel payment'
        })
      })
    }
  },
  watch: {
    cart: {
      immediate: true,
      deep: true,
      handler (newVal) {
        this.totalPrice = 0
        this.cart.forEach(element => {
          this.totalPrice += element.price * element.quantity
        })
      }
    }
  }
}
</script>

<style>
  .back{
    transition: 0.2s;
    font-size: 20px;
    margin-left: -1000px;
  }
  .back:hover{
    color: lightblue;
    font-size: 32px;
  }
  .cart{
    width: 1000px;
    margin: auto;
  }
  .bigCart{
    width: 1200px;
    margin: auto;
  }
  .cartItem{
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .total{
    font-size: 24px;
    margin-right: 50px;
  }
  .checkOutFooter{
    text-align: right;
  }
  .cartText{
    font-size: 32px;
  }
</style>
