<template>
  <a-card>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库位汇总统计</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="searchTitle">
      <a-row>
        <div class="selectFirm">
          <!--<a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" href="javascript:;">
              {{selectedDistCode.distName}} <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="item in distNameList" :key="item.distCode" @click="distNameClick(item)">
                <a href="javascript:;">{{item.distName}}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
          <a-select
            style="width: 250px"
            placeholder="请选择我的客户"
            @change="distNameClick"
            v-model="queryParam.distCode"
            :showSearch="true"
            optionFilterProp="children"
            :filterOption="filterOption">
            <a-select-option v-for="item in distNameList" :value="item.distCode" :key="item.distCode" :title="item.distName">{{ item.distName }}</a-select-option>
          </a-select>
        </div>
        <!--<div class="selectType">
          <div class="proModel" @click="handleProModel">
            <span v-if="productModel.length === 0">请点击选择产品型号</span>
            <a-tag
                v-else
                v-for="(item,index) in productModel.slice(0,3)"
                :key="index"
            >
              {{ item }}
            </a-tag>
            <span class="proMore"><i class="iconfont icon-more" /></span>
          </div>
        </div>-->
        <div class="selectType">
          <div class="proModel" @click="handleStockModel">
            <span v-if="stockListModel.length === 0 && productModel.length === 0 ">请点击选择库位和产品型号</span>
            <span>
              <a-tag
                v-if="stockListModel.length > 0"
                v-for="(item,index) in stockListModel.slice(0,3)"
                :key="index"
              >
                {{ item }}
              </a-tag>
            </span>
            <span>
              <a-tag
                v-if="productModel.length > 0"
                v-for="(item,index) in productModel.slice(0,3)"
                :key="index"
              >
                {{ item }}
              </a-tag>
            </span>
            <span class="proMore"><i class="iconfont icon-more" /></span>
          </div>
        </div>
      </a-row>
    </div>
    <div style="width: 100%;height: 570px;">
      <MyEcharts :id="'summaryCharts'" :style="{width: '100%', height: '100%'}" :option="chartOption"></MyEcharts>
    </div>
    <stockList v-if="stockModel" :productModel="stockList" @closeMol="handleMClose" @ModelStock="handleMolStock" />
  </a-card>
</template>

<script>
import MyEcharts from './modules/echarts'
import ProModelList from './modules/ProModelList'
import stockList from './modules/stockList'
import { userDistRange } from '@/api/depot/wareHouse'
import { summaryList } from '@/api/analysis/analysis'
import { findProductMo } from '@/api/basicInfo/hosData'
import { exportTable, exportTabList } from '@/utils/storage'
export default {
  name: 'SummaryHouse',
  components: {
    MyEcharts,
    ProModelList,
    stockList
  },
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      chartOption: {},
      echartsXYcolor: '#fff000',
      lineColor: '#5bb1f0',
      productModel: [],
      stockListModel: ['自有库', '自有寄售库', '华润寄售库', '污损库'],
      stockModel: false,
      loadingSpin: false,
      tableList: [],
      stockList: {
        visible: false,
        distCode: '',
        checkList: {
          1: {
            checkList: [],
            checkListName: []
          },
          2: {
            checkList: [],
            checkListName: []
          },
          3: {
            checkList: [],
            checkListName: []
          },
          4: {
            checkList: [],
            checkListName: []
          },
          5: {
            checkList: [],
            checkListName: []
          }
        },
        checkTypeList: [1, 3, 2, 4],
        checkTypeListName: ['自有库', '自有寄售库', '华润寄售库', '污损库'],
        checkListName: [],
        checkProductList: []
      },
      queryParam: {
        distCode: '',
        productList: [],
        whType: [1, 3, 2, 4],
        whList: []
      },
      distNameList: [],
      selectedDistCode: {
        distCode: '',
        distName: ''
      },
      stockType: ['自有库', '华润寄售库', '自有寄售库', '污损库', '报废库'],
      yAxisData: [],
      seriesData: []
    }
  },
  created () {
    this.getDistNameData()
  },
  mounted () {

  },
  methods: {
    getProModel () { // 获取产品型号
      const params = {
        'productModel': '',
        'distCode': this.queryParam.distCode
      }
      findProductMo(params).then(res => {
        res.data.map(item => this.stockList.checkProductList.push(item.productModel))
        this.queryParam.productList = this.stockList.checkProductList.map(item => {
          return {
            productModel: item
          }
        })
        this.productModel = this.stockList.checkProductList.concat()
        this.getChartsData()
      })
    },
    filterOption (input, option) { // 搜索框过滤
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList.data,
          {
            ...this.queryParam,
            whReportList: this.tableList.data
          },
          '/amo/report/whReport/export',
          '库位汇总统计表'
        ).then(doc => {
          this.loadingSpin = false
        })
      }
    },
    distNameClick (data) { // 经销商切换
      /* this.selectedDistCode = {
          distName: data.distName,
          distCode: data.distCode
        } */
      // this.queryParam.distCode = data.distCode;
      this.stockList.distCode = this.queryParam.distCode
      if (this.queryParam.whType.length === 0) {
        this.queryParam.whType = [1, 3, 2, 4]
        this.queryParam.whList = []
        this.stockList.checkList = {
          1: {
            checkList: [],
            checkListName: []
          },
          2: {
            checkList: [],
            checkListName: []
          },
          3: {
            checkList: [],
            checkListName: []
          },
          4: {
            checkList: [],
            checkListName: []
          },
          5: {
            checkList: [],
            checkListName: []
          }
        }
        this.stockList.checkTypeList = [1, 3, 2, 4]
        this.stockList.checkTypeListName = ['自有库', '自有寄售库', '华润寄售库', '污损库']
        this.stockListModel = ['自有库', '自有寄售库', '华润寄售库', '污损库']
      }
      this.getChartsData()
    },
    getDistNameData () { // 获取经销商信息
      userDistRange().then(res => {
        this.distNameList = res.data
        this.selectedDistCode = res.data[0]
        this.queryParam.distCode = res.data[0].distCode
        this.stockList.distCode = res.data[0].distCode
        this.getProModel()
      })
    },
    getChartsData () { // 获取图表数据
      this.yAxisData = []
      this.seriesData = []
      summaryList(this.queryParam).then(res => {
        this.tableList = res
        if (this.stockList.checkTypeList.length > 0 || this.queryParam.whList.length < 1) {
          const array = []
          for (let i = 0; i < res.data.length; i++) {
            const index = parseInt(res.data[i].whType) - 1
            array.push(res.data[i].totalQty)
            this.yAxisData.push(this.stockType[index])
          }
          this.yAxisData.reverse()
          array.reverse()
          this.seriesData = [{
            name: '总量',
            type: 'bar',
            barWidth: 20,
            data: array
          }]
        } else {
          res.data.reverse()
          for (let i = 0; i < this.stockList.checkProductList.length; i++) {
            const array = []
            this.seriesData.push({
              name: this.stockList.checkProductList[i],
              type: 'bar',
              barMaxWidth: 20,
              data: array
            })
            for (let j = 0; j < res.data.length; j++) {
              const index = this.stockList.checkProductList[i]
              array.push(res.data[j][index])
              if (i === 0) {
                this.yAxisData.push(res.data[j].whName)
              }
            }
          }
        }
        this.initCharts()
      })
    },
    formatData (val) { // 格式化数据
      let arr1 = []
      let arr2 = []
      let arr3 = []
      let arr4 = []
      let arr5 = []
      if (val.checkList[1].checkList.length > 0) {
        arr1 = val.checkList[1].checkList.map((item, key) => {
          return {
            whCode: item,
            whName: val.checkList[1].checkListName[key],
            whType: 1
          }
        })
      }
      if (val.checkList[3].checkList.length > 0) {
        arr3 = val.checkList[3].checkList.map((item, key) => {
          return {
            whCode: item,
            whName: val.checkList[3].checkListName[key],
            whType: 3
          }
        })
      }
      if (val.checkList[2].checkList.length > 0) {
        arr2 = val.checkList[2].checkList.map((item, key) => {
          return {
            whCode: item,
            whName: val.checkList[2].checkListName[key],
            whType: 2
          }
        })
      }
      if (val.checkList[4].checkList.length > 0) {
        arr4 = val.checkList[4].checkList.map((item, key) => {
          return {
            whCode: item,
            whName: val.checkList[4].checkListName[key],
            whType: 4
          }
        })
      }
      if (val.checkList[5].checkList.length > 0) {
        arr5 = val.checkList[5].checkList.map((item, key) => {
          return {
            whCode: item,
            whName: val.checkList[5].checkListName[key],
            whType: 5
          }
        })
      }
      this.queryParam.whList = arr1.concat(arr3).concat(arr2).concat(arr4).concat(arr5)
    },
    handleMolStock (val) { // 提交库位
      this.queryParam.whList = []
      this.formatData(val)
      this.queryParam.whType = val.checkTypeList
      if (val.checkTypeList.length > 0) {
        this.stockListModel = val.checkTypeListName.concat()
      } else {
        this.stockListModel = val.checkListName.concat()
      }
      this.productModel = val.productList.concat()
      this.queryParam.productList = val.productList.map(item => {
        return {
          productModel: item
        }
      })
      this.stockList.checkList = val.checkList
      this.stockList.checkTypeList = val.checkTypeList
      this.stockList.checkTypeListName = val.checkTypeListName
      this.stockList.checkListName = val.checkListName
      this.stockList.checkProductList = val.productList.concat()
      this.stockModel = false
      this.stockList.visible = false
      this.getChartsData()
    },
    handleMClose () { // 型号关闭
      this.stockModel = false
      this.stockList.visible = false
    },
    handleStockModel () { // 库位选择
      this.stockModel = true
      this.stockList.visible = true
    },
    initCharts () { // 初始化图表
      this.chartOption = {
        toolbox: {
          feature: {
            dataView: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(220,221,255,0.3)'
            }
          },
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: '#DBDBDB',
          padding: 15,
          formatter: function (params) {
            let str = '<span style="font-weight: bold;color: #34353E;margin-bottom: 10px;display: inline-block;">' + params[0].name + '</span><br>'
            for (let i = 0; i < params.length; i++) {
              const icon = '<span style="display:inline-block;margin-bottom: 3px;margin-right:5px;border-radius:50%;width:5px;height:5px;background-color:' + params[i].color + ';"></span>'
              str += '<div style="margin: 10px 0;">' + icon + '<span style="color: #939393;padding: 0 5px;width: 80px;display: inline-block">' + params[i].seriesName + '</span><span style="color:#34353E;font-weight:bold;margin-left: 40px;">' + params[i].value + '</span></div>'
            }
            return str
          },
          extraCssText: 'box-shadow:0px 3px 6px rgba(0,4,123,0.3);'
        },
        legend: {
          selectedMode: false,
          orient: 'vertical',
          bottom: '55',
          left: 'right',
          align: 'left',
          itemWidth: 8,
          itemHeight: 8
        },
        xAxis: {
          axisTick: { show: false },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: 'rgb(244,244,244)'
            }
          },
          axisLabel: {
            color: 'rgba(177, 177, 177, 1)'
          },
          type: 'value'
        },
        yAxis: {
          type: 'category',
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: 'rgba(223, 223, 223, 1)'
            }
          },
          axisLabel: {
            color: 'rgba(177, 177, 177, 1)',
            interval: 0,
            formatter: function (params) {
              let newParamsName = ''
              const paramsNameNumber = params.length
              const provideNumber = 8 // 一行显示几个字
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = ''
                  const start = p * provideNumber
                  const end = start + provideNumber
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }
              return newParamsName
            }
          },
          data: this.yAxisData
        },
        toolbox: {
          show: false
        },
        series: this.seriesData,
        color: ['#A3ADF1', '#3E4DA8', '#E17877', '#B1B1B1', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
      }
    }
  },
  destroyed () {
    this.loadingSpin = false
  }
}
</script>

<style lang="less">
  .ant-card-bordered{
    border: none !important;
  }
  .searchTitle{
    .selectFirm{
      float: left;
      line-height: 32px;
    }
    .selectType{
      float: right;
      .ant-select-selection__placeholder{
        color: #49494B;
      }
    }
    .ant-dropdown-link{
      font-size: 14px;
      color: #34353E;
      font-weight:bold;
    }
  }
  .proModel{
    border:1px solid rgba(236,236,236,1);
    border-radius:4px;
    padding: 4px 48px 4px 12px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    margin-left: 10px;
    .proMore{
      position: absolute;
      cursor: pointer;
      height: 32px;
      right: 0;
      top:0;
      padding: 0 8px;
      background: rgba(246, 246, 247, 1);
      border-left: 1px solid rgba(233, 233, 233, 1);
      .iconfont {
        font-size: 22px;
      }
    }
  }
</style>
