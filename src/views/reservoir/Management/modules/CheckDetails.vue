<template>
  <a-card :bordered="false">
    <div class="loading" v-show="loading">
      <a-spin />
    </div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存核查详情</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-drawer
        title="搜索条件"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        width="340">
        <a-form layout="inline">
          <div class="searchWrap">
            <div class="searchList">
              <label for="">产品型号</label>
              <a-input v-model="queryParam.productModel" placeholder="输入产品型号" style="width: 100%;" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="getDetailsData()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam.productModel = ''" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
    </div>
    <div class="detailsTitle">
      <a-row>
        <a-col :span="6">
          <div class="detailsTitleCell">
            <ReportingNum></ReportingNum>
            <div class="titleContent">
              <h3>{{ detailTitleData.uploadCount }}</h3>
              <p>库存上报数量</p>
            </div>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="detailsTitleCell">
            <Snapshot></Snapshot>
            <div class="titleContent">
              <h3>{{ detailTitleData.sysCount }}</h3>
              <p>库存快照数量</p>
            </div>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="detailsTitleCell">
            <Difference></Difference>
            <div class="titleContent">
              <h3>{{ detailTitleData.diffCount }}</h3>
              <p>库存差异数量</p>
            </div>
          </div>
        </a-col>
        <!--<a-col :span="6">
          <div class="detailsTitleCell" style="border-right: 1px solid #e9e9e9;">
            <div id="rateChart"></div>
            <div class="titleContent">
              <h3>{{detailTitleData.rate}}</h3>
              <p>库存上报准确率</p>
            </div>
          </div>
        </a-col>-->
      </a-row>
    </div>
    <div>
      <div class="TableTitle" v-show="!noData">
        <a-row>
          <a-col :span="9">产品名称/度数</a-col>
          <a-col :span="3">产品型号</a-col>
          <a-col :span="3">上报数量</a-col>
          <a-col :span="3">快照数量</a-col>
          <a-col :span="3">差异数量</a-col>
          <a-col :span="3">差异率</a-col>
        </a-row>
      </div>
      <div class="TableContent" v-for="(item,key) in DetailsData">
        <a-row>
          <a-col :span="9">
            <h3>{{ item.productName }}</h3>
            <p :title="'度数：'+item.degree">度数：{{ item.degree }}</p>
          </a-col>
          <a-col :span="3">{{ item.productModel }}</a-col>
          <a-col :span="3">{{ item.uploadCount }}</a-col>
          <a-col :span="3">{{ item.sysCount }}</a-col>
          <a-col :span="3">{{ item.diffCount }}</a-col>
          <a-col :span="3"><span>{{ item.rate*1000000/10000+'%' }}</span></a-col>
        </a-row>
        <div v-if="item.rate==1" class="tableBorder"></div>
        <div v-else class="tableBorder2"></div>
      </div>
    </div>
  </a-card>
</template>

<script>
// 引入 ECharts 主模块
import { DataFilter } from '@/utils/storage'
import ReportingNum from '@/assets/icons/reportingNum.svg?inline'
import Snapshot from '@/assets/icons/snapshot.svg?inline'
import Difference from '@/assets/icons/difference.svg?inline'
import { CheckDetailsList } from '@/api/depot/depot'
const echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'CheckDetails',
  props: ['detailTitleData'],
  components: {
    ReportingNum,
    Snapshot,
    Difference
  },
  data() {
    return {
      isShowSearch: false,
      loading: false,
      noData: true,
      queryParam: {
        page: 1,
        size: 100,
        productModel: '',
        distCode: '',
        timeFilter: '',
      },
      DetailsData: [],
      chartData: [
        { value: 80, hoverAnimation: false },
        { value: 20, hoverAnimation: false }
      ]
    }
  },
  created() {
    this.initDetails()
  },
  mounted() {
    // this.initChart();
  },
  methods: {
    initDetails() { // 初始化头部
      this.queryParam.distCode = this.detailTitleData.distCode
      this.queryParam.timeFilter = this.detailTitleData.timeFilter

      this.chartData[0].value = parseInt(this.detailTitleData.rate)
      this.chartData[1].value = 100 % -parseInt(this.detailTitleData.rate)
      this.getDetailsData()
    },
    getDetailsData() {
      this.loading = true
      CheckDetailsList(this.queryParam).then(res => {
        this.isShowSearch = false
        const CheckDetailsList = DataFilter(res, 'ware')
        this.DetailsData = CheckDetailsList.data
        if (CheckDetailsList.data.length === 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        this.loading = false
      })
    },
    initChart() {
      const MyEcharts = echarts.init(document.getElementById('rateChart'))
      const option = {
        series: [
          {
            type: 'pie',
            radius: ['65%', '70%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              },
            },
            data: this.chartData
          }
        ],
        color: ['#3E4DA8', '#F5F5F5']
      }
      MyEcharts.clear() // 适用于大数据量的切换时图表绘制错误,先清空在重绘
      MyEcharts.setOption(option) // 设置为true可以是图表切换数据时重新渲染
    },
    handleSearch() {
      this.isShowSearch = true
    },
    onSearchClose() { // 关闭搜索
      this.isShowSearch = false
    },
    handleBack() {
      this.$emit('checkDetailsData', false)
    }
  }
}
</script>

<style scoped lang="less">
.detailsTitle{
  .detailsTitleCell{
    border-left: 1px solid #e9e9e9;
    padding: 0 10px;
    svg{
      margin: 10px 20px 0 20px;
      width:48px;
      height: 48px;
    }
    #rateChart{
      margin: 4px 10px 0 10px;
      width:55px;
      height: 55px;
      display: inline-block;
    }
    .titleContent{
      display: inline-block;
      h3{
        color: #3e4da8;
        font-size: 24px;
        margin-bottom: 0;
      }
      p{
        font-size: 12px;
        color: #939393;
      }
    }
  }
}
  .TableTitle{
    margin-top: 20px;
    color: #B1B1B1;
    font-size: 12px;
    text-indent: 40px;
  }
  .TableContent{
    text-indent: 40px;
    margin-top: 20px;
    width: 100%;
    height:82px;
    line-height: 82px;
    box-shadow:0px 3px 15px rgba(172,173,183,0.2);
    opacity:1;
    border-radius:4px;
    position: relative;
    color: #939393;
    border: 2px solid #fff;
    .tableBorder{
      width: 3px;
      height: 48px;
      background: #ececec;
      position: absolute;
      top: 17px;
      left: 10px;
    }
    .tableBorder2{
      width: 3px;
      height: 48px;
      background: #FBC773;
      position: absolute;
      top: 17px;
      left: 10px;
    }
    h3{
      font-size: 14px;
      line-height: 20px;
      margin-top: 20px;
      font-weight: bold;
    }
    p{
      line-height: 20px;
      color: #b1b1b1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span{
      color: #3E4DA8;
    }
  }
.TableContent:hover{
  border: 2px solid #fbc773;
  height: 82px;
}
  .loading{
    background: rgba(0,0,0,0.05);
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: -20px;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
