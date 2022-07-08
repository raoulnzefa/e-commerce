<template>
  <div class="comments">
    <el-card>
      <div slot="header">
        <span><strong>Comments</strong></span>
        <el-button type="primary" size="small" class="cBtn" @click="handleLoadMore">Load More</el-button>
      </div>
    <div v-for="(review,index) in curReviews" :key="index">
      <comment-item :review="review"/>
    </div>
    </el-card>
  </div>
</template>

<script>
import commentItem from './commentItem.vue'
export default {
  components: { commentItem },
  props: {
    reviews: Array
  },
  data () {
    return {
      endIndex: 3
    }
  },
  computed: {
    curReviews () {
      return this.reviews.slice(0, this.endIndex)
    }
  },
  methods: {
    handleLoadMore () {
      if (this.endIndex === this.reviews.length || this.reviews.length < this.endIndex) {
        this.$message('No more reviews!')
      }
      if (this.endIndex + 3 < this.reviews.length) {
        this.endIndex = this.endIndex + 3
      } else {
        this.endIndex = this.reviews.length
      }
    }
  }
}
</script>

<style>
  .cBtn{
    float: right;
  }

</style>
