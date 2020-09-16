<template>
  <a-card>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>经销商销量统计</h3>
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
            style="width: 180px"
            placeholder="请选择我的客户"
            @change="distNameClick"
            v-model="queryParam.distCode"
            :showSearch="true"
            optionFilterProp="children"
            :filterOption="filterOption"
          >
            <a-select-option
              v-for="(item,key) in distNameList"
              :key="key"
              :value="item.distCode"
              :title="item.distName"
            >{{ item.distName }}</a-select-option>
          </a-select>
        </div>
        <div class="selectTime">
          <span>月份：</span>
          <a-month-picker
            :style="{width:'240px'}"
            v-model="queryParam.date"
            @change="onChangeDate"
            :disabledDate="disabledDate"
            :format="monthFormat"
          ></a-month-picker>
        </div>
        <div class="selectType">
          <div class="proModel" @click="handleProModel">
            <span v-if="productModel.length === 0">请点击选择产品型号</span>
            <a-tag v-else v-for="(item,index) in productModel.slice(0,3)" :key="index">{{ item }}</a-tag>
            <span class="proMore">
              <i class="iconfont icon-more" />
            </span>
          </div>
        </div>
      </a-row>
    </div>
    <div style="width: 100%;height: 570px;">
      <MyEcharts :id="'salesCharts'" :style="{width: '100%', height: '100%'}" :option="chartOption"></MyEcharts>
    </div>
    <pro-model-list
      v-if="isChooseModel"
      :productModel="modelList"
      @closeMol="handleMClose"
      @ModelSub="handleMolSub"
    />
  </a-card>
</template>

<script>
import moment from 'moment'
import MyEcharts from './modules/echarts'
import { userDistRange, getDocumentCusList } from '@/api/depot/wareHouse'
import { findProductMo } from '@/api/basicInfo/hosData'
import { salesList } from '@/api/analysis/analysis'
import ProModelList from './modules/ProModelListSales'
import { exportTable, exportTabList } from '@/utils/storage'
export default {
  name: 'Sales',
  components: {
    MyEcharts,
    ProModelList
  },
  data() {
    return {
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      currentDate: new Date(),
      chartOption: {},
      color:
        'linear-gradient(90deg,rgba(62,77,168,1) 0%,rgba(225,120,119,1) 100%)',
      distNameList: [],
      productModel: [],
      cusAll: [],
      cusSelected: [],
      isChooseModel: false,
      modelList: {
        visible: false,
        checkList: []
      },
      cusList: [],
      yAxisData: [],
      seriesData: [],
      dataZoom: [],
      selectedDistCode: {
        distCode: '',
        distName: ''
      },
      tableList: [],
      queryParam: {
        distCode: '',
        cusCode: '',
        productList: [],
        // startDate: moment().subtract(3, 'months').format('YYYY-MM-DD'),
        // endDate: moment(new Date()).format('YYYY-MM-DD')
        // month: moment(new Date()).format('YYYY-MM'),
        date: moment(new Date()).format('YYYY-MM'),
      }
    }
  },
  mounted() {
    this.getProModel()
    this.getDistNameData()
    this.initCharts()
  },
  methods: {
    moment,
    disabledDate(current) {
      return !current.isBetween(
        moment('2019-9', 'YYYY-MM'),
        moment().endOf('month')
      )
    },
    onChangeDate(value, dateString) {
      // 日期更改
      this.queryParam.date = value ? moment(value).format('YYYY-MM') : null
      this.getChartsData()
    },
    filterOption(input, option) {
      // 搜索框过滤
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
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
          '/amo/report/sales/export',
          '经销商销量计表',
          true
        ).then(doc => {
          this.loadingSpin = false
        })
      }
    },
    // 初始化产品型号
    getProModel() {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        const proMol = res.data.map(item => item.productModel)
        const index1 = proMol.indexOf('1MTEC30')
        proMol.splice(index1, 1)
        const index2 = proMol.indexOf('EMERALDC')
        proMol.splice(index2, 1)
        const index3 = proMol.indexOf('HEALON')
        proMol.splice(index3, 1)
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
      })
    },
    handleProModel() {
      // 型号选择
      this.isChooseModel = true
      this.modelList.visible = true
    },
    getCusList() {
      const param = {
        distCode: this.queryParam.distCode,
        docType: '11'
      }
      if (this.queryParam.distCode === '') {
        this.cusList = [
          {
            cusName: '全部',
            cusCode: ''
          }
        ]
        this.queryParam.cusCode = []
        this.cusSelected = ['']
        this.getChartsData()
        return false
      }
      this.cusList = []
      this.cusAll = []
      getDocumentCusList(param).then(res => {
        this.cusList = res.data.cusList
        this.cusList.unshift({
          cusName: '全选-取消全选',
          cusCode: 'all'
        })
        this.cusList.map(item => {
          this.cusAll.push(item.cusCode)
        })
        this.cusSelected = this.cusAll.concat()
        this.cusSelected.shift()
        // this.queryParam.cusCode = this.cusList[0].cusCode;
        this.queryParam.cusCode = []
        this.getChartsData()
      })
    },
    getChartsData() {
      // 获取图表数据
      this.yAxisData = []
      this.seriesData = []
      if (this.cusSelected.length === 0) {
        this.initCharts()
        return false
      }
      salesList(this.queryParam).then(res => {
        if (res.data.length > 0) {
          this.tableList = res
          for (let i = 0; i < res.data.length; i++) {
            this.yAxisData.push(res.data[i].productModel)
            this.seriesData.push(res.data[i].qty)
          }
          this.yAxisData.reverse()
          this.seriesData.reverse()
        }

        if (this.yAxisData.length < 11) {
          this.dataZoom = []
        } else {
          const end = this.yAxisData.length
          console.log(end)
          if (end > 0) {
            this.dataZoom = [
              {
                type: 'slider',
                width: 12,
                start: end,
                end: 100,
                handleSize: 8,
                right: 50,
                showDataShadow: false,
                yAxisIndex: [0],
                zoomLock: true
              }
            ]
          } else {
            this.dataZoom = [
              {
                type: 'slider',
                start: 99,
                end: 100,
                handleSize: 8,
                showDataShadow: false,
                yAxisIndex: [0],
                zoomLock: true
              }
            ]
          }
        }
        this.initCharts()
      })
    },
    // 提交型号
    handleMolSub(val) {
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
      this.getChartsData()
    },
    handleMClose() {
      // 型号关闭
      this.isChooseModel = false
      this.modelList.visible = false
    },
    distNameClick() {
      // 经销商切换
      /* this.selectedDistCode = {
          distName: data.distName,
          distCode: data.distCode
        }
        this.queryParam.distCode = data.distCode; */
      this.getCusList()
    },
    getDistNameData() {
      // 获取经销商信息
      userDistRange().then(res => {
        this.distNameList = res.data
        if (this.distNameList.length > 1) {
          this.distNameList.unshift({
            distCode: '',
            distName: '全部'
          })
        }
        this.selectedDistCode = this.distNameList[0]
        this.queryParam.distCode = this.distNameList[0].distCode
        this.getCusList()
      })
    },
    onChange() {},
    handleChange() {
      const allIndex = this.cusSelected.indexOf('all')
      if (allIndex !== -1) {
        const length = this.cusAll.length
        if (this.cusSelected.length === length) {
          // this.cusSelected = this.cusAll.concat()
          this.cusSelected = []
          this.queryParam.cusCode = []
        } else {
          this.cusSelected = this.cusAll.concat()
          this.cusSelected.shift()
          this.queryParam.cusCode = []
        }
      } else if (this.cusSelected[0] === '') {
        this.queryParam.cusCode = []
      } else {
        this.queryParam.cusCode = this.cusSelected
      }
      this.getChartsData()
    },
    initCharts() {
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
          formatter: function(params) {
            let str =
              '<span style="font-weight: bold;color: #34353E;margin-bottom: 10px;display: inline-block;"> 型号 ' +
              params[0].name +
              '</span><br>'
            for (let i = 0; i < params.length; i++) {
              const icon =
                '<span style="display:inline-block;margin-bottom: 3px;margin-right:5px;border-radius:50%;width:5px;height:5px;background-color:#3E4DA8;"></span>'
              str +=
                '<div style="margin: 10px 0;">' +
                icon +
                '<span style="color: #939393;padding: 0 5px;">' +
                params[i].seriesName +
                '</span><span style="color:#34353E;font-weight:bold;margin-left: 40px;">' +
                params[i].value +
                '</span></div>'
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
          minInterval: 1,
          axisLine: {
            show: false
          },
          axisLabel: {
            color: 'rgba(177, 177, 177, 1)'
          },
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: 'rgb(244,244,244)'
            }
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
            color: 'rgba(177, 177, 177, 1)'
          },
          data: this.yAxisData
        },
        toolbox: {
          show: false
        },
        dataZoom: this.dataZoom,
        series: [
          {
            name: '销量',
            barWidth: 20,
            label: {
              show: true,
              position: 'right'
            },
            itemStyle: {
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: '#3E4DA8' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#E17877' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            },
            type: 'bar',
            barGap: 0,
            data: this.seriesData
          }
        ]
      }
    }
  }
}
</script>

<style lang="less">
.ant-card-bordered {
  border: none !important;
}
.searchTitle {
  .selectFirm {
    float: left;
    line-height: 32px;
  }
  .selectType {
    float: right;
    margin: 0 5px;
    .ant-select-selection__placeholder {
      color: #49494b;
    }
  }
  .selectTime {
    float: right;
    margin-left: 10px;
    .ant-calendar-range-picker-input {
      color: #49494b;
      font-weight: bold;
      font-size: 14px;
    }
  }
  .ant-dropdown-link {
    font-size: 14px;
    color: #34353e;
    font-weight: bold;
  }
}
.proModel {
  border: 1px solid rgba(236, 236, 236, 1);
  border-radius: 4px;
  padding: 4px 48px 4px 12px;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  margin-left: 10px;
  .proMore {
    position: absolute;
    cursor: pointer;
    right: 0;
    top: 0;
    padding: 0 8px;
    height: 32px;
    background: rgba(246, 246, 247, 1);
    border-left: 1px solid rgba(233, 233, 233, 1);
    .iconfont {
      font-size: 22px;
    }
  }
}

//上传中
.uploading {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.65);
  z-index: 99;
  left: 0;
  top: 0;
  .ant-spin-text {
    color: #fff;
    position: relative;
    top: 250px;
  }
  .ant-spin-dot {
    top: 250px;
    i {
      background-color: #fff;
    }
  }
}
</style>
