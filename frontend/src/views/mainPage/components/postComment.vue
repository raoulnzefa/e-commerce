<template>
  <el-card>
    <div slot="header">
        <span><strong>Add Comments</strong></span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="Comment" prop="comment">
        <el-input type="textarea" v-model="form.comment"></el-input>
      </el-form-item>
      <el-form-item prop="rating">
        <span class="demonstration">Rating</span>
        <el-rate v-model="form.rating"></el-rate>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Post</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { postComment } from '@/api/phone'
import { getUserInfo } from '@/api/user'
export default {
  props: {
    phone_id: String
  },
  data () {
    const validateRate = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('Please enter rating'))
      } else {
        callback()
      }
    }
    return {
      form: {
        rating: null,
        comment: ''
      },
      rules: {
        comment: [{ required: true, message: 'Comment is required', trigger: 'blur' }],
        rating: [{ validator: validateRate, trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.$store.state.user) {
            try {
              const UserData = await getUserInfo({ email: this.$store.state.user })
              const ID = UserData.data[0]._id
              const body = {
                _id: this.phone_id,
                review: { ...this.form, reviewer: ID }
              }
              await postComment(body)
              location.reload()
              this.$message('post successfully!')
            } catch (error) {

            }
          } else {
            this.$router.push('/login')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>
