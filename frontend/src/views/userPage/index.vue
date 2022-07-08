<template>
  <div class="userPage">
    <h1 @click="$router.push('/')" class="">SellPhone</h1>
    <el-button type="success" @click="handleSignOut">Sign Out</el-button>
    <el-card class="editProfile">
      <div slot="header" class="clearfix">
        <span>Personal Info</span>
      </div>
      <el-form ref="userProfile" :label-position="labelPosition" label-width="100px" :model="formLabelAlign" class="userprofile" :rules="userRules">
        <el-form-item label="First Name" prop="firstname">
          <el-input v-model="formLabelAlign.firstname"></el-input>
        </el-form-item>
        <el-form-item label="Last Name" prop="lastname">
          <el-input v-model="formLabelAlign.lastname"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="formLabelAlign.email"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click.native.prevent="handleUpdate">Update profile</el-button>
    </el-card>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span>Please enter password</span>
      <el-input v-model="pwd" type="password"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleVerify">OK</el-button>
      </span>
    </el-dialog>
    <el-card class="changePWD">
      <div slot="header" class="clearfix">
        <span>Change Password</span>
      </div>
      <div class="cgpwd">
        Current Password: <el-input type="password" v-model="curPwd"></el-input>
        New Password: <el-input type="password" v-model="newPwd"></el-input>
        <el-button type="primary" class="cgbtn" @click="handleChange">Confirm</el-button>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>Manage Listing</span>
      </div>
      <el-button type="primary" @click="isListingShow=true">Add new listing</el-button>
      <manage-listing />
    </el-card>
    <el-dialog
      :visible.sync="isListingShow"
      width="30%"
      >
      <span>Please enter details</span>
      <el-form :label-position="labelPosition" label-width="80px" :model="newListing" :rules="addRules">
        <el-form-item label="Title" prop="title">
          <el-input v-model="newListing.title"></el-input>
        </el-form-item>
        <el-form-item label="Brand" prop="brand">
          <el-select v-model="newListing.brand" placeholder="Brand">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Stock" prop="stock">
          <el-input v-model="newListing.stock" type="number" :min="0"></el-input>
        </el-form-item>
        <el-form-item label="Price" prop="price">
          <el-input v-model="newListing.price" type="number" :min="0"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isListingShow = false">Cancel</el-button>
        <el-button type="primary" @click="handleAdd">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { getUserInfo, updateUserInfo, resetPwd } from '@/api/user'
import { addPhone } from '@/api/phone'
import { pwdVerify } from '@/api/auth'
import manageListing from './components/manageListing.vue'
export default {
  components: { manageListing },
  data () {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter valid email address!'))
      } else {
        callback()
      }
    }
    return {
      options: [
        {
          value: 'Samsung',
          label: 'Samsung'
        }, {
          value: 'Apple',
          label: 'Apple'
        }, {
          value: 'HTC',
          label: 'HTC'
        }, {
          value: 'Huawei',
          label: 'Huawei'
        }, {
          value: 'Nokia',
          label: 'Nokia'
        },
        {
          value: 'LG',
          label: 'LG'
        }, {
          value: 'Motorola',
          label: 'Motorola'
        }, {
          value: 'Sony',
          label: 'Sony'
        }, {
          value: 'BlackBerry',
          label: 'BlackBerry'
        }],
      isListingShow: false,
      dialogVisible: false,
      pwd: '',
      curPwd: '',
      newPwd: '',
      labelPosition: 'left',
      newListing: {
        title: '',
        brand: '',
        stock: 0,
        price: 0
      },
      formLabelAlign: {
        _id: '',
        firstname: '',
        lastname: '',
        email: '',
        disabled: false
      },
      userRules: {
        email: [{ required: true, trigger: 'blur', message: 'Email address is required' },
          { validator: validateEmail, trigger: 'blur' }],
        firstname: [{ required: true, trigger: 'blur', message: 'first name is required' }],
        lastname: [{ required: true, trigger: 'blur', message: 'last name is required' }]
      },
      addRules: {
        title: [{ required: true, trigger: 'blur', message: 'Title is required' }],
        brand: [{ required: true, trigger: 'blur', message: 'Brand is required' }],
        stock: [{ required: true, trigger: 'blur', message: 'Stock is required' }],
        price: [{ required: true, trigger: 'blur', message: 'Price is required' }]
      }
    }
  },
  computed: {
    img () {
      return `dataset_dev/phone_default_images/${this.newListing.brand}.jpeg`
    }
  },
  created () {
    this.getProfile()
  },
  methods: {
    handleSignOut () {
      this.$confirm('Are you sure to sign out?', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setUser', null)
        this.$store.commit('resetCart')
        this.$router.push('/')
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
    async handleVerify () {
      try {
        const body = {
          email: this.formLabelAlign.email,
          password: this.pwd
        }
        await pwdVerify(body)
        try {
          const body = {
            firstname: this.formLabelAlign.firstname,
            lastname: this.formLabelAlign.lastname,
            email: this.formLabelAlign.email,
            _id: this.formLabelAlign._id
          }
          await updateUserInfo(body)
          this.$message('successful!!')
          this.$store.commit('setUser', this.formLabelAlign.email)
          this.pwd = ''
          this.dialogVisible = false
        } catch (error) {
          if (error.response.status === 400) {
            this.$message('email already exists')
          }
        }
      } catch (error) {
        if (error.response.status === 400) {
          this.$message('wrong password!')
          this.pwd = ''
        }
      }
    },
    async getProfile () {
      try {
        const UserData = await getUserInfo({ email: this.$store.state.user })
        this.formLabelAlign = UserData.data[0]
      } catch (error) {
        console.log(error)
      }
    },
    handleUpdate () {
      this.$refs.userProfile.validate(async valid => {
        if (valid) {
          this.dialogVisible = true
        } else {
          console.log('error update!!')
          return false
        }
      })
    },
    async handleChange () {
      try {
        const body = {
          email: this.formLabelAlign.email,
          password: this.curPwd
        }
        await pwdVerify(body)
        const newPwd = {
          password: this.newPwd
        }
        await resetPwd(newPwd)
        this.$message('successful!')
        this.newPwd = ''
        this.curPwd = ''
      } catch (error) {
        this.$message('please enter correct password')
      }
    },
    async handleAdd () {
      try {
        const newData = this.newListing
        newData.image = this.img
        await addPhone(newData)
        this.newListing = {
          title: '',
          brand: '',
          stock: 0,
          price: 0
        }
        this.isListingShow = false
        location.reload()
        this.$message('Successfully Add')
      } catch (error) {
        this.$message('Add Failed')
      }
    }

  }
}
</script>

<style>
h1{
  cursor: pointer;
  display: inline-block;
  width: 200px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.editProfile{
  margin-bottom: 30px;
}
.userprofile{
  width: 800px;
  margin: auto;
}
.cgpwd{
  width: 300px;
  margin: auto;
}
.cgbtn{
  margin-top: 10px;
}
.changePWD{
  margin-bottom: 30px;
}
</style>
