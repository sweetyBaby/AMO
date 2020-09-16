<template>
  <ve-line
    :series="series"
    :xAxis="xAxis"
    :yAxis="yAxis"
    :grid="grid"
  >
  </ve-line>
</template>

<script>
export default {
  props: ['dataSource'],
  data () {
    return {
      grid: {
        bottom: '20%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.dataSource.xData,
        splitLine: {
          color: 'rgba(229, 240, 255, 1)'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(229, 240, 255, 1)'
          }
        },
        axisLabel: {
          color: 'rgba(159, 172, 195, 1)'
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(229, 240, 255, 1)'
          }
        },
        axisLabel: {
          color: 'rgba(159, 172, 195, 1)'
        }
      },
      series: [{
        data: this.dataSource.yData,
        type: 'line',
        lineStyle: {
          color: 'rgba(66, 131, 255, 1)',
          width: 6
        },
        areaStyle: {
          color: 'rgba(229, 240, 255, 1)'
        }
      }]
    }
  }
}
</script>

<style lang="less" scoped>
</style>
