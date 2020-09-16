<template>
  <div class="page-header-index-wide">
    <div class="homePage">
      <div class="pageLeft">
        <div class="page_Title pad-l-md">
          <a-row :gutter="24">
            <a-col :span="16">
              <h3>
                {{ this.$store.state.user.info.distName ? this.$store.state.user.info.distName :'无锡医迈德科技有限公司' }}
              </h3>
            </a-col>
            <a-col :span="8" :style="pageStyle">
              <div class="icons-list pageTitle-Btn">
                <span class="titleBtn" @click="handleZeroUp">
                  <a-tooltip placement="bottomRight">
                    <template slot="title">
                      <span>0销量上报</span>
                    </template>
                    <i class="iconfont icon-zeroSale" ></i>
                  </a-tooltip>
                </span>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="stainedWrap">
          <div class="stainedBor"></div>
          <div class="stainedPrice">
            <span class="stainedImg">
              <upload-svg />
            </span>
            <div class="stainedCon">
              <p>扫码率</p>
              <span class="priceFont">
                {{ static.scanTotal }}
                <span style="font-size:12px;margin-left:5px;display:inline;">%</span>
              </span>

              <!-- <span class="priceGrey">敬请期待...</span>  -->
            </div>
          </div>
          <div class="stainedBor"></div>
          <div class="stainedPrice">
            <span class="stainedImg">
              <inventory-svg />
              <!-- <a-progress
                type="circle"
                :percent="static.reservoir"
                :format="percent => `${percent}`"
                strokeColor="#3E4DA8"
                :width="68"
              />-->
            </span>
            <div class="stainedCon">
              <!-- <span class="priceFont"><span style="font-size:12px;margin-left:31px;display:inline;">%</span></span> -->
              <p>库存准确率</p>
              <span class="priceGrey">敬请期待...</span>
            </div>
          </div>
          <div class="stainedBor"></div>
          <div class="stainedPrice currentPrice">
            <span class="stainedImg">
              <scan-svg />
            </span>
            <div class="stainedCon">
              <!-- <span class="priceFont">{{ static.upTotal }}<span style="font-size:12px;margin-left:5px;display:inline;">%</span></span> -->
              <p>附件上传率</p>
              <span class="priceGrey">敬请期待...</span>
            </div>
          </div>
          <div class="stainedBor"></div>
        </div>
        <div class="pageDataView">
          <a-row :gutter="16">
            <a-col :xxl="16" :xl="16" :lg="24" :md="24" :sm="24">
              <div class="dataList">
                <div class="page_Title">
                  <h3>数据总览</h3>
                </div>
                <a-row :gutter="24">
                  <a-col
                    :xxl="8"
                    :xl="12"
                    :lg="12"
                    :md="12"
                    :sm="24"
                    v-for="item in dataList"
                    :key="item.id"
                  >
                    <div
                      class="dataWrap"
                      @click="detailList(item.itemName)"
                      :class="( item.itemTitle === '库存预警' && item.itemValue >= 0 ) ? 'cardStyle' : '' "
                    >
                      <span>
                        <i :class="dataIcon(item.icon)" />
                      </span>
                      <div class="dataCon">
                        <h3>{{ item.itemValue }}</h3>
                        <p>{{ item.itemTitle }}</p>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
            <a-col :xxl="8" :xl="8" :lg="24" :md="24" :sm="24">
              <div class="page_Title">
                <h3>常用功能</h3>
              </div>
              <div class="userLink">
                <a-row :gutter="24">
                  <a-col
                    :xxl="12"
                    :xl="12"
                    :lg="6"
                    :md="6"
                    :sm="12"
                    v-for="item in userLink"
                    :key="item.id"
                  >
                    <div class="linkList">
                      <a-tag>
                        <a @click="handleLink(item.name)">{{ item.title }}</a>
                      </a-tag>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="pageSale">
          <div class="page_Title">
            <h3 class="page_tab">
              <span @click="handleMap('WareHouse')" :class="!isInvoice ? 'active' : ''">出入库统计</span>
              <span @click="handleMap('Invoice')" :class="isInvoice ? 'active' : ''">开票统计</span>
            </h3>
            <analysis-tag @handleCheck="handleMapChange" />
          </div>
          <div class="saleMap">
            <div style="width: 100%;height: 460px;">
              <MyEcharts :id="'myCharts'" :width="mapStyle.width" :option="chartOption"></MyEcharts>
            </div>
          </div>
        </div>
        <div class="pageFooter">
          <dl>
            <dd>
              <span>
                <i class="iconfont icon-contact" />
              </span>
              <div class="footerCon">
                <h3>联系客服</h3>
                <p>400-1009-708</p>
              </div>
            </dd>
            <dd>
              <span>
                <i class="iconfont icon-download" />
              </span>
              <div class="footerCon">
                <h3>下载中心</h3>
                <p>
                  <a
                    href="https://cdcs.oss-cn-shanghai.aliyuncs.com/webroot/amo/template/%E7%BF%94%E4%BA%91%E5%85%A8%E8%A7%86%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%ADPPT.pptx"
                  >培训PPT下载</a>
                </p>
              </div>
            </dd>
            <dd>
              <span>
                <i class="iconfont icon-questions" />
              </span>
              <div class="footerCon">
                <h3>常见问题</h3>
                <p>
                  <a href>系统常见问题</a>
                </p>
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <div class="pageRight">
        <div class="page_Title">
          <h3>消息提醒({{ message }})</h3>
          <!--          <div class="icons-list pageTitle-Btn">-->
          <!--            <span class="titleBtn" @click="handleAdd()">-->
          <!--              <a-tooltip placement="top">-->
          <!--                <template slot="title">-->
          <!--                  <span>清理</span>-->
          <!--                </template>-->
          <!--                <i class="iconfont icon-clear" />-->
          <!--              </a-tooltip>-->
          <!--            </span>-->
          <!--          </div>-->
        </div>
        <div v-if="showMessage">
          <div class="page_waiting" v-for="item in messageData" :key="item.id">
            <pend-agency :agencyData="item" :key="item.key" @click.native="handelPend(item)" />
          </div>
          <a @click="handleToMessage">查看更多</a>
        </div>
        <div v-else class="EmptyStyle">
          <div class="emptCont">
            <i class="iconfont icon-listEmpty" />
            <p>暂无消息</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DataCard from './modules/DataCard'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea,
  PendAgency
} from '@/components'
import { mapState, mapActions } from 'vuex'
import SalesArea from './modules/SalesArea'
import ScanSvg from '@/assets/icons/indexSvg01.svg?inline'
import UploadSvg from '@/assets/icons/indexSvg02.svg?inline'
import InventorySvg from '@/assets/icons/indexSvg03.svg?inline'
import MyEcharts from './modules/echarts'
import AnalysisTag from './modules/AnalysisTag'
import { fetchIndexInfos, fetchIndexByCondition, setZero } from '@/api/depot/wareHouse'
const dataTotal = [
  {
    icon: 'icon-firm',
    total: '56',
    title: '厂商总量',
    key: 'firmTotal'
  },
  {
    icon: 'icon-supplier',
    total: '512',
    title: '供应商总量',
    key: 'supTotal'
  },
  {
    icon: 'icon-wareHouse',
    total: '856',
    title: '今日入库',
    key: 'wareTotal'
  },
  {
    icon: 'icon-newUsers',
    total: '15',
    title: '今日新增客户',
    key: 'newUtoday'
  },
  {
    icon: 'icon-volume',
    total: '201',
    title: '客户总量',
    key: 'volumeTotal'
  },
  {
    icon: 'icon-proLine',
    total: '36',
    title: '产品线总数',
    key: 'proLineTotal'
  },
  {
    icon: 'icon-proTotal',
    total: '1250',
    title: '产品总数',
    key: 'proTotal'
  },
  {
    icon: 'icon-newUsers1',
    total: '9',
    title: '昨日新增客户',
    key: 'newUyesterday'
  }
]
const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment()
      .add(i, 'days')
      .format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }
]
const messageData = []

const saleOrder = {
  xData: ['2018-05-22', '2018-05-23', '2018-05-24', '2018-05-25', '2018-05-26'],
  yData: [19810, 4398, 52910, 19810, 4398]
}
const dataList = [
  {
    dataId: 'warehouse',
    dataTotal: '153',
    title: '今日入库单数',
    icon: 'wareIcon'
  },
  {
    dataId: 'stock',
    dataTotal: '153',
    title: '今日出库单数',
    icon: 'stockIcon'
  },
  {
    dataId: 'invoice',
    dataTotal: '15',
    title: '今日开票数',
    icon: 'invoiceIcon'
  },
  {
    dataId: 'inventory',
    dataTotal: '40',
    title: '库存预警',
    icon: 'inventoryIcon'
  },
  {
    dataId: 'failure',
    dataTotal: '10',
    title: '失效预警',
    icon: 'failureIcon'
  },
  {
    dataId: 'period',
    dataTotal: '10',
    title: '三产效期预警',
    icon: 'periodIcon'
  }
]

const userLink = [
  {
    key: 'link01',
    name: 'WareHouse',
    title: '产品入库'
  },
  {
    key: 'link02',
    name: 'Delivery',
    title: '产品出库'
  },
  {
    key: 'link03',
    name: 'OutVoucher',
    title: '出入库单凭证'
  },
  {
    key: 'link04',
    name: 'AuditManage',
    title: '发票管理'
  }
]

const containWrapL = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 16 }
}

const containWrapR = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 8 }
}

export default {
  name: 'HomePage',
  components: {
    SalesArea,
    DataCard,
    MiniSmoothArea,
    PendAgency,
    ScanSvg,
    InventorySvg,
    UploadSvg,
    MyEcharts,
    AnalysisTag
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    getSideBar() {
      return this.$store.state.collapsed
    }
  },
  created() {
    this.getIndexInfo()
  },
  data() {
    return {
      showMessage: true,
      date: 'today',
      salesTotal: '201',
      upNum: '150',
      dataTotal,
      searchUserData,
      searchUserScale,
      dataList: [],
      userLink,
      saleData: 'lastDay',
      waiting: '99+',
      messageData: [],
      saleOrder,
      chartOption: {},
      echartsXYcolor: '#fff000',
      lineColor: '#5bb1f0',
      checkTime: moment()
        .startOf('week')
        .format('YYYY-MM-DD'),
      isInvoice: false,
      xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      yData: [],
      yMax: 500,
      mapColor: ['rgba(62, 77, 168, 1)', 'rgba(244, 192, 120, 1)'],
      message: '99+',
      static: {
        scanTotal: 0,
        reservoir: 60,
        upTotal: 0
      },
      ChargeInfos: new Array(7),
      formatList: [],
      mapName: '出入库（个）',
      umo: '个',
      containWrapL,
      containWrapR,
      isCollapsed: false,
      mapStyle: {
        width: '100%',
        height: '100%'
      },
      sideBar: this.$store.state.collapsed,
      pageStyle: {
        'padding-right': '0'
      }
    }
  },
  mounted() {
    // console.log(this.$store.state.user.info.distCode);
    this.initCharts()
    // console.info("checkTime---", this.checkTime);
  },
  methods: {
    moment,
    handelPend(val) {
      // console.log(val);
      const h = this.$createElement
      const newContent = val.noticeContent.split('<br/>')
      this.$success({
        class: 'noticeStyle',
        title: h('h4', {}, val.noticeTitle),
        content: h(
          'div',
          {},
          newContent.map(item => {
            return h('p', item)
          })
        )
      })
    },
    detailList(val) {
      let hasRoute = 0
      const newRoute = []
      /*
       * console.info(' this.mainMenu---', this.mainMenu)
       * this.menus = this.mainMenu.find(item => (item.path === "/")).children;
       */
      this.menus = this.mainMenu[0].children
      const routeList = this.mainMenu[0].children
      const currentRoute = this.$router.currentRoute.path
      routeList.map((item, index) => {
        item.children.map((second, i) => {
          second.children.map((third, j) => {
            // console.log(third.meta.permission[0]);
            newRoute.push(third.meta.permission[0])
          })
        })
      })
      hasRoute = newRoute.findIndex(item => {
        return item === val
      })
      if (hasRoute >= 0) {
        return this.$router.push({ name: val })
      }
      this.$notification.error({
        message: '提示',
        description: `很抱歉你暂无权限查看`
      })
    },
    handleDateChange(e) {
      this.date = e.target.value
    },
    handleSale(e) {
      this.saleData = e.target.value
    },
    // 零销量上报
    handleZeroUp() {
      this.$confirm({
        title: '提示',
        content: '确定上报0销量?',
        onOk() {
          const params = {}
          setZero(params).then(res => {
            console.info('确定上报0销量', res)
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    handleLink(val) {
      let hasRoute = 0
      const newRoute = []
      this.menus = this.mainMenu.find(item => item.path === '/').children
      const routeList = this.mainMenu[0].children
      const currentRoute = this.$router.currentRoute.path
      routeList.map((item, index) => {
        item.children.map((second, i) => {
          second.children.map((third, j) => {
            // console.log(third.meta.permission[0]);
            newRoute.push(third.meta.permission[0])
          })
        })
      })
      hasRoute = newRoute.findIndex(item => {
        return item === val
      })
      if (hasRoute >= 0) {
        return this.$router.push({ name: val })
      }
      this.$notification.error({
        message: '提示',
        description: `很抱歉你暂无权限查看`
      })

      //   this.$router.push({ name: val });
    },
    dataIcon(icon) {
      return 'iconfont icon-' + icon
    },
    initCharts() {
      // console.info('this.mapStyle---',this.mapStyle)
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
              color: 'rgba(226, 226, 226, 0.3)'
            }
          },
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: '#DBDBDB',
          padding: 15,
          formatter: params => {
            let str =
              '<span style="font-weight: bold;color: #34353E;margin-bottom: 10px;display: inline-block;">' +
              params[0].name +
              '</span><br>'
            for (let i = 0; i < params.length; i++) {
              const icon =
                '<span style="display:inline-block;margin-bottom: 3px;margin-right:5px;border-radius:50%;width:5px;height:5px;background-color:' +
                params[i].color +
                ';"></span>'
              str +=
                '<div style="margin: 10px 0;">' +
                icon +
                '<span style="color: #939393;padding: 0 5px;">' +
                params[i].seriesName +
                '</span><span style="color:#34353E;font-weight:bold;margin-left: 40px;">' +
                params[i].value +
                this.umo +
                '</span></div>'
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
    handleMap(val) {
      // console.info("val---", val);
      if (val === 'Invoice') {
        this.isInvoice = true
        this.getChangeMap('invoice')
      } else {
        this.isInvoice = false
        this.getChangeMap('ware')
        this.initCharts()
      }
      this.checkTime = moment()
        .startOf('week')
        .format('YYYY-MM-DD')
    },
    handleMapChange(val) {
      this.checkTime = val
    },
    handleToMessage() {
      this.$router.push({
        name: 'MessageTable'
      })
    },
    getIndexInfo() {
      const dataIcon = [
        'stockIcon',
        'wareIcon',
        'invoiceIcon',
        'inventoryIcon',
        'failureIcon',
        'periodIcon'
      ]
      const _that = this
      // 首页基础信息
      fetchIndexInfos().then(res => {
        // console.log("============", res.data.statisticlRatio);
        const fetchData = res.data
        res.data.statisticlRatio.map((item, index) => {
          if (index === 0) {
            _that.static.scanTotal = Number(item.itemValue * 100).toFixed(2)
          } else if (index === 1) {
            _that.static.reservoir = Number(item.itemValue * 100).toFixed(2)
          } else if (index === 2) {
            _that.static.upTotal = Number(item.itemValue * 100).toFixed(2)
          }
        })
        _that.dataList = fetchData.dataSummary.map((item, index) => {
          if (
            item.itemTitle === '失效预警' ||
            item.itemTitle === '三产效期预警'
          ) {
            item.itemValue = '敬请期待...'
          } else {
            item.itemValue = Number(item.itemValue).toFixed(0)
          }
          return {
            ...item,
            // itemValue: Number(item.itemValue).toFixed(0),
            icon: dataIcon[index]
          }
        })
        _that.getInitial(fetchData)
        _that.xData = [
          _that.getTime(0) + '周一',
          _that.getTime(1) + '周二',
          _that.getTime(2) + '周三',
          _that.getTime(3) + '周四',
          _that.getTime(4) + '周五',
          _that.getTime(5) + '周六',
          _that.getTime(6) + '周日'
        ]
        _that.formatList = [
          _that.getTime(0),
          _that.getTime(1),
          _that.getTime(2),
          _that.getTime(3),
          _that.getTime(4),
          _that.getTime(5),
          _that.getTime(6)
        ]
        _that.initCharts()
        fetchData.unReadNoticeList.map((item, index) => {
          if (index < 4) {
            this.messageData.push(item)
          }
        })
        if (this.messageData.length === 0) {
          this.showMessage = false
        } else {
          this.showMessage = true
        }

        this.message =
          fetchData.unReadNoticeList.length > 99
            ? '99+'
            : fetchData.unReadNoticeList.length
      })
    },
    sortMax(arr) {
      let staticMax = 0
      arr.sort((item, arr) => {
        if (item - arr > 0) {
          staticMax = item
        }
      })
      return staticMax
    },
    getTime(val) {
      return moment().startOf('week').add(val, 'days').format('YYYY-MM-DD')
    },
    getChangeMap(val) {
      let params
      if (val === 'invoice') {
        params = {
          cycleType: 'week',
          dataType: 'charge_num'
        }
      } else {
        params = {
          cycleType: 'week',
          dataType: 'in_num'
        }
      }
      fetchIndexByCondition(params).then(res => {
        const fetchList = res.data
        if (val === 'invoice') {
          this.chargeInfos = fetchList.currentWeekChargeInfos.map(item => {
            return item.yValue
          })
          this.yData = [
            {
              name: '开票统计',
              type: 'bar',
              barWidth: '11px',
              barGap: 0,
              data: this.chargeInfos
            }
          ]
          this.mapColor = ['rgba(62, 77, 168, 1)']
          const staticMax = this.sortMax(this.chargeInfos)
          this.yMax = staticMax[staticMax.length - 1]
          this.mapName = '发票（张）'
          this.umo = '张'
        } else {
          this.getInitial(fetchList)
        }
        this.initCharts()
      })
    },
    getInitial(arrList) {
      this.yData = [
        {
          name: '入库总量',
          type: 'bar',
          barWidth: '11px',
          barGap: 0,
          data: [320, 332, 301, 334, 500, 320, 332, 301, 334, 390, 320, 332]
        },
        {
          name: '出库总量',
          type: 'bar',
          barWidth: '11px',
          data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290, 220, 182]
        }
      ]
      const staticIn = new Array(7)
      const staticOut = new Array(7)
      const statisticTotal = arrList.currentWeekInInfos.map(item => {
        return item.yValue
      })
      const statisticOut = arrList.currentWeekOutInfos.map(item => {
        return item.yValue
      })
      let staticMax = 0
      const inTotal = this.sortMax(statisticTotal)
      const newTotal = this.sortMax(statisticOut)
      if (inTotal - newTotal > 0) {
        staticMax = inTotal
      } else {
        staticMax = newTotal
      }
      this.yMax = staticMax[staticMax.length - 1]

      // console.info("statisticTotal---", statisticTotal);

      for (let i = 0; i < 7; i++) {
        staticIn[i] = statisticTotal[i] ? statisticTotal[i] : 0
        staticOut[i] = statisticOut[i] ? statisticOut[i] : 0
      }
      this.yData[0].data = staticIn
      this.yData[1].data = staticOut
      this.mapColor = ['rgba(62, 77, 168, 1)', 'rgba(244, 192, 120, 1)']
      this.mapName = '出入库（个）'
      this.umo = '个'
    }
  },
  watch: {
    getSideBar(newVal, oldVal) {
      const bodyWidth = document.getElementById('app').offsetWidth - 440

      let newWrap = bodyWidth
      if (!newVal) {
        newWrap = bodyWidth
      } else {
        newWrap = bodyWidth - 240
      }
      // console.info('this.sideBar',newVal,newWrap)
      this.mapStyle.width = newWrap + 'px'
      this.initCharts()
    }
  }
}
</script>

<style lang="less">
.EmptyStyle {
  display: flex;
  height: 50%;
  align-items: center;
  justify-content: center;
}
.emptCont {
  color: #b1b1b1;
  .icon-listEmpty {
      color:#ECECEC;
    font-size: 60px;
  }
}
.noticeStyle {
  .ant-modal-confirm-body {
    padding: 0 16px 0 32px;
    .ant-modal-confirm-content {
      max-height: 320px;
      overflow-y: auto;
      > div {
        padding-right: 10px;
        p {
          margin: 0;
        }
      }
    }
  }
}
.ant-modal-confirm-title h4 {
  font-weight: 700;
}
.cardStyle {
  span {
    // border:1px solid #3e4da8!important;
    .icon-inventoryIcon {
      color: #e17877 !important;
    }
  }
}

.ant-modal-success {
  .ant-modal-content {
    .ant-modal-confirm-btns {
      .ant-btn {
        width: 100%;
      }
    }
  }
}
.pad-t-md {
  padding: 40px 0 0 0;
}
.homePage {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 0 300px 36px 0;
  min-height: cacl(100vh - 68px);
  .pageLeft {
    padding: 0 36px 24px 36px;
    width: auto;
    /*border-right: 1px solid rgba(229, 240, 255, 1);*/

    .page_Title {
      width: 100%;
      .ant-row{
        width: 100%;
      }
      h3 {
        font-weight: bold;
        font-size: 16px;
      }
      &.pad-l-md {
        padding: 12px 0 0 72px;
      }
      .page_tab {
        span {
          font-weight: bold;
          cursor: pointer;
          margin: 0 16px 0 0;
          padding: 0 16px 12px 16px;
          border-bottom: 2px solid rgba(239, 239, 239, 1);
          color: rgba(177, 177, 177, 1);
          &.active {
            color: rgba(62, 77, 168, 1);
            border-color: rgba(62, 77, 168, 1);
          }
          &:hover {
            color: rgba(62, 77, 168, 1);
            border-color: rgba(62, 77, 168, 1);
          }
        }
      }
    }
    .pageQuick {
      width: 100%;
      padding: 16px 0;
      a {
        font-size: 14px;
        color: rgba(66, 131, 255, 1);
        background: rgba(249, 251, 255, 1);
        padding: 8px 24px;
        margin: 0 10px 0 0;
      }
    }
    .pageBorder {
      height: 1px;
      width: 100%;
      background: rgba(229, 240, 255, 1);
    }
    .pageSale {
      padding: 32px 0;
      width: 100%;
      h3 {
        padding: 0 0 24px 0;
      }
      .saleBorder {
        width: 100%;
        box-sizing: border-box;
        background: rgba(249, 251, 255, 1);
        border: 1px solid rgba(229, 240, 255, 1);
        opacity: 1;
        border-radius: 10px;
        padding: 30px 0;
        text-align: center;
        .progress {
          width: 100%;
          text-align: center;
          .ant-progress {
            max-width: 120px;
          }
        }
        h3 {
          font-size: 14px;
          color: rgba(47, 60, 93, 1);
          font-weight: bold;
          padding: 0;
        }
        span.sales_num {
          font-size: 32px;
          color: rgba(66, 131, 255, 1);
          font-weight: bold;
          display: inline-block;
          padding: 24px 0;
        }
        p {
          font-size: 12px;
          color: rgba(159, 172, 195, 1);
          margin: 0;
          &.sales_contrast {
            display: inline-block;
            padding: 12px 0 0 0;
            span {
              color: rgba(84, 97, 130, 1);
              display: inline-block;
              line-height: 29px;
              float: left;
              &.sales_number {
                padding: 0 4px;
                color: rgba(84, 97, 130, 1);
              }
            }
          }
        }
        .iconfont {
          font-size: 24px;
          display: inline-block;
          float: left;
          line-height: 1;
          &.icon-up {
            color: orange;
          }
          &.icon-down {
            color: green;
          }
        }
      }
    }
    .saleMap {
      width: 100%;
    }
  }
  .pageRight {
    width: 300px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    box-sizing: border-box;
    padding: 14px 30px;
    background: rgba(249, 249, 249, 1);
    .page_waiting {
      cursor: pointer;
      .agency {
        .agency_top .agencyInfo {
          p {
            font-size: 14px;
            color: #b1b1b1;
            margin: 0;
            max-height: 63px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    .page_Title {
      padding: 0 0 24px 0;
      color: rgba(62, 77, 168, 1);
      h3 {
        font-weight: bold;
        color: #3e4da8;
      }
    }
    a {
      font-size: 14px;
      color: rgba(207, 207, 207, 1);
      text-align: center;
      width: 100%;
      display: block;
      &:hover {
        color: rgba(62, 77, 168, 1);
      }
    }
  }
  .stainedWrap {
    margin: 40px 0 16px 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    border: none;
    .stainedBor {
      width: 1px;
      background: rgba(233, 233, 233, 1);
      height: 100%;
      min-height: 68px;
      display: inline-block;
    }
    .stainedPrice {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      border: none;
      position: relative;
      .cricel {
        svg {
          width: 48px !important;
          height: 48px !important;
        }
        .ant-progress-text {
          display: none;
        }
      }
      .stainedImg {
        padding: 6px 24px 0 0;
        display: inline-block;
        svg {
          width: 68px;
          height: 68px;
          font-size: 20px;
        }
      }
      .stainedCon {
        padding: 12px 0 0 0;
        span {
          font-size: 20px;
          color: rgba(62, 77, 168, 1);
          font-weight: bold;
          display: block;
          width: 100%;
          height: 36px;
          small {
            font-size: 12px;
            color: rgba(62, 77, 168, 1);
            font-weight: normal;
          }
        }
        p {
          font-weight: bold;
          font-size: 14px;
          color: #3e4da8;
          padding: 6px 0 0 0;
          margin: 0;
        }
        span.priceGrey {
          font-size: 14px;
          color: grey;
          font-weight: normal;
          line-height: 32px;
        }
      }
      .ant-progress-inner {
        width: 68px;
        height: 68px;
        .ant-progress-text {
          position: absolute;
          left: 92px;
          top: 18px;
          font-size: 24px;
          color: rgba(62, 77, 168, 1);
          font-weight: bold;
          padding: 0;
          text-align: left;
          svg {
            width: 54px;
            height: 54px;
            font-size: 54px;
          }
        }
      }
    }
  }
  .pageDataView {
    width: 100%;
    display: inline-block;
    padding: 24px 0 0 0;
    .dataWrap {
      height: 81px;
      cursor: pointer;
      width: 100%;
      box-shadow: 0px 3px 20px rgba(246, 246, 248, 1);
      border-radius: 8px;
      background: white;
      padding: 16px 32px;
      display: inline-block;
      margin: 10px 0 10px 0;
      @media (max-width: 1680px) {
        padding: 16px;
      }
      &:hover {
        box-shadow: 0px 3px 20px rgba(172, 173, 183, 0.4);
      }
      span {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        background: rgba(251, 251, 251, 1);
        float: left;
        text-align: center;
        line-height: 48px;
        margin: 0 20px 0 0;
        .iconfont {
          font-size: 22px;
          color: rgba(62, 77, 168, 1);
        }
      }
      .dataCon {
        float: left;
        h3 {
          margin-bottom: 4px;
          font-size: 16px;
          font-weight: bold;
          color: rgba(177, 177, 177, 1);
        }
        p {
          margin: 0;
          font-size: 14px;
          color: rgba(147, 147, 147, 1);
        }
      }
    }
  }
  //常用功能
  .userLink {
    background: white;
    box-shadow: 0px 3px 20px rgba(246, 246, 248, 1);
    margin: 10px 0;
    padding: 26px;
    display: inline-block;
    width: 100%;
    .linkList {
      margin: 10px 0;
    }
    .ant-tag {
      border: none;
      border-radius: 4px;
      display: block;
      line-height: 36px;
      height: 48px;
      width: 100%;
      text-align: center;
      padding: 0;
      a {
        border-radius: 4px;
        width: 100%;
        height: 48px;
        padding: 8px 0;
        background: rgba(251, 251, 251, 1);
        display: block;
        font-size: 14px;
        color: rgba(147, 147, 147, 1);
        text-align: center;
        margin: 0;
      }
      &:hover {
        a {
          background: rgba(236, 236, 236, 1);
          color: rgba(62, 77, 168, 1);
          font-weight: bold;
        }
      }
    }
  }
  .pageFooter {
    text-align: center;
    dl {
      display: flex;
      //   width: 600px;
      margin: 48px auto;
      justify-content: center;
      dd:last-child {
        margin-right: 0px;
      }
      dd {
        position: relative;
        padding: 0 0 0 60px;
        display: inline-block;
        margin-right: 100px;
        // float: left;
        span {
          position: absolute;
          left: 0;
          top: 0;
          line-height: 46px;
          .iconfont {
            font-size: 40px;
            color: rgba(62, 77, 168, 1);
          }
        }
        .footerCon {
          text-align: left;
          h3 {
            font-size: 14px;
            color: rgba(147, 147, 147, 1);
            padding: 0 0 4px 0;
            margin: 0;
          }
          p {
            font-size: 14px;
            margin: 0;
            a {
              color: rgba(147, 147, 147, 1);
            }
          }
          &:hover {
            p {
              a {
                color: rgba(62, 77, 168, 1);
              }
            }
          }
        }
      }
    }
  }
}
</style>
