<template>
  <div class="search">
    <el-row :gutter="20" class="searchRow">
      <el-col :span="10">
        <el-select v-model="brand" placeholder="Brand Filter" @change="handleChange">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <div class="block">
              <span class="demonstration">Price Range Slider</span>
              <el-slider
                v-model="range"
                range
                show-stops
                :max="maxPrice"
                @change="handleSlider">
              </el-slider>
            </div>
        </el-col>
    </el-row>
    <el-card class="searchResult">
      <div slot="header" class="clearfix">
        <span>Search Results</span>
      </div>
      <div v-if="showResult.length===0">No Results</div>
      <div v-for="(item,index) in showResult" :key="index" class="text item">
        <phone-item :phone="item" type="title" @select="handleSelect">
          Title:
        </phone-item>
      </div>
    </el-card>
  </div>
</template>

<script>
import phoneItem from '../../../components/phoneItem.vue'
import { searchPhones, getBrands } from '@/api/phone'
export default {
  components: { phoneItem },
  props: {
    title: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    async getSearchPhones () {
      try {
        const query = { title: this.title }
        const { data } = await searchPhones(query)
        this.searchResult = data
        this.showResult = data
      } catch (error) {
        console.log(error)
      }
    },
    handleSelect (value) {
      this.$emit('phoneSelected', value)
    }, // brand change
    handleChange (value) {
      if (value === 'All') {
        this.showResult = this.searchResult.filter(item => item.price <= this.range[1] && item.price >= this.range[0])
      } else {
        this.showResult = this.searchResult.filter(item => item.brand === value && item.price <= this.range[1] && item.price >= this.range[0])
      }
      this.$message(value + ' Selected')
    },
    handleSlider (value) {
      if (this.brand === 'All' || this.brand === '') {
        this.showResult = this.searchResult.filter(item => item.price <= value[1] && item.price >= value[0])
      } else {
        this.showResult = this.searchResult.filter(item => item.brand === this.brand && item.price <= value[1] && item.price >= value[0])
      }
      this.$message('Range Applied')
    },
    async getBrands () {
      try {
        const { data } = await getBrands()
        data.forEach(element => {
          this.options.push({ value: element, label: element })
        })
      } catch (error) {

      }
    }
  },
  data () {
    return {
      searchResult: [],
      showResult: [],
      options: [
        {
          value: 'All',
          label: 'All'
        }],
      brand: '',
      maxPrice: 2000,
      range: [0, 2000]
    }
  },
  created () {
    this.getSearchPhones()
    this.getBrands()
  },
  watch: {
    title (newVal, oldVal) {
      this.getSearchPhones()
    }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .searchResult {
    margin: auto;
    width: 1000px;
    height: 1000px;
    overflow: scroll;
  }
  .searchRow{
    width: 1200px;
    display: inline-block;
    margin: auto;
  }
</style>
