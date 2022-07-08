<template>
  <div class="signup">
    <el-dialog title="Reset Password" :visible="showreset" @close="btnCancel">
      <el-form ref="signUpForm" :model="formData" :rules="rules">
         <el-form-item label="email address" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button style="margin-right:30px;" @click="btnCancel">Cancel</el-button>
          <el-button type="primary" @click="btnOK" :loading="loading">OK</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { verification } from '@/api/auth'
import { validEmail } from '@/utils/validate'
export default {
  props: {
    showreset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter valid email address!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      formData: {
        email: ''
      },
      rules: {
        email: [{ required: true, message: 'Email is required', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }]
      }
    }
  },
  methods: {
    btnOK () {
      this.$refs.signUpForm.validate(async isOK => {
        if (isOK) {
          try {
            this.loading = true
            const msg = await verification(this.formData)
            if (msg.data.code === 0) {
              this.$message(msg.data.msg)
              this.$emit('update:showreset', false)
            } else {
              this.$message(msg.data.msg)
            }
          } catch (error) {
            console.log(error)
          } finally {
            this.loading = false
          }
        }
      })
    },
    btnCancel () {
      this.$emit('update:showreset', false)
      this.$refs.signUpForm.resetFields()
    }
  }
}
</script>

<style lang="less">
</style>
