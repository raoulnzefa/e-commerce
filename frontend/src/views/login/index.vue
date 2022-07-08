<template>
  <div class="login-container">
    <h1>Login Page</h1>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <el-form-item prop="email">
        <el-input
          ref="username"
          v-model="loginForm.email"
          placeholder="email address"
          name="email"
          type="email"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
          <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleSignUp">Sign-up</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-link type="primary" @click.native.prevent="handlereset">Reset Password</el-link>
    <SignUp :showDialog.sync="showDialog"/>
    <reset :showreset.sync="showreset"/>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import SignUp from './components/sign-up.vue'
import { login } from '@/api/auth'
import { mapActions } from 'vuex'
import reset from './components/reset.vue'
export default {
  name: 'Login',
  components: {
    SignUp, reset
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
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', message: 'Email address is required' },
          { validator: validateEmail, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', message: 'Password is required' }, { trigger: 'blur', min: 6, max: 10, message: 'Length should be 6-10' }]
      },
      loading: false,
      passwordType: 'password',
      showDialog: false,
      showreset: false,
      fromPath: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.fromPath = from.path
    })
  },
  methods: {
    ...mapActions(['user/login']),
    handleLogin () {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            this.loading = true
            const msg = await login(this.loginForm)
            if (msg.data.msg === 'ok') {
              this.$store.commit('setUser', this.loginForm.email)
              this.$message('login successfully')
              if (this.fromPath === '/ResetPassword') {
                this.$router.push('/')
              } else {
                this.$router.back()
              }
            }
          } catch (error) {
            console.log(error)
            this.$message('wrong account or password')
          } finally {
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSignUp () {
      this.showDialog = true
    },
    handlereset () {
      this.showreset = true
    }
  }
}
</script>
<style lang="less">
  .login-form{
    width: 1000px;
    margin: auto;
  }
  .el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
    margin-left: 0;
  }
</style>
