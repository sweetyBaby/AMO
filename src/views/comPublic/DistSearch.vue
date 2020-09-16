<template>
  <a-select
    showSearch
    style="width: 100%;"
    placeholder="选择经销商名称"
    v-model="distName"
    optionFilterProp="children"
    @change="handleChange"
  >
    <a-select-option
      v-for="item in hosData"
      :key="item.distCode"
      :value="item.distCode"
    >
      {{ item.distName }}
    </a-select-option>
  </a-select>
</template>

<script>
import { userDistRange } from '@/api/depot/wareHouse'
export default {
  name: 'HosSearch',
  props: ['distNames'],
  data() {
    return {
      hosData: [],
      distName: undefined,
      totalList: []
    }
  },
  created() {
    this.getFirst()
  },
  methods: {
    getFirst() {
      this.distName = this.distNames
      userDistRange().then(res => {
        // console.info('res',res)
        this.hosData = res.data.map(item => {
          return {
            distCode: item.distCode,
            distName: item.distName
          }
        })
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      )
    },
    handleChange(val) {
      const distName = this.hosData.filter(item => {
        return item.distCode === val
      })
      // console.info('val---',val,distName)
      this.$emit('change', val)
    }
  },
  watch: {
    distNames(val) {
      console.info('val---', val)
    }
  }
}
</script>
