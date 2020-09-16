<template>
  <div class="table-tag">
    <a @click="handleData(item)" v-for="item in tableTab" :class="{'selected':item.selected === true}">{{ item.name }}</a>
  </div>
</template>
<script>
import moment from 'moment'
const tableTab = [
  // {
  //   code:'week',
  //   name:'本周',
  //   selected:true
  // },
  // {
  //   code:'month',
  //   name:'本月',
  //   selected:false
  // },
  // {
  //   code:'year',
  //   name:'今年',
  //   selected:false
  // }
]
const today = moment().format('YYYY-MM-DD')
const currentWeek = moment().startOf('week').format('YYYY-MM-DD')
const currentMonth = moment().startOf('month').format('YYYY-MM-DD')
const currentYear = moment().startOf('year').format('YYYY-MM-DD')
export default {
  name: 'Analysis',
  data () {
    return {
      tableTab,
      chooseTime: {}
    }
  },
  methods: {
    moment,
    handleData(val) {
      this.tableTab.map(item => {
        item.selected = false
      })
      val.selected = !val.selected
      // console.info('选择了---',val.code)
      const chooseTag = val.code
      switch (chooseTag) {
        case 'week':
          this.chooseTime = {
            start: currentWeek,
            end: today
          }
          break
        case 'month':
          this.chooseTime = {
            start: currentMonth,
            end: today
          }
          break
        case 'year':
          this.chooseTime = {
            start: currentYear,
            end: today
          }
          break
        default:
          break
      }
      // console.info('this.chooseTime----',this.chooseTime)
      this.$emit('handleCheck', this.chooseTime)
    }
  }
}
</script>

<style lang="less">
  .table-tag{

  a{
  //margin: 0 8px 0 0;
    background: rgba(251, 251, 251, 1);
    color: rgba(141, 156, 176, 1);
    font-size: 15px;
    font-weight: bold;
    padding: 8px 24px;
  &.selected{
     color: white;
     background: rgba(62, 77, 168, 1);
   }
  }
  }
</style>
