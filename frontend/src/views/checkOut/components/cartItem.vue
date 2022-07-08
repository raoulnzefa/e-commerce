<template>
  <div class="cart">
    <el-card class="cartItem">
      <div class="cartDiv">
        {{'Title: ' + cartItem.title }}
      </div>
      <div class="cartDiv">
        {{'Price: ' + cartItem.price }}
      </div>
      <div class="cartDiv">
        {{'Quantity Selected: ' + cartItem.quantity }}
      </div>
    </el-card>
    <el-input-number v-model="cartItem.quantity" @change="handleChange" :min="0" :max="cartItem.stock" class="counter"></el-input-number>
    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete"></el-button>
  </div>
</template>

<script>

export default {
  props: {
    cartItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleChange () {
      this.$store.commit('changeQuantity', this.cartItem)
      this.$emit('changed')
    },
    handleDelete () {
      this.$confirm('Are you sure to remove the phone from the cart?', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.commit('removeCartItem', this.cartItem)
        this.$emit('changed')
        this.$message({
          showClose: true,
          message: 'Delete Cart Item',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel delete'
        })
      })
    }
  }
}
</script>

<style>
  .cartDiv {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .cartItem{
    display: inline-block;
    vertical-align: middle;
    margin-right: 50px;
    width: 500px;
  }
  .counter{
    margin-right: 50px;
  }
</style>
