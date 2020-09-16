<template>
  <div>
    <div :id="id" :style="mapStyle">111</div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'Echarts',
  props: {
    id: {
      type: String
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String
    },
    option: {
      type: Object
    },
  },
  data() {
    return {
      MyEcharts: '', // echarts实例
      mapStyle: {
        width: '100%',
        height: '450px'
      },
      styleWidth: '',
      styleHeight: ''
    }
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
        this.mapStyle.width = this.width
        if (this.MyEcharts) {
          if (newVal) {
            // 第一种方法：
            this.MyEcharts.clear()
            this.MyEcharts.setOption(newVal, true)
            // 第二种方法：
            /* let publicCharts = this.MyEchartsOption(newVal);
              console.log(publicCharts);
              this.MyEcharts.setOption(publicCharts, true); */
          } else {
            // 第一种方法：
            this.MyEcharts.clear()
            this.MyEcharts.setOption(oldVal, true)
            // 第二种方法：
            /* let publicCharts = this.MyEchartsOption(oldVal);
              this.MyEcharts.setOption(publicCharts, true); */
          }
        } else {
          this.InitCharts()
        }
      },
      deep: true // 对象内部属性的监听，关键。
    },

  },
  mounted() {
    this.InitCharts()
  },
  updated() {
    // console.info('00000')
    this.MyEcharts.resize()
  },
  methods: {
    InitCharts() {
      // 解决初始化宽度超出
      setTimeout(() => {
        this.MyEcharts = echarts.init(document.getElementById(this.id))
        this.MyEcharts.clear() // 适用于大数据量的切换时图表绘制错误,先清空在重绘
        this.MyEcharts.setOption(this.option, true) // 设置为true可以是图表切换数据时重新渲染
      })

      const _this = this
      window.addEventListener('resize', function() {
        _this.MyEcharts.resize()
      })
    },
  }
}
</script>
