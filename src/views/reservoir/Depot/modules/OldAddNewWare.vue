<template>
  <a-card :bordered="false">
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress" />
    </a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>
            <span>{{ newData.title }}</span>
            <a class="showBasic" @click="handleBasic">
              <span>{{ basicInfo }}</span>
              <i :class="basicIcon"></i>
            </a>
          </h3>
        </a-col>
        <a-col :md="12">
          <div class="scanInput">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="onMudleUp">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back" />
                </a-tooltip>
              </span>
              <a-popover
                placement="bottom"
                overlayClassName="wholeWrap"
                trigger="click"
                v-model="wholeShow"
                v-if="newData.type === 'wareIn' && isNoBack"
              >
                <template slot="content">
                  <a-input-search
                    placeholder="请输入单据号"
                    @search="handleWholeAdd"
                    size="large"
                    v-model="wholeOrder"
                  >
                    <a-button slot="enterButton">提交</a-button>
                  </a-input-search>
                </template>
                <template slot="title">
                  <span>整单入库</span>
                </template>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>整单入库</span>
                  </template>
                  <span class="titleBtn">
                    <a-button>
                      <i class="iconfont icon-orderIn" />
                    </a-button>
                  </span>
                </a-tooltip>
              </a-popover>
              <span class="titleBtn" @click="handleuidMore" v-if="newData.type === 'delivery'">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>批量添加</span>
                  </template>
                  <i class="iconfont icon-udiMore" />
                </a-tooltip>
              </span>
              <span
                class="titleBtn"
                @click="handlePreInAdd"
                v-if="newData.type === 'stainedOut'"
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>在库新增</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-proIn" />
                  </a-button>
                </a-tooltip>
              </span>
              <span
                class="titleBtn"
                @click="handlePreAdd"
                v-if="newData.type === 'wareIn' && isNoBack "
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>预入库新增</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-preStorage" />
                  </a-button>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleNoAdd">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>无码添加</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-plus" />
                  </a-button>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleSubmit">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>提交</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-save" />
                  </a-button>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="onSaveDrafts">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>保存草稿</span>
                  </template>
                  <i class="iconfont icon-proInfo" />
                </a-tooltip>
              </span>
            </div>
            <div class="scanInfo">
              <a-input
                placeholder="单击扫码添加"
                :style="{ width:'260px',float:'right' }"
                v-model="scanVal"
                autocomplete="off"
                @change="handleScan"
                id="myInput"
                @blur="handleRemoveScan"
                @focus="handleFocus"
              >
                <i slot="prefix" class="iconfont icon-scan"></i>
              </a-input>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline">
      <div class="basicBorder" v-if="isBasic">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle">经销商名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择经销商"
                @change="handleDist"
                v-model="proWrap.distCode"
              >
                <a-select-option
                  v-for="item in proWrap.distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8">
            <label class="basicTitle"><small>*</small>客户名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 240px; width: 100%;"
                showSearch
                placeholder="选择客户"
                optionFilterProp="children"
                @change="handleUser"
                :filterOption="filterOption"
                v-model="proWrap.cusCode"
              >
                <a-select-option
                  v-for="item in proWrap.cusList"
                  :key="item.cusCode"
                  :value="item.cusCode"
                >{{ item.cusName }}</a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">单据日期</label>
            <div class="basicInfo">
              <a-date-picker
                @change="onOutChange"
                :disabledDate="disabledDate"
                :value="proWrap.docData !== null ? moment(proWrap.docData,'YYYY-MM-DD') : null"
                :allowClear="false"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">经销商代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="经销商代码"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.distCode"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">客户代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="客户代码"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.cusCode"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">单据号码</label>
            <div class="basicInfo">
              <a-input
                placeholder="单据号码"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.docNo"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">业务类型</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择业务类型"
                @change="handleBusiness"
                v-model="proWrap.busType"
              >
                <a-select-option
                  v-for="item in proWrap.trafficType"
                  :key="item.id"
                  :value="item.code"
                >
                  {{ item.typeName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8" v-if="newData.type !== 'delivery'">
            <label for class="basicTitle">库位名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择库位"
                @change="handleOpt"
                v-model="proWrap.whCode"
              >
                <a-select-option
                  v-for="item in proWrap.whList"
                  :key="item.whCode"
                  :value="item.whCode"
                >{{ item.whName }}</a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8" v-if="newData.type !== 'delivery'">
            <label for class="basicTitle">库位代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="库位代码"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.whCode"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">单据备注</label>
            <div class="basicInfo">
              <a-input
                placeholder="备注"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.remark"
              />
            </div>
          </a-col>
          <a-col span="8" v-if="isVirtual">
            <label for class="basicTitle"><small>*</small>调整理由</label>
            <div class="basicInfo">
              <a-input
                placeholder="库存调整理由"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.reportReason"
              />
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-if="isNoCode">
        <a-drawer
          title="无码添加"
          placement="right"
          @close="onSearchClose"
          :visible="isShowSearch"
          wrapClassName="searchWrap"
          width="680"
        >
          <add-no-code @hasNoSub="handleNoSubmit" :delivery="delivery" :deliveryData="deliveryData" />
        </a-drawer>
      </div>
      <div class="stainedWrap" v-if="productList.length !== 0 && emptyData.type === 'stainedOut'">
        <div class="stainedBor"></div>
        <div class="stainedPrice">
          <span class="stainedImg">
            <remain-icon />
          </span>
          <div class="stainedCon">
            <span class="priceFont">
              856
              <small>元</small>
            </span>
            <p>本期污损库额度</p>
          </div>
        </div>
        <div class="stainedBor"></div>
        <div class="stainedPrice">
          <span class="stainedImg">
            <total-icon />
          </span>
          <div class="stainedCon">
            <span class="priceFont">
              540
              <small>元</small>
            </span>
            <p>剩余污损库额度</p>
          </div>
        </div>
        <div class="stainedBor"></div>
        <div class="stainedPrice currentPrice">
          <span class="stainedImg">
            <price-icon />
          </span>
          <div class="stainedCon">
            <span class="priceFont">
              316
              <small>元</small>
            </span>
            <p>当前不含税总价</p>
          </div>
        </div>
        <div class="stainedBor"></div>
      </div>
      <div class="wareWrap" :style="wareStyle">
        <scan-ware
          v-if="productList.length !== 0"
          :scanData.sync="productList"
          :type="delivery"
          @submit="handleEdit"
          @delete="handleRemove"
          :whQueram="whQueram"
        />
        <scan-empty
          v-else
          @click="handleClick"
          :isNoBack="!isNoBack"
          :scanEmpty="newData.type"
          @whole="isWholeShow"
        />
      </div>
      <add-from-storage
        v-if="isPreAdd"
        :fromData="fromData"
        @preSubmit="handlePreSubmit"
        @cancel="handlePreCancle"
      />
      <add-udi-more
        v-if="uidMore"
        :visible="uidMore"
        @udiSub="handleUdiSub"
        @udiCancle="handleUdiCancle"
      />
    </a-form>
  </a-card>
</template>

<script>
import moment from 'moment'
import ScanWare from './ScanWare'
import { scanEvent } from '@/utils/scanEvent'
import { addWareData, scanIn, listByDocNo, submitProduct, whList, getDocumentCusList, scanOut, draftsNew, draftsDetail, getDocumentWhList, draftsDelete, getAutoJson, getDocumentDistList } from '@/api/depot/wareHouse'
import AddNoCode from './AddNoCode'
import AddFromStorage from './AddFromStorage'
import ScanEmpty from './ScanEmpty'
import AddUdiMore from './addUdiMore'
import remainIcon from '@/assets/icons/remainAmount.svg?inline'
import totalIcon from '@/assets/icons/totalAmount.svg?inline'
import priceIcon from '@/assets/icons/totalPrice.svg?inline'

const trafficTypeIn = [
  {
    id: 'trafiic01',
    typeName: '进货入库',
    code: '01'
  },
  {
    id: 'trafiic02',
    typeName: '退货入库',
    code: '02'
  },
  {
    id: 'trafiic03',
    typeName: '换货入库',
    code: '03'
  }
]

const trafficTypeOut = [
  {
    id: 'trafiic01',
    typeName: '销售出库',
    code: '11'
  },
  {
    id: 'trafiic02',
    typeName: '退货出库',
    code: '12'
  },
  {
    id: 'trafiic03',
    typeName: '换货出库',
    code: '13'
  }
]

export default {
  name: 'AddNewWare',
  props: ['newData'],
  components: {
    AddUdiMore,
    AddFromStorage,
    AddNoCode,
    ScanWare,
    moment,
    ScanEmpty,
    remainIcon,
    totalIcon,
    priceIcon
  },
  created() {
    this.getFirstData()
  },
  mounted() {
    // console.info("this.newData ---", this.newData)
    if (this.newData.type === 'wareIn') {
      this.proWrap.trafficType = trafficTypeIn
      this.pageType = '01'
      this.emptyData.type = 'wareIn'
      this.delivery = 'ware'
    } else if (this.newData.type === 'delivery') {
      this.proWrap.trafficType = trafficTypeOut
      this.emptyData.type = 'delivery'
      this.pageType = '11'
      this.delivery = 'delivery'
    } else if (this.newData.type === 'stainedOut') {
      this.proWrap.trafficType = [
        {
          id: 'trafiic01',
          typeName: '污损出库',
          code: '15'
        }
      ]
      this.emptyData.type = 'stainedOut'
      this.pageType = '15'
      this.delivery = 'ware'
    }
  },
  data() {
    return {
      percent: 0,
      uploading: false,
      queryParam: {},
      basicIcon: 'iconfont icon-arrow-up',
      isBasic: true,
      productList: [],
      isVirtual: false,
      isBtn: true,
      proWrap: {
        cusList: [],
        distList: [],
        whList: [],
        trafficType: [],
        docNo: '',
        distCode: undefined,
        cusCode: undefined,
        busType: undefined,
        whCode: undefined,
        docData: null,
        docInfo: '',
        DistVal: '',
        userVal: '',
        wlName: '',
        typeName: '',
        cusName: '',
        remark: '',
        reportReason: ''
      },
      wholeOrder: '',
      scanVal: '',
      udiList: [],
      isNoCode: false,
      isShowSearch: false,
      isPreAdd: false,
      wareStyle: { maxHeight: 'calc(100vh - 300px)' },
      emptyData: {},
      wholeShow: false,
      uidMore: false,
      isproInAdd: false,
      fromData: {},
      pageType: '01',
      dateDefault: null,
      whFromList: [],
      basicInfo: '点击收起基本信息',
      isNoBack: true, // 是否为退货入库
      delivery: '',
      deliveryData: [],
      isSubmit: false,
      whQueram: {}
    }
  },
  methods: {
    moment,
    handleBasic() {
      if (this.isBasic) {
        this.basicIcon = 'iconfont icon-arrow-down'
        this.wareStyle = { maxHeight: 'calc(100vh - 80px)' }
        this.basicInfo = '点击展开基本信息'
      } else {
        this.basicIcon = 'iconfont icon-arrow-up'
        this.wareStyle = { maxHeight: 'calc(100vh - 300px)' }
        this.basicInfo = '点击收起基本信息'
      }
      this.isBasic = !this.isBasic
    },
    // 基础信息
    handleDist(val) {
      // console.info(val)
      this.proWrap.distCode = val
      const params = {
        distCode: val,
        docType: this.proWrap.busType
      }
      this.getWhList(params)
      this.getCusList(params)
    },
    handleUser(val) {
      if (val === 'SVCT9999999') {
        this.isVirtual = true
      } else {
        this.isVirtual = false
        this.proWrap.reportReason = ''
      }
      this.proWrap.cusCode = val
    },
    filterOption(input, option) {
      // console.info('option',option)
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleOpt(val, opt) {
      // console.info('opt----',opt)
      this.proWrap.whName = opt.componentOptions.children[0].text
      this.proWrap.whCode = val
    },
    onOutChange(e, date) {
      // console.info('e---',e,'date',date)
      if (e === null) {
        this.proWrap.docData = e
      } else {
        this.proWrap.docData = date
      }
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    handleBusiness(val) {
      // console.info('val---',val)
      this.proWrap.busType = val
      const params = {
        distCode: this.proWrap.distCode,
        docType: val
      }
      this.getWhList(params)
      this.getCusList(params)
      if (val === '02') {
        this.isNoBack = false
      } else {
        this.isNoBack = true
      }
    },
    getWhList(params, checkedwh) {
      console.info('params---', params)
      getDocumentWhList(params).then(res => {
        if (res.message === 'SUCCESS') {
          console.info('res.data.whList---', res.data.whList)
          this.proWrap.whList = res.data.whList
          this.whFromList = res.data.whFromList
          this.whQueram = res.data.whFromList
          if (checkedwh) {
            this.proWrap.whCode = checkedwh
          } else {
            this.proWrap.whCode = res.data.whList[0].whCode
          }
          // console.info('1111')
          this.isBtn = false
        }
      })
    },
    getCusList(params, checkedcus) {
      getDocumentCusList(params).then(res => {
        if (res.message === 'SUCCESS') {
          // console.info('res---',res)
          this.proWrap.cusList = res.data.cusList
          if ((params.docType === '01' || params.docType === '12') && res.data.cusList.length !== 0) {
            this.proWrap.cusCode = res.data.cusList[0].cusCode
          } else {
            this.proWrap.cusCode = undefined
          }
          this.isVirtual = false
          this.proWrap.reportReason = ''
          // console.info('---',res.data.cusList)
          if (checkedcus === 'SVCT9999999') {
            if (checkedcus) {
              this.proWrap.cusCode = checkedcus
            }
            this.isVirtual = true
          } else if (res.data.cusList.length !== 0) {
            if (res.data.cusList[0].cusCode === 'SVCT9999999') {
              this.isVirtual = true
            } else {
              this.isVirtual = false
            }
          } else {
            this.isVirtual = false
          }
        }
      })
    },
    getDocumentDistList() {
      getDocumentDistList().then(res => {
        if (res.message === 'SUCCESS') {
          this.proWrap.distList = res.data
        }
      })
    },
    // 扫码新增
    handleScan(e) {
      // this.handleFocus()
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleFocus() {
      const input = document.getElementById('myInput')
      input.focus()
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleRemoveScan() {
      window.removeEventListener('keydown', this.scanWrapper, false)
    },
    // 扫码
    scanWrapper(e) {
      // console.info('e.keyCode---',e.keyCode)
      if (e.keyCode === 13 || e.keyCode === 40) {
        e.preventDefault()
        if (this.scanVal !== '' && this.scanVal.length <= 48) {
          const params = {
            distCode: this.proWrap.distCode,
            udi: this.scanVal
          }
          this.getScanIn(params)
        } else if (this.scanVal !== '' && this.scanVal.length > 48) {
          this.$notification['error']({
            message: '提示',
            description: '呀，操作太快！',
            duration: 4
          })
        }
      }
    },
    getScanIn(val) {
      // console.info('this.newData.type---',this.newData.type)
      if (this.newData.type === 'delivery' || this.newData.type === 'stainedOut') {
        scanOut(val).then(res => {
          // console.info('scanOut---',res.data.whType)
          if (res.message === 'SUCCESS') {
            this.scanVal = ''
            if (res.data.whType !== 2 && res.data.whType !== 4 && res.data.whType !== 5) {
              const params = {
                type: 'scan',
                preList: res.data
              }
              this.scanContent(params)
            } else {
              this.$notification['error']({
                message: '提示',
                description: '产品状态冻结中！',
                duration: 4
              })
            }
          } else {
            this.$notification['error']({
              message: '提示',
              description: '该码不存在，请重新扫码或确认是否缺码！',
              duration: 4
            })
          }
        })
      } else {
        scanIn(val).then(res => {
          // console.info('res',res)
          if (res.message === 'SUCCESS') {
            this.scanVal = ''
            if (
              res.data.whType !== 2 &&
              res.data.whType !== 4 &&
              res.data.whType !== 5
            ) {
              const params = {
                type: 'scan',
                preList: res.data
              }
              this.scanContent(params)
            } else {
              this.$notification['error']({
                message: '提示',
                description: '产品状态冻结中！',
                duration: 4
              })
            }
          } else {
            this.$notification['error']({
              message: '提示',
              description: '该码不存在，请重新扫码或确认是否缺码！',
              duration: 4
            })
          }
        })
      }
    },
    // 判断是否初始化完成
    handleAllReady() {
      if (this.proWrap.whList.length <= 0) {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍等片刻！',
          duration: 2
        })
        return false
      }
      return true
    },
    // 预入库新增
    handlePreAdd() {
      if (!this.isBtn) {
        this.isPreAdd = true
        this.fromData = {
          title: '预入库新增',
          type: 'fromPro',
          visible: true,
          distCode: this.proWrap.distCode
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    handlePreCancle() {
      this.isPreAdd = false
      this.fromData.visible = false
    },
    handlePreSubmit(val) {
      // console.info(val.preStoList,this.fromData.type)
      if (this.fromData.type === 'fromProIn' && val.preStoList.length > 0) {
        val.preStoList.map(item => {
          if (item.qty < 1) {
            item.qty = 1
          }
        })
      }
      if (val.preStoList.length > 0) {
        const params = {
          type: 'preWare',
          preList: val.preStoList
        }
        this.scanContent(params)
      } else {
        this.$notification['error']({
          message: '提示',
          description: '未选择任何数据！',
          duration: 4
        })
      }
      this.isPreAdd = false
      this.fromData.visible = false
    },
    // 在库产品新增
    handlePreInAdd() {
      // console.info('this.proWrap.busType---',this.proWrap.busType)
      if (!this.isBtn) {
        this.isPreAdd = true
        this.fromData = {
          title: '在库产品新增',
          type: 'fromProIn',
          visible: true,
          typeCode: this.newData.typeCode,
          distCode: this.proWrap.distCode,
          whFromList: this.whFromList,
          docType: this.proWrap.busType
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    // 无码添加
    handleNoAdd() {
      if (!this.isBtn) {
        this.isNoCode = true
        this.isShowSearch = true
        this.deliveryData = {
          whList: this.proWrap.whList,
          distCode: this.proWrap.distCode,
          docType: this.proWrap.busType
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    handleNoSubmit(val) {
      const params = {
        type: 'NoWare',
        preList: val
      }
      this.scanContent(params)
      this.isNoCode = false
    },
    // 整单入库
    isWholeShow() {
      this.wholeShow = true
    },
    handleWholeAdd(val) {
      this.wholeShow = false
      this.uploading = true
      this.timer = window.setInterval(() => {
        this.percent = this.percent + 5
      }, 1000)
      // console.info('val---',val)
      const params = {
        docNo: val
      }
      listByDocNo(params).then(res => {
        // console.info('listByDocNo----',res)
        if (res.message === 'SUCCESS') {
          // this.wholeShow = false
          if (res.data.length > 0) {
            this.percent = 100
            // this.wholeShow = false
            const params = {
              type: 'docNo',
              preList: res.data
            }
            this.scanContent(params)
            window.clearInterval(this.timer)
            this.uploading = false
            this.$notification['success']({
              message: '提示',
              description: '提交成功',
              duration: 1
            })
          } else {
            this.uploading = false
            window.clearInterval(this.timer)
            this.$notification['error']({
              message: '提示',
              description: '该单据号不存在，请重新输入单据号！',
              duration: 4
            })
          }
          this.wholeOrder = ''
        }
      })
    },
    // 展开搜索
    onSearchClose() {
      this.isNoCode = false
      this.isShowSearch = false
    },
    handleSubmit() {
      // console.info('this.proWrap-----',this.proWrap)
      if (this.productList.length === 0) {
        this.$notification['error']({
          message: '提示',
          description: '还未添加任何产品！',
          duration: 4
        })
      } else if (this.isBtn) {
        this.$notification['error']({
          message: '提示',
          description: '页面数据加载中，请稍后！',
          duration: 2
        })
      } else if (this.proWrap.cusCode === undefined) {
        this.$notification['error']({
          message: '提示',
          description: '请选择客户名称！',
          duration: 2
        })
      } else {
        let isNoSerialNum
        let isNormal = true
        let isEPa = true
        // console.info(' this.productList', this.productList)
        this.productList.map(item => {
          // console.info('item---',item)
          if (item.productModel === 'EP-551A' && (
            !item.effectiveDateEnd || !item.registration)) {
            isEPa = false
          } else if (
            item.productModel !== 'EP-551A' && (
              !item.effectiveDateBegin ||
              !item.effectiveDateEnd ||
              !item.registration
            )
          ) {
            isNormal = false
          }
          if (this.delivery === 'delivery' && (item.serialNumber === '' || item.serialNumber === null) && !item.reason) {
            if (
              item.productModel === 'EMERALDC' || item.productModel === '1MTEC30' ||
              item.productModel === 'HEALON'
            ) {
              isNoSerialNum = true
            } else {
              isNoSerialNum = false
            }
          } else {
            isNoSerialNum = true
          }
        })
        // console.info('isEPa---',isEPa,'isNormal=====',isNormal)
        if (!isEPa) {
          this.$notification['error']({
            message: '提示',
            description:
              '型号（EP-551A）产品失效日期、注册证号不能为空，请编辑添加！',
            duration: 4
          })
        } else if (!isNormal) {
          this.$notification['error']({
            message: '提示',
            description:
              '产品生产日期、失效日期、注册证号不能为空，请编辑添加！',
            duration: 4
          })
        }
        const params = {
          distCode: this.proWrap.distCode,
          cusCode: this.proWrap.cusCode,
          docNo: this.proWrap.docNo,
          docDate: this.proWrap.docData,
          docType: this.proWrap.busType,
          whCode: this.proWrap.whCode,
          remark: this.proWrap.remark,
          detailList: this.productList
        }
        let virtual = false
        if ((this.isVirtual && this.proWrap.reportReason !== '') || !this.isVirtual) {
          virtual = true
        } else {
          this.$notification['error']({
            message: '提示',
            description: '虚拟客户调整理由必填！',
            duration: 4
          })
        }
        if (isEPa && isNormal && isNoSerialNum && virtual) {
          params.reportReason = this.proWrap.reportReason
          if (!this.isSubmit) {
            this.isSubmit = true
            submitProduct(params).then(res => {
              if (res.message === 'SUCCESS') {
                // this.$emit('back')
                this.$router.push({ name: 'FileManagement' })
                this.isSubmit = false
              } else {
                this.$notification['error']({
                  message: '提示',
                  description: '出错了哦！',
                  duration: 4
                })
              }
            })
          } else {
            this.$notification['error']({
              message: '提示',
              description: '系统处理中！',
              duration: 2
            })
          }
        } else if (!isNoSerialNum) {
          // console.info(111)
          this.$notification['error']({
            message: '提示',
            description: '无码产品新增理由不能为空，请编辑添加！',
            duration: 4
          })
        }
      }
      if (this.newData.docId) {
        const params = {
          id: this.newData.docId
        }
        draftsDelete(params).then(res => {
          // console.info('delete----',res)
        })
      }
    },
    onMudleUp() {
      this.$emit('back', false)
    },
    // 保存草稿箱
    onSaveDrafts() {
      const params = {
        distCode: this.proWrap.distCode,
        cusCode: this.proWrap.cusCode,
        docNo: this.proWrap.docNo,
        docDate: this.proWrap.docData,
        docType: this.proWrap.busType,
        whCode: this.proWrap.whCode,
        remark: this.proWrap.remark,
        detailList: this.productList,
        reportReason: this.proWrap.reportReason
      }
      draftsNew(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '提示',
            description: '已保存至草稿箱，请前往草稿箱列表查看！',
            duration: 4
          })
          this.$emit('back')
        } else {
          this.$notification['error']({
            message: '提示',
            description: '出错了哦！',
            duration: 4
          })
        }
      })

      if (this.newData.docId) {
        const params = {
          id: this.newData.docId
        }
        draftsDelete(params).then(res => {
          // console.info("delete----", res)
        })
      }
    },
    // 点击批量添加
    handleuidMore() {
      this.uidMore = true
    },
    handleUdiSub(val) {
      // console.info('val',newVal)
      if (val.length > 0) {
        const index = val.findIndex(item => item && item.length > 48)
        if (index === -1) {
          const params = {
            distCode: this.proWrap.distCode,
            udiList: val
          }
          scanOut(params).then(res => {
            if (res.message === 'SUCCESS') {
              if (res.data.whType !== 2 && res.data.whType !== 4 && res.data.whType !== 5) {
                const params = {
                  type: 'scanOut',
                  preList: res.data
                }
                this.scanContent(params)
              } else {
                this.$notification['error']({
                  message: '提示',
                  description: '产品状态冻结中！',
                  duration: 4
                })
              }
            } else {
              this.$notification['error']({
                message: '提示',
                description: '添加未成功！',
                duration: 4
              })
            }
          })
          this.uidMore = false
        } else {
          this.$notification['error']({
            message: '提示',
            description: '呀，udi码超长啦！',
            duration: 4
          })
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请输入唯一码！',
          duration: 4
        })
      }
    },
    handleUdiCancle() {
      this.uidMore = false
    },
    // 初始化点击
    handleClick(val) {
      switch (val.type) {
        case 'noUdi':
          if (!this.isBtn) {
            this.isNoCode = true
            this.isShowSearch = true
            this.deliveryData = {
              whList: this.proWrap.whList,
              distCode: this.proWrap.distCode,
              docType: this.proWrap.busType
            }
          } else {
            this.$notification['info']({
              message: '提示',
              description: '页面初始化加载中，请稍后！',
              duration: 2
            })
          }
          break
        case 'preStorage':
          if (!this.isBtn) {
            this.isPreAdd = true
            this.fromData = {
              title: '预入库新增',
              type: 'fromPro',
              visible: true,
              distCode: this.proWrap.distCode
            }
          } else {
            this.$notification['info']({
              message: '提示',
              description: '页面初始化加载中，请稍后！',
              duration: 2
            })
          }

          break
        case 'whole':
          this.wholeShow = true
          break
        case 'udi':
          this.uidMore = true
          break
        case 'scan':
          this.handleFocus()
          window.addEventListener('keydown', this.scanWrapper, false)
          break
        case 'preStorageIn':
          if (!this.isBtn) {
            this.isPreAdd = true
            this.fromData = {
              title: '在库产品新增',
              type: 'fromProIn',
              visible: true,
              typeCode: this.newData.typeCode,
              distCode: this.proWrap.distCode,
              whFromList: this.whFromList,
              docType: this.proWrap.busType
            }
          } else {
            this.$notification['info']({
              message: '提示',
              description: '页面初始化加载中，请稍后！',
              duration: 2
            })
          }

          break
        default:
          break
      }
    },

    // 提交
    scanContent(params) {
      // console.info('params----',params)
      let allreadyIn = 0 // 已入库数据判断
      if (params.type === 'preWare' || params.type === 'docNo') {
        params.preList.forEach(item => {
          // console.info('udiList----',this.udiList)
          let hasUid = -1
          if (item.serialNumber) {
            hasUid = this.udiList.findIndex(udi => udi === item.serialNumber)
          } else {
            hasUid = this.udiList.findIndex(udi => udi === item.id)
          }
          if (hasUid < 0) {
            item.ScanTime = new Date()
            if (item.serialNumber) {
              this.udiList.push(item.serialNumber)
            } else {
              this.udiList.push(item.id)
            }
            this.productList.unshift(item)
          } else {
            allreadyIn++
            return false
          }
        })
        // console.info('allreadyIn---',allreadyIn)
        if (allreadyIn > 0) {
          this.$notification['error']({
            message: '错误',
            description: '已入库数据将不重新入库！',
            duration: 4
          })
        }
      } else if (params.type === 'NoWare') {
        params.ScanTime = moment(new Date())
        const noWareId = new Date().getTime()
        this.udiList.push(noWareId)
        this.productList.unshift({
          id: noWareId,
          ...params.preList
        })
      } else {
        // console.info('params---',params)
        if (params !== '' && Array.isArray(this.udiList)) {
          const hasUid = this.udiList.findIndex(
            udi => udi === params.preList.serialNumber
          )
          // console.info('hasUid',this.udiList,hasUid)
          if (hasUid < 0 && params.preList.serialNumber !== undefined) {
            params.ScanTime = new Date()
            this.udiList.push(params.preList.serialNumber)
            this.productList.unshift(params.preList)
          } else {
            this.$notification['error']({
              message: '错误',
              description: '该码已扫过，请勿重复扫码！',
              duration: 4
            })
          }
        }
      }
    },
    // 编辑
    handleEdit(params) {
      // console.info('params---',params)
      let proIndex = -1
      if (params.serialNumber) {
        proIndex = this.productList.findIndex(
          item => item.serialNumber === params.serialNumber
        )
      } else {
        proIndex = this.productList.findIndex(
          item => item.id === params.id
        )
      }
      if (proIndex > -1) {
        this.productList[proIndex] = JSON.parse(JSON.stringify(params))
      }

      // console.info('this.productList---',this.productList)
    },
    // 删除
    handleRemove(params) {
      // console.info('this.productList---',this.productList)
      console.info('params---', params)
      let proIndex = -1
      let udiIndex = -1
      if (params.id) {
        proIndex = this.productList.findIndex(item => item.id === params.id)
        if (params.serialNumber) {
          udiIndex = this.udiList.findIndex(
            item => item === params.serialNumber
          )
        } else {
          udiIndex = this.udiList.findIndex(item => item === params.id)
        }
      } else {
        proIndex = this.productList.findIndex(item => item.serialNumber === params.serialNumber)
        udiIndex = this.udiList.findIndex(item => item === params.serialNumber)
      }
      // console.info('udiIndex---',proIndex,udiIndex)
      if (proIndex > -1) {
        this.productList.splice(proIndex, 1)
      }
      if (udiIndex > -1) {
        this.udiList.splice(udiIndex, 1)
      }
    },
    // 新增初始化
    getFirstData() {
      const _that = this
      const getFirstDatas = {}
      if (this.newData.docId) {
        const params = {
          id: this.newData.docId
        }
        draftsDetail(params).then(res => {
          if (res.message === 'SUCCESS') {
            this.proWrap.distList = res.data.distList
            this.proWrap.cusList = res.data.cusList
            this.proWrap.whList = res.data.whList
            this.proWrap.docNo = res.data.document.docNo
            this.productList = res.data.document.detailList
            this.proWrap.docData = moment(res.data.document.docDate).format(
              'YYYY-MM-DD'
            )
            this.proWrap.remark = res.data.document.remark
            this.proWrap.distCode = res.data.document.distCode
            this.proWrap.reportReason = res.data.document.reportReason

            res.data.document.detailList.map(item => {
              this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
            })
          }
          this.proWrap.busType = this.newData.docType
          const params = {
            distCode: res.data.document.distCode,
            docType: this.newData.docType
          }
          this.getWhList(params, res.data.document.whCode)
          this.getCusList(params, res.data.document.cusCode)

          // this.whFromList = res.data.whFromList
        })
      } else if (this.newData.fileId) {
        // console.info('this.newData---',this.newData)
        const params = {
          id: this.newData.fileId
        }
        getAutoJson(params).then(res => {
          if (res.message === 'SUCCESS') {
            const jsonAuto = JSON.parse(res.data.fileJson)
            const jsonErrorList = res.data.errorIndexList
            // console.info("jsonAuto.detailList---", jsonErrorList)
            jsonAuto.detailList.map((file, index) => {
              if (jsonErrorList.indexOf((index + 1).toString()) !== -1) {
                file.errorMessage = true
              } else {
                file.errorMessage = false
              }
            })
            // this.proWrap = {
            //   distList: jsonAuto.distList,
            //   cusList: jsonAuto.cusList,
            //   whList: jsonAuto.whList,
            //   docData: moment(jsonAuto.docDate).format("YYYY-MM-DD"),
            //   remark: jsonAuto.remark,
            //   distCode: jsonAuto.distCode,
            //   busType: jsonAuto.docType,
            //   reportReason: jsonAuto.reportReason
            // }
            this.proWrap.distList = jsonAuto.distList
            this.proWrap.cusList = jsonAuto.cusList
            this.proWrap.whList = jsonAuto.whList
            this.proWrap.docNo = jsonAuto.docNo
            this.productList = jsonAuto.detailList
            this.proWrap.docData = moment(jsonAuto.docDate).format('YYYY-MM-DD')
            this.proWrap.remark = jsonAuto.remark
            this.proWrap.distCode = jsonAuto.distCode
            this.proWrap.busType = jsonAuto.docType
            this.proWrap.reportReason = jsonAuto.reportReason
            jsonAuto.detailList.map(item => {
              this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
            })
            const params = {
              distCode: jsonAuto.distCode,
              docType: jsonAuto.docType
            }
            this.getWhList(params, jsonAuto.whCode)
            this.getCusList(params, jsonAuto.cusCode)
            this.getDocumentDistList()
          }
          // console.info('this.productList---',this.productList)
        })
      } else {
        const params = {
          distCode: this.$store.state.user.info.distCode,
          docType: this.pageType
        }
        if (this.newData.type === 'wareIn') {
          params.docType = '01'
          this.proWrap.busType = '01'
        } else if (this.newData.type === 'delivery') {
          params.docType = '11'
          this.proWrap.busType = '11'
        } else if (this.newData.type === 'stainedOut') {
          params.docType = '15'
          this.proWrap.busType = '15'
        }
        this.proWrap.docData = new Date()
        this.getWhList(params)
        addWareData(params).then(res => {
          console.info('res-----', res)
          if (res.message === 'SUCCESS') {
            if (res.data.whList.length === 0) {
              this.$notification['error']({
                message: '错误',
                description: '请先添加库位，再操作新增出入库！',
                duration: 4
              })
            } else {
              this.proWrap.distList = res.data.distList
              this.proWrap.cusList = res.data.cusList
              this.proWrap.docNo = res.data.docNo
              this.proWrap.distCode = res.data.distList[0].distCode
              // this.proWrap.busType = this.proWrap.trafficType[0].code
              this.whFromList = res.data.whFromList
              this.whQueram = res.data.whList
              this.isBtn = false
              if (this.newData.type === 'wareIn') {
                this.proWrap.cusCode = res.data.cusList[0].cusCode
              }
            }
          }
        })
      }
    }
  },
  destroyed() {
    window.removeEventListener('keydown', this.scanWrapper, false)
  }
}
</script>

<style lang="less">
body {
  position: relative;
}
.scanInput {
  .ant-input {
    float: right;
  }
}
.pageTitle {
  h3 {
    & > span {
      float: left;
    }
  }
  .showBasic {
    color: rgba(147, 147, 147, 1);
    display: inline-block;
    line-height: 22px;
    span {
      float: left;
      font-size: 12px;
      padding: 4px 12px 0 40px;
    }
    &:hover {
      span {
        color: rgba(62, 77, 168, 1);
      }
    }
    .iconfont {
      font-size: 12px;
      float: left;
      padding: 4px 0 0 0;
    }
  }
}

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
.scanInfo {
  &.scanTop {
    position: relative;
    input {
      position: absolute;
      left: 0;
      border-radius: 16px;
      height: 32px;
      background: rgba(251, 251, 251, 1);
      box-shadow: none;
      border: 2px solid white;
      display: inline-block;
      padding: 0 0 0 40px;
      z-index: 8;
      &:hover {
        color: rgba(62, 77, 168, 1);
        border: 2px solid rgba(62, 77, 168, 1);
        .ant-input-prefix {
          color: rgba(62, 77, 168, 1);
        }
      }
    }
    .iconfont {
      position: absolute;
      left: 14px;
      top: 4px;
      z-index: 11;
    }
  }
  .ant-input-affix-wrapper {
    border-radius: 16px;
    .ant-input:not(:first-child) {
      background: rgba(251, 251, 251, 1);
      border-radius: 16px;
    }
    &:hover {
      color: rgba(62, 77, 168, 1);
      border-color: rgba(62, 77, 168, 1);
      .ant-input-prefix {
        color: rgba(62, 77, 168, 1);
      }
    }
  }
}
.wholeWrap {
  width: 360px;
  .ant-popover-inner {
    width: 100%;
    .ant-popover-title {
      padding: 12px 24px;
    }
    .ant-popover-inner-content {
      padding: 24px;
      .ant-input-affix-wrapper {
        .ant-input {
          height: 40px;
        }
        .ant-input-search-button {
          border: none;
          border-left: 1px solid #e3e3e7;
        }
      }
    }
  }
}
.wareWrap {
  width: 100%;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: hidden;
}
//污损金额
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
    .stainedImg {
      padding: 6px 24px 0 0;
      display: inline-block;
      svg {
        width: 48px;
        height: 48px;
        font-size: 48px;
      }
    }
    .stainedCon {
      span {
        font-size: 24px;
        color: rgba(62, 77, 168, 1);
        font-weight: bold;
        small {
          font-size: 12px;
          color: rgba(62, 77, 168, 1);
          font-weight: normal;
        }
      }
      p {
        font-size: 12px;
        color: rgba(147, 147, 147, 1);
        padding: 6px 0 0 0;
      }
    }
  }
}
.progress {
  width: 500px;
  margin: 0 auto;
  margin-top: 250px;
  display: block;
  .ant-progress-text {
    color: #fff;
  }
}
.ant-spin-blur {
  opacity: 1;
}
.ant-spin-blur:after {
  opacity: 0.5;
}
//上传中
.uploading {
  width: 100%;
  height: 100vh;
  position: fixed;
  background: rgba(0, 0, 0, 0.35);
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
  .ant-spin-container{
    height: 100%;
  }
}
</style>
