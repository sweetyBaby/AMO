<template>
  <div class="table-tag">
    <a @click="handleData(item)" v-for="item in tableTab" :class="{'selected':item.selected === true}">{{ item.name }}</a>
  </div>
</template>

<script>
import moment from 'moment'
const tableTab = [
  {
    code: 'all',
    name: '全部',
    selected: true
  },
  {
    code: 'lastMonth',
    name: '上月',
    selected: false
  },
  {
    code: 'lastWeek',
    name: '上周',
    selected: false
  },
  {
    code: 'lastDay',
    name: '昨天',
    selected: false
  },
  {
    code: 'today',
    name: '今天',
    selected: false
  },
  {
    code: 'week',
    name: '本周',
    selected: false
  },
  {
    code: 'month',
    name: '本月',
    selected: false
  },
  {
    code: 'threeMonth',
    name: '近三个月',
    selected: false
  },
  {
    code: 'quarter',
    name: '本季度',
    selected: false
  },
  {
    code: 'year',
    name: '今年',
    selected: false
  }
]
const today = moment().format('YYYY-MM-DD')
const currentWeek = moment().startOf('week').format('YYYY/MM/DD')
const currentMonth = moment().startOf('month').format('YYYY/MM/DD')
const currentYear = moment().startOf('year').format('YYYY/MM/DD')
const currentQuarter = moment().startOf('quarter').format('YYYY/MM/DD')
const lastWeekstart = moment().week(moment().week() - 1).startOf('week').format('YYYY/MM/DD')
const lastWeekEnd = moment().week(moment().week() - 1).endOf('week').format('YYYY/MM/DD')
const lastMonthstart = moment().month(moment().month() - 1).startOf('month').format('YYYY/MM/DD')
const lastMonthEnd = moment().month(moment().month() - 1).endOf('month').format('YYYY/MM/DD')
const lastThreeMonth = moment().subtract(90, 'days').format('YYYY/MM/DD')
const yesterday = moment().subtract(1, 'days').format('YYYY/MM/DD')
console.info(currentWeek)
export default {
  name: 'TableTags',
  data () {
    return {
      tableTab,
      chooseTime: ''
    }
  },
  methods: {
    handleData(val) {
      this.tableTab.map(item => {
        item.selected = false
      })
      val.selected = !val.selected
      // console.info('选择了---',val.code)
      const chooseTag = val.code
      switch (chooseTag) {
        case 'lastMonth':
          this.chooseTime = 'lastMonth'
          break
        case 'lastWeek':
          this.chooseTime = 'lastWeek'
          break
        case 'lastDay':
          this.chooseTime = 'lastDay'
          break
        case 'today':
          this.chooseTime = 'today'
          break
        case 'week':
          this.chooseTime = 'week'
          break
        case 'month':
          this.chooseTime = 'month'
          break
        case 'threeMonth':
          this.chooseTime = 'threeMonth'
          break
        case 'quarter':
          this.chooseTime = 'quarter'
          break
        case 'year':
          this.chooseTime = 'year'
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
    padding: 0 0 16px 0;
    a{
      //margin: 0 8px 0 0;
      color: rgba(141, 156, 176, 1);
      font-size: 15px;
      font-weight: bold;
      padding: 8px 24px;
      &.selected{
        color: rgba(66, 131, 255, 1);
        background: rgba(244, 247, 252, 1);
      }
    }
  }
</style>
