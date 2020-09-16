<template>
  <a-select
    showSearch
    style="width: 100%;"
    placeholder="选择/输入医院名称"
    v-model="hosName"
    optionFilterProp="children"

    @change="handleChange"
  >
    <a-select-option
      v-for="item in hosData"
      :key="item.hosCode"
      :value="item.hosCode"
    >
      {{ item.hosName }}
    </a-select-option>
  </a-select>
</template>

<script>
import { retriveHostName } from '@/api/basicInfo/hosData'
export default {
  name: 'HosSearchVue',
  data() {
    return {
      hosData: [],
      queryParam: {
        page: 1,
        size: 9999
      },
      hosName: undefined,
      totalList: []
    }
  },
  created() {
    console.info('789ufsofjewiofjeow')
    this.getFirst()
  },
  methods: {
    getFirst() {
      retriveHostName(this.queryParam).then(res => {
        console.info('res', res)
        this.hosData = JSON.parse(JSON.stringify(res.data.list)).map(item => {
          return {
            hosCode: item.hosCode,
            hosName: item.hosName
          }
        }).splice(0, 99)
        this.totalList = res.data.list.map(item => {
          return {
            hosCode: item.hosCode,
            hosName: item.hosName
          }
        })
      })
    },
    filterOption(input, option) {
      // return (
      //   option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      // )
      return this.totalList.filter(function (user) {
        return user.code.toLowerCase().indexOf(input.toLowerCase()) !== -1// 当然如果是纯属字就可以不用转换小写了，处于习惯还是加上了
      })
    },
    handleChange(val) {
      console.info('keyCode---', val.keyCode)
      console.info('val---', val)
    }
  }
}
</script>
