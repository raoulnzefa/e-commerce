<template>
  <div class="signup">
    <el-dialog title="Sign Up" :visible="showDialog" @close="btnCancel">
      <el-form ref="signUpForm" :model="formData" :rules="rules">
        <el-form-item label="first name" prop="firstName">
          <el-input v-model="formData.firstname"></el-input>
        </el-form-item>
         <el-form-item label="last name" prop="lastName">
          <el-input v-model="formData.lastname"></el-input>
        </el-form-item>
         <el-form-item label="email address" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
         <el-form-item label="password" prop="password">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button style="margin-right:50px;" @click="btnCancel">Cancel</el-button>
          <el-button type="primary" @click="btnOK">OK</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { register } from '@/api/auth'
export default {
  props: {
    showDialog: {
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
      formData: {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      },
      rules: {
        firstname: [{ required: true, message: 'First name is required', trigger: 'blur' },
          { min: 1, max: 10, message: 'length should be 1-10', trigger: 'blur' }],
        lastname: [{ required: true, message: 'Last name is required', trigger: 'blur' },
          { min: 1, max: 10, message: 'length should be 1-10', trigger: 'blur' }],
        email: [{ required: true, message: 'Email is required', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' },
          { trigger: 'blur', min: 6, max: 10, message: 'Length should be 6-10' }]
      }
    }
  },
  methods: {
    btnOK () {
      this.$refs.signUpForm.validate(async isOK => {
        if (isOK) {
          try {
            await register(this.formData)
            this.$message('Please go to email for verification')
          } catch (error) {
            this.$message('Account already exit!')
          } finally {
            this.formData = {
              firstname: '',
              lastname: '',
              email: '',
              password: ''
            }
            this.$emit('update:showDialog', false)
            this.$router.back()
          }
        }
      })
    },
    btnCancel () {
      this.$emit('update:showDialog', false)
      this.$refs.signUpForm.resetFields()
    }
  }
}
</script>

<style lang="less">

</style>
