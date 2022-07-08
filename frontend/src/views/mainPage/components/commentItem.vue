<template>
  <el-card>
      <div>
        Reviewer: {{reviewer}}
      </div>
      <div >
        Rating: {{review.rating}}
      </div>
      <div >
        Comment: {{commentShort}}
        <el-button type="primary" size="small" v-if="review.comment.length>200" @click="handleShowMore" :disabled="showBtn">Show More</el-button>
      </div>
  </el-card>
</template>

<script>
import { getUserInfo } from '@/api/user'
export default {
  props: {
    review: Object
  },
  data () {
    return {
      commentShort: '',
      showBtn: false,
      reviewer: ''
    }
  },
  created () {
    this.getReviewer()
  },
  mounted () {
    if (this.review.comment.length > 200) {
      this.commentShort = this.review.comment.substring(0, 200) + '...'
    } else {
      this.commentShort = this.review.comment
    }
  },
  methods: {
    async getReviewer () {
      try {
        const UserData = await getUserInfo({ _id: this.review.reviewer })
        this.reviewer = UserData.data[0].firstname + ' ' + UserData.data[0].lastname
      } catch (error) {
        console.log(error)
      }
    },
    handleShowMore () {
      this.commentShort = this.review.comment
      this.showBtn = true
    }
  }
}
</script>

<style>
</style>
