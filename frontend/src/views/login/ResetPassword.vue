<template>
  <div class="login-container">
    <h1>Reset Password</h1>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
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
      <el-form-item prop="secondpassword">
        <el-input
          :key="passwordType"
          ref="secondpassword"
          v-model="loginForm.secondpassword"
          :type="passwordType"
          placeholder="Password"
          name="secondpassword"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
          />
      </el-form-item>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Reset Password!</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { ResetPsd } from '@/api/auth'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        secondpassword: '',
        password: ''
      },
      loginRules: {
        password: [{ required: true, trigger: 'blur', message: 'Password is required' }, { trigger: 'blur', min: 6, max: 10, message: 'Length should be 6-10' }]
      },
      loading: false,
      passwordType: 'password',
      showDialog: false,
      resetid: '',
      showreset: false
    }
  },
  mounted () {
    if (this.getQueryString('resetid')) {
      this.loginForm.id = this.getQueryString('resetid')
    }
  },
  methods: {
    ...mapActions(['user/login']),
    getQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r === null) {
        var reg2 = /^.*?[?]/
        var r2 = window.location.hash.replace(reg2, '')
        r = r2.match(reg)
      }
      if (r != null) return r[2]
      return null
    },
    handleLogin () {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          if (this.loginForm.secondpassword !== this.loginForm.password) {
            this.$message('Two passwords should be the same')
            return
          }
          this.loading = true
          try {
            this.loading = true
            const msg = await ResetPsd(this.loginForm)
            if (msg.data.msg === 'ok') {
              this.$message('Reset Password  successfully')
              this.$router.push('/login')
            } else {
              this.$message(msg.data.msg)
            }
          } catch (error) {
            console.log(error)
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
