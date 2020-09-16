<template>
  <a-card>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>出入库统计</h3>
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
        <div class="searchList" style="padding: 0 0 12px 0;">
          <!--          <label for="">选择经销商</label>-->
          <a-select
            showSearch
            style="width: 240px"
            placeholder="全部"
            v-model="queryParam.distCode"
            optionFilterProp="children"
            :filterOption="filterOption"
            @change="handleDistChange"
          >
            <a-select-option v-for="item in distList" :key="item.distCode" :value="item.distCode">{{ item.distName }}</a-select-option>
          </a-select>
          <div class="selectTime">
            <span>单据日期：</span>
            <a-range-picker
              :defaultValue="[moment(queryParam.startDate, dateFormat), moment(queryParam.endDate, dateFormat)]"
              :format="dateFormat"
              @change="handleChangeTimer"
            />
          </div>
          <div class="selectType">
            <div class="proModel" @click="handleProModel">
              <span v-if="productModel.length === 0">点击选择产品型号</span>
              <a-tag
                v-else
                v-for="(item,index) in productModel.slice(0,3)"
                :key="index"
              >
                {{ item }}
              </a-tag>
              <span class="proMore"><i class="iconfont icon-more" /></span>
            </div>
          </div>
        </div>
      </a-row>
    </div>
    <div style="width: 100%;height: 570px;">
      <MyEcharts :id="'myCharts'" :style="{width: '100%', height: '100%'}" :option="chartOption"></MyEcharts>
    </div>
    <pro-model-list v-if="isChooseModel" :productModel="modelList" @closeMol="handleMClose" @ModelSub="handleMolSub" />
  </a-card>
</template>

<script>
import moment from 'moment'
import MyEcharts from './modules/echarts'
import { inoutReport } from '@/api/depot/depot'
import { userDistRange } from '@/api/depot/wareHouse'
import { findProductMo } from '@/api/basicInfo/hosData'
import { exportTable, exportTabList } from '@/utils/storage'
import ProModelList from './modules/ProModelList'
const dataList = [
  {
    dataId: 'warehouse',
    dataTotal: '153',
    title: '今日入库单数',
    icon: 'wareIcon'
  }, {
    dataId: 'stock',
    dataTotal: '153',
    title: '今日出库单数',
    icon: 'stockIcon'
  }, {
    dataId: 'invoice',
    dataTotal: '15',
    title: '今日开票数',
    icon: 'invoiceIcon'
  }, {
    dataId: 'inventory',
    dataTotal: '40',
    title: '库存预警',
    icon: 'inventoryIcon'
  }, {
    dataId: 'failure',
    dataTotal: '10',
    title: '失效预警',
    icon: 'failureIcon'
  }, {
    dataId: 'period',
    dataTotal: '10',
    title: '三产效期预警',
    icon: 'periodIcon'
  }]

export default {
  name: 'Access',
  components: {
    MyEcharts,
    ProModelList
  },
  created () {

  },
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      chartOption: {},
      echartsXYcolor: '#fff000',
      lineColor: '#5bb1f0',
      productModel: [],
      productModelDefaut: [],
      dataList: [],
      queryParam: {
        distCode: '',
        productList: undefined,
        startDate: moment().subtract(3, 'months').format('YYYY/MM/DD'),
        endDate: moment(new Date()).format('YYYY/MM/DD')
      },
      checkTime: moment().startOf('week').format('YYYY/MM/DD'),
      isInvoice: false,
      loadingSpin: false,
      xData: [],
      distList: [],
      tableList: [],
      yData: [
        {
          name: '进货入库',
          type: 'bar',
          barWidth: '11px',
          barGap: 0,
          data: []
        },
        {
          name: '退货入库',
          type: 'bar',
          barWidth: '11px',
          data: []
        },
        {
          name: '换货入库',
          type: 'bar',
          barWidth: '11px',
          data: []
        },
        {
          name: '销售出库',
          type: 'bar',
          barWidth: '11px',
          data: []
        },
        {
          name: '退货出库',
          type: 'bar',
          barWidth: '11px',
          data: []
        },
        {
          name: '换货出库',
          type: 'bar',
          barWidth: '11px',
          data: []
        }
      ],
      yMax: 500,
      mapColor: ['rgba(185, 239, 255, 1)', 'rgba(163, 173, 241, 1)', 'rgba(62, 77, 168, 1)', 'rgba(225, 120, 119, 1)', '#EEAFAE', 'rgba(177, 177, 177, 1)'],
      message: '99+',
      static: {
        scanTotal: 0,
        reservoir: 99,
        upTotal: 0
      },
      ChargeInfos: new Array(7),
      formatList: [],
      mapName: '出入库（个）',
      isChooseModel: false,
      modelList: {
        visible: false,
        checkList: []
      }
    }
  },
  mounted () {
    this.getProModel()
  },
  methods: {
    moment,
    handleChange (val) {
      const productList = val.map(item => {
        return {
          productModel: item
        }
      })
      this.queryParam.productList = productList
      this.getAanalysis()
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleDistChange () {
      // console.info('e---',dist)
      if (this.queryParam.distCode === 'qbkw~001') {
        this.queryParam.distCode = undefined
      }
      this.getAanalysis()
    },
    handleChangeTimer (date, dateString) {
      // console.info('date',date)
      if (date.length > 0) {
        this.queryParam.startDate = dateString[0]
        this.queryParam.endDate = dateString[1]
        this.getAanalysis()
      } else {
        this.$notification['error']({
          message: '提示',
          description: '日期不能为空！',
          duration: 4
        })
      }
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
            inoutReportList: this.tableList.data
          },
          '/amo/report/inoutReport/export',
          '出入库统计表'
        ).then(doc => {
          this.loadingSpin = false
        })
      }
    },
    initCharts () {
      this.chartOption = {
        title: {
          text: this.mapName,
          textStyle: {
            color: 'rgba(177, 177, 177, 1)',
            fontSize: '14px'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(220, 221, 255, 0.2)'
            }
          },
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: '#DBDBDB',
          padding: 15,
          formatter: (params) => {
            let str = '<span style="font-weight: bold;color: #34353E;margin-bottom: 10px;display: inline-block;">' + '型号 ' + params[0].name + '</span><br>'
            for (let i = 0; i < params.length; i++) {
              const icon = '<span style="display:inline-block;margin-bottom: 3px;margin-right:5px;border-radius:50%;width:5px;height:5px;background-color:' + params[i].color + ';"></span>'
              str += '<div style="margin: 10px 0;">' + icon + '<span style="color: #939393;padding: 0 5px;">' + params[i].seriesName + '</span><span style="color:#34353E;font-weight:bold;margin-left: 40px;">' + params[i].value + '</span></div>'
            }
            return str
          },
          extraCssText: 'box-shadow:0px 3px 6px rgba(0,4,123,0.3);'
        },
        legend: {
          selectedMode: false,
          bottom: '0',
          align: 'left',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 48,
          textStyle: {
            color: 'rgba(177, 177, 177, 1)'
          }
        },
        xAxis: {
          type: 'category',
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: 'rgba(223, 223, 223, 1)'
            }
          },
          axisLabel: {
            color: 'rgba(177, 177, 177, 1)'
          },
          data: this.xData
        },
        yAxis: {
          splitNumber: 4,
          min: 0,
          max: this.yMax,
          axisLine: {
            show: false
          },
          axisTick: {
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
        series: this.yData,
        color: this.mapColor,
        grid: {
          left: '48px',
          right: '0'
        }
      }
    },

    handleMapChange (val) {
      this.checkTime = val
    },

    getAanalysis () {
      const newMax = []
      inoutReport(this.queryParam).then(res => {
        this.yData.map((datas, i) => {
          datas.data = []
          this.tableList = res
          res.data.map(item => {
            const newMap = JSON.parse(JSON.stringify(item))
            delete newMap.productModel
            const totalMap = [
              newMap.type01,
              newMap.type02,
              newMap.type03,
              newMap.type11,
              newMap.type12,
              newMap.type13
            ]
            datas.data.push(totalMap[i])
          })
        })
        // console.info('this.yData---',this.yData)
        const newYData = JSON.parse(JSON.stringify(this.yData))
        newYData.map(timer => {
          newMax.push(this.sortMax(timer.data))
        })
        this.yMax = this.sortMax(newMax)
        this.initCharts()
      })
    },
    // 取最大值
    sortMax (arr) {
      const newMax = arr.sort((item, datas) => { return item - datas })
      return newMax[newMax.length - 1]
    },
    handleProModel () {
      this.isChooseModel = true
      this.modelList.visible = true
    },
    handleMClose () {
      this.isChooseModel = false
      this.modelList.visible = false
    },
    // 提交型号
    handleMolSub (val) {
      // console.info(val)
      this.productModel = val
      this.modelList.checkList = val
      this.xData = val
      this.queryParam.productList = val.map(item => {
        return {
          productModel: item
        }
      })
      this.isChooseModel = false
      this.modelList.visible = false
      this.getAanalysis()
    },
    // 初始化
    getProModel () {
      userDistRange().then(res => {
        if (res.data.length > 1) {
          res.data.unshift({
            distCode: 'qbkw~001',
            distName: '全部'
          })
          this.queryParam.distCode = undefined
        } else {
          this.queryParam.distCode = this.$store.state.user.info.distCode
        }
        this.distList = res.data
      })
      const params = {
        'productModel': ''
      }
      findProductMo(params).then(res => {
        const proMol = res.data.map(item => item.productModel)
        this.productModel = proMol
        this.productModelDefaut = proMol.slice(0, 2)
        const productList = proMol.slice(0, 7).map(item => {
          return {
            productModel: item
          }
        })
        this.modelList.checkList = proMol.slice(0, 7)
        this.xData = proMol.slice(0, 7)
        this.queryParam.productList = productList
        this.getAanalysis()
      })
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
    .selectTime{
      float: right;
      margin-left: 10px;
      .ant-calendar-range-picker-input{
        color: #49494B;
        font-weight: bold;
        font-size: 14px;
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
    .proMore{
      position: absolute;
      cursor: pointer;
      right: 0;
      top:0;
      padding: 0 8px;
      height: 32px;
      background: rgba(246, 246, 247, 1);
      border-left: 1px solid rgba(233, 233, 233, 1);
      .iconfont {
        font-size: 22px;
      }
    }
  }
</style>
