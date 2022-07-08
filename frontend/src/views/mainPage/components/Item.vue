<template>
  <div class="item">
    <el-card class="itemDetails">
      <div slot="header" class="clearfix">
        <span>{{phoneItem.title}}</span>
      </div>
      <img :src="require('@/assets/' + phoneItem.image)" class="img" v-if="isGetData">
      <p><strong>Title:</strong> {{phoneItem.title}}</p>
      <p><strong>Brand:</strong> {{phoneItem.brand}}</p>
      <p><strong>Available Stock:</strong> {{phoneItem.stock}}</p>
      <p v-if="isGetData"><strong>Sellers Full Name:</strong> {{fullName}}</p>
      <p><strong>Price:</strong> ${{phoneItem.price}}</p>
      <br/>
      <br/>
      <reviews :reviews="phoneItem.reviews" v-if="isGetData"/>
      <el-row :gutter="20" class="cartRow">
        <el-col :span="8" :offset="16">
          <el-button type="warning" class="cartBtn" @click="handleCart">Add to Cart</el-button>
          <span>Current added quantity: <strong class="cartSpan">{{curNum}}</strong></span>
        </el-col>
      </el-row>
      <post-comment :phone_id="phoneId"/>
    </el-card>
  </div>
</template>

<script>
import PostComment from './postComment.vue'
import reviews from './reviews.vue'
import { getPhones } from '@/api/phone'
import { getUserInfo } from '@/api/user'
export default {
  components: { reviews, PostComment },
  props: {
    phoneId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      phoneItem: {},
      curNum: 0,
      fullName: '',
      isGetData: false
    }
  },
  created () {
    this.getPhone()
  },
  computed: {
    cartItem () {
      return {
        _id: this.phoneId,
        title: this.phoneItem.title,
        price: this.phoneItem.price,
        quantity: this.curNum,
        stock: this.phoneItem.stock
      }
    }
  },
  methods: {
    async getPhone () {
      try {
        const query = { query: { _id: this.phoneId } }
        const { data } = await getPhones(query)
        this.phoneItem = data[0]
        const UserData = await getUserInfo({ _id: this.phoneItem.seller })
        this.fullName = UserData.data[0].firstname + ' ' + UserData.data[0].lastname
        const cart = this.$store.state.cart
        cart.forEach(element => {
          if (element._id === this.phoneId) {
            this.curNum = element.quantity
          }
        })
        this.isGetData = true
      } catch (error) {
        console.log(error)
      }
    },
    handleCart () {
      if (!this.$store.state.user) {
        this.$router.push('/login')
        return
      }
      this.$prompt('Please enter the quantity: ', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /^[1-9]*[1-9][0-9]*$/,
        inputErrorMessage: 'Invalid Number'
      }).then(({ value }) => {
        if (value <= this.phoneItem.stock - this.curNum) {
          this.curNum += parseInt(value)
          this.$store.commit('addCartItem', this.cartItem)
          this.$message({
            type: 'success',
            message: 'Successfull'
          })
        } else {
          this.$message('Should not larger than stock number!')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel'
        })
      })
    }
  }
}
</script>

<style>
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

  .itemDetails {
    width: 1200px;
    margin: auto;
  }
  .img{
    float: left;
  }
  .cartRow{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .cartBtn{
    margin-right: 20px;
  }
  .cartSpan{
    font-size: 32px;
  }
</style>
