<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>
            <span>{{ pageTitle }}</span>
          </h3>
        </a-col>
        <a-col :md="12">
          <div class="scanInput">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handlBack()">
                <a-tooltip placement="top" v-model="isShowTool">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back" />
                </a-tooltip>
              </span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline">
      <div class="basicBorder">
        <a-row :gutter="24" v-if="proInfo.docType === '20' || proInfo.docType === '21'">
          <a-col span="8">
            <label for="" class="basicTitle">单据号码</label>
            <div class="basicInfo">
              <span>{{ proInfo.docNo }}</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">单据日期</label>
            <div class="basicInfo">
              <span>{{ moment(proInfo.docDate).format('YYYY-MM-DD') }}</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">目标库位名称</label>
            <div class="basicInfo">
              <span>{{ proInfo.whNameTo }}</span>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-else>
          <a-col span="8">
            <label for="" class="basicTitle">经销商名称</label>
            <div class="basicInfo">
              <span>{{ proInfo.distName }}</span>
            </div>
          </a-col>
          <a-col span="8" v-if="proInfo.distribution === null">
            <label for="" class="basicTitle">客户名称</label>
            <div class="basicInfo">
              <span>{{ cusName }}</span>
            </div>
          </a-col>
          <a-col span="8" v-if="proInfo.distribution !== null">
            <label for="" class="basicTitle">配送商名称</label>
            <div class="basicInfo">
              <span>{{ proInfo.distribution }}</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">单据日期</label>
            <div class="basicInfo">
              <span>{{ moment(proInfo.docDate).format('YYYY-MM-DD') }}</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">经销商代码</label>
            <div class="basicInfo">
              <span>{{ proInfo.distCode }}</span>
            </div>
          </a-col>
          <a-col span="8" v-if="proInfo.distribution === null">
            <label for="" class="basicTitle">客户代码</label>
            <div class="basicInfo">
              <span>{{ proInfo.cusCode }}</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">单据号码</label>
            <div class="basicInfo">
              <span>{{ proInfo.docNo }}</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">业务类型</label>
            <div class="basicInfo">
              <span>{{ docType }}</span>
            </div>
          </a-col>
          <a-col span="8" v-if="proInfo.docType !== '11' && proInfo.docType !== '12' && proInfo.docType !== '13'">
            <label for="" class="basicTitle">库位名称</label>
            <div class="basicInfo">
              <span>{{ whName }}</span>
            </div>
          </a-col>
          <a-col span="8" v-if="proInfo.docType !== '11' && proInfo.docType !== '12' && proInfo.docType !== '13'">
            <label for="" class="basicTitle">库位代码</label>
            <div class="basicInfo">
              <span>{{ proInfo.whCode }}</span>
            </div>
          </a-col>
          <a-col span="8" class="lastBorder">
            <label for="" class="basicTitle">单据备注</label>
            <div class="basicInfo">
              <span>{{ proInfo.remark }}</span>
            </div>
          </a-col>
          <a-col span="8" v-if="proInfo.cusCode === 'SVCT9999999' && proInfo.reportReason">
            <label for="" class="basicTitle">调整理由</label>
            <div class="basicInfo">
              <span>{{ proInfo.reportReason }}</span>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="wareWrap" :style="wareStyle">
        <scan-ware :scanData="scanDataList" :type="detail" :isDelivery="isDelivery" />
      </div>
    </a-form>
  </a-card>
</template>

<script>
import moment from 'moment'
import { proDetail, proAllotDetail, getAutoJson, getDocumentWhList, getDocumentCusList, getSuccessAutoJson } from '@/api/depot/wareHouse'
import ScanWare from './modules/ScanWare'
import { saveParamsFromStore, getParamsFromStore } from '@/utils/storage'
const proList = [{
  id: 'product01',
  productNameCn: '可重复使用直线型切割吻合器和一次性钉仓',
  proType: 'AR40e',
  serialNumber: '4092571409',
  degree: '27.5D',
  batchNumber: '20180112',
  qty: '1',
  uom: '个',
  scode: '国食药监械（进）字2013第3222864号',
  effectiveDateBegin: '2018-01-12',
  effectiveDateEnd: '2019-09-01',
  registration: 'MIP60005234949'
}]
export default {
  name: 'ProDetail',
  props: ['infoData'],
  components: {
    ScanWare
  },
  data() {
    return {
      productList: [],
      docType: '进货入库',
      detail: 'detail',
      wareStyle: { 'maxHeight': 'calc(100vh - 160px)' },
      scanDataList: [],
      whNameTo: '',
      isDelivery: false,
      proInfo: {},
      pageTitle: '',
      backRoute: '',
      routerQuery: {},
      whName: '',
      cusName: '',
      isShowTool: false,
      getParamsRed: {}
    }
  },
  created() {
    this.getFirst()
  },
  methods: {
    moment,
    handlBack() {
      this.$router.push({
        name: this.backRoute,
        params: this.routerQuery
      })
      this.isShowTool = false
    },
    getFirst() {
      const _that = this
      this.scanDataList = []
      let getParams
      if (this.$route.params.pageTitle) {
        getParams = this.$route.params
        saveParamsFromStore(getParams, 'PRODETAIL')
        this.getParamsRed = getParams
      } else {
        getParams = getParamsFromStore('PRODETAIL')
        console.info(getParamsFromStore('PRODETAIL'))
        this.getParamsRed = getParamsFromStore('PRODETAIL')
      }
      // console.info('new---params--',getParams)
      this.pageTitle = getParams.pageTitle
      this.backRoute = getParams.parentCom
      this.routerQuery = {
        ...getParams
      }
      if (getParams.proInfo) {
        this.proInfo = getParams.proInfo
        this.checkDocType(getParams.proInfo.docType)
        const params = {
          docNo: getParams.proInfo.docNo
        }
        // console.info('this.infoData---',this.infoData)
        if (getParams.proInfo.docType === '20' || getParams.proInfo.docType === '21') {
          proAllotDetail(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.scanDataList = res.data.list
              this.whNameTo = res.data.whNameTo
              this.proInfo.whNameTo = res.data.whNameTo
            }
          })
        } else {
          // console.info('getParams---',getParams)
          proDetail(params).then(res => {
            if (res.message === 'SUCCESS') {
              // console.info('res----',res)
              res.data.detailList.map(item => {
                item.errorMessage = 'false'
              })
              this.scanDataList = res.data.detailList
            }
          })
          this.cusName = getParams.proInfo.cusName
          this.whName = getParams.proInfo.whName
          // this.getCusList(params,getParams.proInfo.cusName)
        }
      } else if (getParams.fileId) {
        const params = {
          id: getParams.fileId
        }
        getSuccessAutoJson(params).then(res => {
          if (res.message === 'SUCCESS') {
            // console.info('res-----',res)
            const jsonAuto = res.data
            // console.info('jsonAuto---',jsonAuto)
            this.proInfo = {
              ...jsonAuto,
              distName: getParams.proContain.distName,
            }
            jsonAuto.detailList.map(item => {
              item.errorMessage = 'false'
            })
            this.scanDataList = jsonAuto.detailList
            const params = {
              distCode: jsonAuto.distCode,
              docType: jsonAuto.docType
            }
            this.checkDocType(jsonAuto.docType)
            this.getWhList(params, jsonAuto.whCode)
            if (jsonAuto.docType !== '20' && jsonAuto.docType !== '21') {
              this.getCusList(params, jsonAuto.cusCode)
            }
          }
        })
      }
    },
    checkDocType(type) {
      switch (type) {
        case '01' :
          this.docType = '进货入库'
          this.isDelivery = false
          break
        case '02' :
          this.docType = '退货入库'
          this.isDelivery = false
          break
        case '03' :
          this.docType = '换货入库'
          this.isDelivery = false
          break
        case '11':
          this.docType = '销售出库'
          this.isDelivery = true
          break
        case '12':
          this.docType = '退货出库'
          this.isDelivery = true
          break
        case '13':
          this.docType = '换货出库'
          this.isDelivery = true
          break
        case '15':
          this.docType = '污损出库'
          this.isDelivery = false
          break
        case '21':
          this.docType = '污损调拨'
          this.isDelivery = false
          break
        case '20':
          this.docType = '产品调拨'
          this.isDelivery = false
          break
        default:
          break
      }
    },
    getWhList(params, checkedwh) {
      // console.info(checkedwh)
      const _that = this
      getDocumentWhList(params).then(res => {
        if (res.message === 'SUCCESS') {
          res.data.whList.map(item => {
            if (item.whCode === checkedwh) {
              _that.whName = item.whName
            }
          })
        }
      })
    },
    getCusList(params, checkedcus) {
      const _that = this
      getDocumentCusList(params).then(res => {
        if (res.message === 'SUCCESS') {
          res.data.cusList.map(item => {
            if (item.cusCode === checkedcus) {
              _that.cusName = item.cusName
            }
          })
          if (checkedcus === 'SVCT9999999') {
            this.isVirtual = true
          }
        }
      })
    },
  },
  watch: {
    $route(to, from) {
      if (to.name.indexOf('_Detail') !== -1) {
        this.proInfo = {}
        const getParams = to.params
        this.backRoute = getParams.parentCom
        this.routeQuery = {
          ...getParams
        }
        this.getFirst()
      }
    }
  }
}
</script>

<style lang="less">

/*详情基本信息*/
.basicBorder {
  border: 1px solid rgba(233, 233, 233, 1);
  overflow: hidden;
  background: rgba(251, 251, 251, 1);
  > .ant-row {
    > div {
      display: flex;
      flex-wrap: nowrap;
      height: 56px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      padding: 0 !important;
      &.lastBorder{
        label.basicTitle{
          margin-bottom: -1px;
        }
        .basicInfo {
          margin-bottom: -1px;
        }
      }
      label.basicTitle {
        width: 30%;
        flex-grow: 1;
        background: rgba(251, 251, 251, 1);
        text-align: right;
        line-height: 56px;
        padding: 0 12px;
        display: inline-block;
        color: rgba(52, 53, 62, 1);
        small{
          color: red;
          padding: 0 4px 0 0;
        }
      }
      .basicInfo {
        flex-grow: 1;
        width: 70%;
        border-left: 1px solid rgba(233, 233, 233, 1);
        border-right: 1px solid rgba(233, 233, 233, 1);
        display: inline-block;
        padding: 12px;
        color: rgba(52, 53, 62, 1);
        &:nth-child(3n) {
          border-right: none;
        }
        .basicBase {
          line-height: 32px;
        }
        span{
          line-height: 32px;
        }
      }
    }
  }
  .ant-input,
  .ant-select-selection {
    background: white;
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 4px;
  }
}

</style>
