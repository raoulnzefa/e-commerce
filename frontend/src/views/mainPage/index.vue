<template>
  <div class="mainPage">
    <div class="main">
      <div class="topbar">
        <h1 @click="jumpHome">SellPhone</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="search">
              <el-input v-model="title" placeholder="Search By Title" class="searchInput"></el-input>
              <el-button type="primary" icon="el-icon-search" class="searchBtn" @click="handleSearch">Search</el-button>
            </div>
          </el-col>
          <el-col :span="8" v-if="$store.state.user">
            <div class="loggedIn">
              <el-button type="success" class="profile" @click="handleProfile">Profile</el-button>
              <el-button type="success" @click="handleSignOut">Sign Out</el-button>
            </div>
          </el-col>
          <el-col :span="8" v-else><el-button type="success" @click="handleSignIn">Sign In</el-button></el-col>
          <el-col :span="8"><el-button type="warning" class="checkOut" @click="handleCheckOut">Check Out</el-button></el-col>
        </el-row>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'mainPage',
  data () {
    return {
      title: ''
    }
  },
  methods: {
    jumpHome () {
      this.curPhone = null
      this.$router.push('/')
    },
    handleSignIn () {
      this.$router.push('/login')
    },
    handleSignOut () {
      this.$confirm('Are you sure to sign out?', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setUser', null)
        this.$store.commit('resetCart')
        this.$message({
          type: 'success',
          message: 'Sign Out!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel Sign Out'
        })
      })
    },
    handleSearch () {
      if (this.title) {
        this.$router.push({
          name: 'search',
          params: {
            title: this.title
          }
        })
      } else {
        this.$message('Please enter title!')
      }
      this.title = ''
    },
    handleProfile () {
      this.$router.push('/userPage')
    },
    handleCheckOut () {
      if (!this.$store.state.user) {
        this.$router.push('/login')
      } else {
        this.$router.push('/checkOut')
      }
    }
  }
}
</script>

<style lang="less">
  .mainPage{
    h1{
      cursor: pointer;
    }
    .topbar{
      width: 1200px;
      margin: auto;
      .profile{
        margin-right: 20px;
      }
      .checkOut{
        float: right;
      }
      .el-row{
        margin-bottom: 20px;
      }
      .search{
        display: flex;
        align-content: space-between;
      }
    }
  }

</style>
