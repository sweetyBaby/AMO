<template>
  <a-card :bordered="false">
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress"/>
    </a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>
            <span>{{ pageTitle }}</span>
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
                <a-tooltip placement="top" v-model="detail.isShowTool">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back"></i>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="onSaveDrafts">
                <a-tooltip placement="top" v-model="detail.isShowDrafts">
                  <template slot="title">
                    <span>保存草稿</span>
                  </template>
                  <i class="iconfont icon-saveDrafts"></i>
                </a-tooltip>
              </span>
              <a-popover
                placement="bottomRight"
                overlayClassName="wholeWrap"
                trigger="click"
                v-model="wholeShow"
                v-if="proType === 'wareIn' && isNoBack"
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
                    <a-button :disabled="isBtn">
                      <i class="iconfont icon-orderIn"></i>
                    </a-button>
                  </span>
                </a-tooltip>
              </a-popover>
              <span class="titleBtn" @click="handleuidMore" v-if="proType === 'delivery'">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>批量添加</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-udiMore"></i>
                  </a-button>
                </a-tooltip>
              </span>
              <span
                class="titleBtn"
                @click="handlePreInAdd"
                v-if="proType === 'stainedOut'"
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>在库新增</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-proIn"></i>
                  </a-button>
                </a-tooltip>
              </span>
              <span
                class="titleBtn"
                @click="handlePreAdd"
                v-if="proType === 'wareIn' && isNoBack "
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>预入库新增</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-preStorage"></i>
                  </a-button>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleNoAdd">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>无码添加</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-plus"></i>
                  </a-button>
                </a-tooltip>
              </span>

              <span class="titleBtn" @click="handleSubmit">
                <a-tooltip placement="top" v-model="detail.isShowSubmit">
                  <template slot="title">
                    <span>提交</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-save"></i>
                  </a-button>
                </a-tooltip>
              </span>

            </div>
            <div class="scanInfo">
              <a-popover title="开始扫码" trigger="click" :visible="scanStart" :overlayStyle="{ width:'330px' }" overlayClassName="scanOverview">
                <template slot="content">
                  <div class="scanCon">
                    <img :src="scanImgUrl" alt="">
                    <p>用扫码抢扫描产品SN码</p>
                  </div>
                </template>
                <a-input
                  placeholder="单击扫码添加"
                  :style="{ width:'260px',float:'right' }"
                  v-model="scanVal"
                  autocomplete="off"
                  @change="handleScan"
                  id="myInput"
                  @blur="handleRemoveScan"
                  @focus="handleFocus"
                  :disabled="isBtn"
                >
                  <i slot="prefix" class="iconfont icon-scan"></i>
                </a-input>
              </a-popover>
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
                style="max-width: 260px; width: 100%;"
                placeholder="选择经销商"
                @change="handleDist"
                v-model="proWrap.distCode"
              >
                <a-select-option
                  v-for="item in proWrap.distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8" v-if="!isEstate">
            <label class="basicTitle"><small>*</small>客户名称</label>
            <div class="basicInfo" v-show="proWrap.busType === '02' || proWrap.busType === '11'">
              <a-input-group compact>
                <a-select
                  style="width:75px"
                  placeholder="已授权"
                  v-model="authorize"
                  @change="handleAuth"
                >
                  <a-select-option value="has">已授权</a-select-option>
                  <a-select-option value="hasNo">未授权</a-select-option>
                </a-select>
                <a-select
                  style="width: 185px;"
                  showSearch
                  placeholder="选择客户"
                  @change="handleUser"
                  optionFilterProp="children"
                  :filterOption="filterOption"
                  v-model="proWrap.cusCode"
                  v-show="haAuth === 'has'"
                >
                  <a-select-option
                    v-for="item in proWrap.cusList"
                    :key="item.cusCode"
                    :value="item.cusCode"
                    :title="item.cusName"
                  >
                    {{ item.cusName }}
                  </a-select-option>
                </a-select>
                <a-input
                  placeholder="请选择客户名称"
                  v-show="haAuth === 'hasNo'"
                  @click="handleSelectCus"
                  style="width: 185px;"
                  v-model="proWrap.cusName"
                />
              </a-input-group>
            </div>
            <div class="basicInfo" v-show="proWrap.busType !== '02' && proWrap.busType !== '11'">
              <a-select
                style="max-width: 260px;width: 100%;"
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
                >
                  {{ item.cusName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8" v-if="isEstate">
            <label for class="basicTitle">配送商</label>
            <div class="basicInfo">
              <a-input
                placeholder="配送商名称"
                :style="{ maxWidth:'260px',width:'100%' }"
                v-model="proWrap.distribution"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">单据日期</label>
            <div class="basicInfo">
              <a-date-picker
                style="max-width: 260px;width: 100%;"
                @change="onOutChange"
                :disabledDate="disabledDate"
                :value="proWrap.docData !== null ? moment(proWrap.docData,'YYYY-MM-DD') : null"
                :allowClear="false"
              ></a-date-picker>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">经销商代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="经销商代码"
                :style="{ maxWidth:'260px',width:'100%' }"
                v-model="proWrap.distCode"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8" v-if="!isEstate">
            <label for class="basicTitle">客户代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="客户代码"
                :style="{ maxWidth:'260px',width:'100%' }"
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
                :style="{ maxWidth:'260px',width:'100%' }"
                v-model="proWrap.docNo"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">业务类型</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 260px; width: 100%;"
                placeholder="选择业务类型"
                @change="handleBusiness"
                v-model="proWrap.busType"
                :disabled="isEstate"
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
          <a-col span="8" v-if="proType !== 'delivery'">
            <label for class="basicTitle">库位名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 260px; width: 100%;"
                showSearch
                placeholder="选择库位"
                @change="handleOpt"
                v-model="proWrap.whCode"
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="item in proWrap.whList"
                  :key="item.whCode"
                  :value="item.whCode"
                >
                  {{ item.whName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8" v-if="proType !== 'delivery'">
            <label for class="basicTitle">库位代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="库位代码"
                :style="{ maxWidth:'260px',width:'100%' }"
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
                :style="{ maxWidth:'260px',width:'100%' }"
                :maxLength="100"
                v-model="proWrap.remark"
              />
            </div>
          </a-col>
          <a-col span="8" v-if="isVirtual">
            <label for class="basicTitle"><small>*</small>调整理由</label>
            <div class="basicInfo">
              <a-input
                placeholder="库存调整理由"
                :style="{ maxWidth:'260px',width:'100%' }"
                v-model="proWrap.reportReason"
                :maxLength="100"
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
          <add-no-code @hasNoSub="handleNoSubmit" :delivery="delivery" :deliveryData="deliveryData"/>
        </a-drawer>
      </div>
      <div class="stainedWrap" v-if="productList.length !== 0 && emptyData.type === 'stainedOut'">
        <div class="stainedBor"></div>
        <div class="stainedPrice">
          <span class="stainedImg">
            <remain-icon/>
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
            <total-icon/>
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
            <price-icon/>
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
      <div v-if="jsonErrorList.length > 0" @click="handleRemoveAll" class="removeAll">
        <i class="iconfont icon-allRead"></i><span>一键清除错误行</span></div>
      <div class="wareWrap" :style="wareStyle">
        <scan-ware
          v-if="productList.length !== 0"
          :scanData.sync="productList"
          :type="delivery"
          @submit="handleEdit"
          @delete="handleRemove"
          :whQueram="whQueram"
        ></scan-ware>
        <scan-empty
          v-else
          @click="handleClick"
          :isNoBack="!isNoBack"
          :scanEmpty="proType"
          @whole="isWholeShow"
        ></scan-empty>
      </div>
      <add-from-storage
        v-if="isPreAdd"
        :fromData="fromData"
        @preSubmit="handlePreSubmit"
        @cancel="handlePreCancle"
      ></add-from-storage>
      <add-udi-more
        v-if="uidMore"
        :visible="uidMore"
        @udiSub="handleUdiSub"
        @udiCancle="handleUdiCancle"
      ></add-udi-more>
      <select-cus-name
        v-if="selectShow"
        :visible="selectShow"
        :distCode="proWrap.distCode"
        @selectCus="handleSelectOk"
        @selectCancle="handleSelectCancle"
      ></select-cus-name>
      <SelectLocation
        v-if="locationAll"
        :formData="locFormData"
        @selectWh="handleAddWh"
        @selectCancle="handleWhCancle"
      ></SelectLocation>
    </a-form>
  </a-card>
</template>

<script>
import moment from 'moment'
import ScanWare from './modules/ScanWare'
import {
  addWareData,
  scanIn,
  listByDocNo,
  submitProduct,
  getDocumentCusList,
  scanOut,
  draftsNew,
  draftsDetail,
  getDocumentWhList,
  draftsDelete,
  getAutoJson,
  getDocumentDistList,
  unAuthHosList
} from '@/api/depot/wareHouse'
import AddNoCode from './modules/AddNoCode'
import AddFromStorage from './modules/AddFromStorage'
import ScanEmpty from './modules/ScanEmpty'
import AddUdiMore from './modules/addUdiMore'
import remainIcon from '@/assets/icons/remainAmount.svg?inline'
import totalIcon from '@/assets/icons/totalAmount.svg?inline'
import priceIcon from '@/assets/icons/totalPrice.svg?inline'
import scanImg from '@/assets/icons/scanImg.png'
import { saveParamsFromStore, getParamsFromStore } from '@/utils/storage'
import SelectCusName from './modules/SelectCusName'
import SelectLocation from './modules/SelectLocation'

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
    priceIcon,
    SelectCusName,
    SelectLocation
  },
  created () {
    this.getFirstData()
  },
  mounted () {
    const getParams = this.$route.params
    this.routeFrom = getParams.parentCom
    this.routeQuery = {
      ...getParams
    }
    // 判断业务类型
    this.handleBusType()
    if (getParams.wareType === 'estate' && getParams.proType === 'wareIn') {
      this.isEstate = true
      this.handleBusiness('02')
    } else if (getParams.wareType === 'estate' && getParams.proType === 'delivery') {
      this.handleBusiness('11')
      this.isEstate = true
    }
  },
  data () {
    return {
      percent: 0,
      uploading: false,
      queryParam: {},
      basicIcon: 'iconfont icon-arrow-up',
      isBasic: true,
      productList: [],
      isVirtual: false,
      isBtn: true,
      pageTitle: '',
      proType: '',
      scanImgUrl: scanImg,
      proWrap: {
        cusList: [],
        distList: [],
        whList: [],
        trafficType: [],
        docNo: '',
        distCode: undefined,
        cusCode: undefined,
        busType: '01',
        whCode: undefined,
        docData: null,
        distribution: '',
        docInfo: '',
        DistVal: '',
        userVal: '',
        wlName: '',
        typeName: '',
        cusName: '',
        remark: '',
        reportReason: ''
      },
      authorize: 'has',
      detail: {
        isShowTool: false,
        isShowDrafts: false,
        isShowSubmit: false
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
      whQueram: {},
      routeFrom: '',
      routeQuery: {},
      jsonErrorList: [],
      isEstate: false,
      scanStart: false, // 扫码提示
      getParamsRed: {}, // 记住params
      haAuth: 'has', // 已授权
      selectShow: false, // 选择客户名称弹框
      locationAll: false, //
      locFormData: {
        visible: false,
        locationData: [],
        distCode: '',
        docType: ''
      },
      whType: '01',
      isWhType: false
    }
  },
  methods: {
    moment,
    handleBasic () {
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
    //
    handleBusType () {
      // console.info('this.getParamsRed---',this.proWrap.busType, this.whType)
      if (this.getParamsRed.proType === 'wareIn') {
        this.proWrap.trafficType = trafficTypeIn
        this.pageType = '01'
        this.proWrap.busType = '01'
        this.emptyData.type = 'wareIn'
        if (this.proWrap.busType === '02' && this.whType === 3) {
          this.delivery = 'estate'
        } else {
          this.delivery = 'ware'
        }
      } else if (this.getParamsRed.proType === 'delivery') {
        this.proWrap.trafficType = trafficTypeOut
        this.emptyData.type = 'delivery'
        this.pageType = '11'
        this.proWrap.busType = '11'
        this.delivery = 'delivery'
      } else if (this.getParamsRed.proType === 'stainedOut') {
        this.proWrap.trafficType = [
          {
            id: 'trafiic01',
            typeName: '污损出库',
            code: '15'
          }
        ]
        this.emptyData.type = 'stainedOut'
        this.pageType = '15'
        this.proWrap.busType = '15'
        this.delivery = 'ware'
      }
    },
    // 基础信息
    handleDist (val) {
      // console.info(val)
      this.proWrap.distCode = val
      const params = {
        distCode: val,
        docType: this.proWrap.busType
      }
      this.getWhList(params)
      this.getCusList(params)
      this.authorize = 'has'
      this.handleAuth('has')
    },
    // 切换客户名称是否授权
    handleAuth (val) {
      // console.info('val===',val)
      this.haAuth = val
      this.proWrap.cusCode = undefined
      this.proWrap.cusName = ''
    },
    handleSelectCus () {
      // console.info('3333')
      if (this.haAuth === 'hasNo') {
        this.selectShow = true
      } else {
        this.selectShow = false
      }
    },
    // 选择客户名称弹框
    handleSelectOk (subVal) {
      // console.info('subVal====',subVal)
      this.proWrap.cusCode = subVal.cusCode
      this.proWrap.cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    // 选择库位
    handleAddWh (val) {
      // console.info('vala====', val)
      val.forEach(wh => {
        const proIndex = this.productList.findIndex(item => item.serialNumber === wh.serialNumber)
        if (wh.whType === '1') {
          this.productList[proIndex].otherSn = false
        }
        this.productList[proIndex].whCode = wh.whCode
        this.productList[proIndex].whName = wh.whName
        this.productList[proIndex].whType = wh.whType
        const WhIndex = this.locFormData.locationData.findIndex(loc => loc.serialNumber === wh.serialNumber)
        // console.info('WhIndex====', WhIndex)
        if (WhIndex > -1) {
          this.locFormData.locationData.splice(WhIndex, 1)
        }
      })
      // console.info('this.productList====', this.productList)
      // if (this.locFormData.locationData.length === 0) {
      //   this.handleSubmit()
      // }
    },
    handleWhCancle () {
      this.locationAll = false
    },
    handleUser (val) {
      if (val === 'SVCT9999999') {
        this.isVirtual = true
      } else {
        this.isVirtual = false
        this.proWrap.reportReason = ''
      }
      this.proWrap.cusCode = val
    },
    filterOption (input, option) {
      // console.log(input);
      if (input) {}
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleOpt (val, opt) {
      // console.info('opt----',opt)
      this.proWrap.whName = opt.componentOptions.children[0].text
      this.proWrap.whCode = val
      this.proWrap.whList.map(item => {
        if (item.whCode === val) {
          // console.info('item.whType====', item.whType)
          this.whType = item.whType
        }
      })
      // 无码退货入库  理由添加
      if (this.proWrap.busType === '02' && this.whType === 3) {
        this.delivery = 'estate'
      } else {
        this.delivery = this.getParamsRed.proType
      }
    },
    onOutChange (e, date) {
      // console.info('e---',e,'date',date)
      if (e === null) {
        this.proWrap.docData = e
      } else {
        this.proWrap.docData = date
      }
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    handleBusiness (val) {
      // console.info('val---', val)
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
      this.proWrap.cusName = ''
    },
    getWhList (params, checkedwh) {
      // console.info('params===', params, checkedwh )
      if (!params.distCode) {
        params.distCode = this.$store.state.user.info.distCode
      }
      getDocumentWhList(params).then(res => {
        if (res.message === 'SUCCESS') {
          // console.info('this.proData.busType====', this.proWrap.busType )
          if (this.proWrap.busType === '12') {
            this.proWrap.whList = res.data.whList.filter(item => item.whType === 4)
            this.whQueram = res.data.whFromList.filter(item => item.whType === 4)
            this.whFromList = res.data.whFromList.filter(item => item.whType === 4)
          } else if (this.proWrap.busType === '11' || this.proWrap.busType === '13') {
            this.proWrap.whList = res.data.whList.filter(item => item.whType !== 4)
            this.whQueram = res.data.whFromList.filter(item => item.whType !== 4)
            this.whFromList = res.data.whFromList.filter(item => item.whType !== 4)
          } else {
            this.proWrap.whList = res.data.whList
            this.whQueram = res.data.whFromList
            this.whFromList = res.data.whFromList
          }

          if (checkedwh) {
            this.proWrap.whCode = checkedwh
            res.data.whList.map(wh => {
              if (wh.whCode === checkedwh) {
                this.whType = wh.whType
                // console.info('params.docType====', wh.whType, params.docType)
                if (wh.whType === 3 && params.docType === '02') {
                  this.delivery = 'estate'
                }
              }
            })
          } else {
            this.proWrap.whCode = res.data.whList[0].whCode
            this.whType = 1
          }
          // console.info('1111')
        }
      })
    },
    getCusList (params, checkedcus) {
      getDocumentCusList(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.proWrap.cusList = res.data.cusList
          if ((params.docType === '01' || params.docType === '12') && res.data.cusList.length !== 0 && !checkedcus) {
            this.proWrap.cusCode = res.data.cusList[0].cusCode
            if (res.data.cusList[0].cusCode === 'SVCT9999999') {
              this.isVirtual = true
            } else {
              this.isVirtual = false
            }
          } else if (checkedcus) {
            this.proWrap.cusCode = checkedcus
            if (checkedcus === 'SVCT9999999') {
              this.isVirtual = true
            } else {
              this.isVirtual = false
            }
          } else {
            this.isVirtual = false
            this.proWrap.reportReason = ''
            this.proWrap.cusCode = undefined
          }
        }
      })
    },
    getDocumentDistList () {
      getDocumentDistList().then(res => {
        if (res.message === 'SUCCESS') {
          this.proWrap.distList = res.data
        }
      })
    },
    // 扫码新增
    handleScan (e) {
      if (!this.isBtn) { // 判断页面加载是否完成
        window.addEventListener('keydown', this.scanWrapper, false)
      } else {
        this.$notification['error']({
          message: '提示',
          description: '页面数据加载中，请稍后！',
          duration: 2
        })
      }
      // this.handleFocus()
    },
    handleFocus () {
      const input = document.getElementById('myInput')
      input.focus()
      // this.scanStart = true
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleRemoveScan () {
      this.scanStart = false
      window.removeEventListener('keydown', this.scanWrapper, false)
    },
    // 扫码
    scanWrapper (e) {
      // console.info('e.keyCode---',e.keyCode)
      this.scanStart = false
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
    getScanIn (val) {
      // console.info('this.newData.type---',this.getParamsRed,val)
      if (this.getParamsRed.proType === 'delivery' || this.getParamsRed.proType === 'stainedOut') {
        scanOut(val).then(res => {
          // console.info('scanOut---',res.data.whType)
          if (res.message === 'SUCCESS') {
            this.scanVal = ''
            // if (res.data.whType !== 2 && res.data.whType !== 4 && res.data.whType !== 5) {
            if (res.data.whType !== 2 && res.data.whType !== 5) {
              if (!res.data.distCode && res.data.whType !== null) {
                res.data.whName = ''
                res.data.whCode = undefined
                res.data.force = true
                res.data.otherSn = false
              } else if (!res.data.distCode && res.data.whType === null) {
                res.data.whName = ''
                res.data.whCode = undefined
                res.data.force = true
                res.data.otherSn = true
              }
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
    handleAllReady () {
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
    handlePreAdd () {
      if (!this.isBtn) {
        this.isPreAdd = true
        this.fromData = {
          title: '预入库新增',
          type: 'fromPro',
          visible: true,
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
    handlePreCancle () {
      this.isPreAdd = false
      this.fromData.visible = false
    },
    handlePreSubmit (val) {
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
    handlePreInAdd () {
      // console.info('this.proWrap.busType---',this.proWrap.busType)
      if (!this.isBtn) {
        this.isPreAdd = true
        this.fromData = {
          title: '在库产品新增',
          type: 'fromProIn',
          visible: true,
          // typeCode: this.newData.typeCode,
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
    handleNoAdd () {
      if (!this.isBtn) { // 判断页面是否初始化成功
        // console.info('this.whCode===', this.proWrap.whCode, this.whType)
        const getParams = getParamsFromStore('NEWWARE')
        this.routeQuery = {
          ...getParams
        }
        this.isNoCode = true
        this.isShowSearch = true
        this.deliveryData = {
          whList: this.proWrap.whList,
          distCode: this.proWrap.distCode,
          docType: this.proWrap.busType,
          wareType: this.routeQuery.wareType ? this.routeQuery.wareType : null
        }
        // if (this.proWrap.busType === '02' && this.whType === 3) {
        if (this.proWrap.busType === '02') {
          this.deliveryData.whType = this.whType
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    handleNoSubmit (val) {
      // console.info('NoSubmit---',val)
      const params = {
        type: 'NoWare',
        preList: val
      }
      this.scanContent(params)
      this.isNoCode = false
    },
    // 整单入库
    isWholeShow () {
      this.wholeShow = true
    },
    handleWholeAdd (val) {
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
    onSearchClose () {
      this.isNoCode = false
      this.isShowSearch = false
    },
    handleSubmit () {
      // console.info('this.routeQuery-----', this.routeQuery)
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
      } else if (!this.routeQuery.wareType && this.proWrap.cusCode === undefined) {
        this.$notification['error']({
          message: '提示',
          description: '请选择客户名称！',
          duration: 2
        })
      } else if (this.routeQuery.wareType && (!this.proWrap.distribution || this.proWrap.distribution.length === 0)) {
        this.$notification['error']({
          message: '提示',
          description: '请输入配送商名称！',
          duration: 2
        })
      } else {
        let isNoSerialNum
        let isNormal = true
        let isEPa = true
        let wareInNum = 0
        let isNoSerial = true
        let isBackReason = true
        // console.info(' this.productList', this.proWrap.busType, 'this.whType===', this.whType)
        this.productList.map(item => {
          // console.info('item---', item)
          if (item.productModel === 'EP-551A' && (!item.effectiveDateEnd || !item.registration) && item.degree !== '1000.0') {
            isEPa = false
          } else if (
            item.productModel !== 'EP-551A' &&
              (!item.effectiveDateBegin || !item.effectiveDateEnd || !item.registration) && item.degree !== '1000.0') {
            isNormal = false
          }
          if (this.delivery === 'delivery' && (item.serialNumber === '' || item.serialNumber === null) && !item.reason && item.whType !== '3') {
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
          if (this.proWrap.busType === '01' && !this.isVirtual && item.productModel !== 'EMERALDC' &&
              item.productModel !== '1MTEC30' && item.productModel !== 'HEALON' && !item.serialNumber) {
            wareInNum = wareInNum + 1
          }
          // 无码退货到自有库
          if (this.proWrap.busType === '02' && (item.serialNumber === '' || item.serialNumber === null || !item.serialNumber) && this.whType === 1) {
            // console.info('item===', item.serialNumber)
            isNoSerial = false
          }
          // 无码退货-医院寄售
          if (this.proWrap.busType === '02' && (item.serialNumber === '' || item.serialNumber === null || !item.serialNumber) && this.whType === 3 && !item.reason) {
            if (
              item.productModel === 'EMERALDC' || item.productModel === '1MTEC30' ||
                item.productModel === 'HEALON'
            ) {
              isBackReason = true
            } else {
              // console.info('item===无码退货===', item, this.whType, item.reason)
              isBackReason = false
            }
          }
          delete item.createBy
          delete item.creatTime
          delete item.updateBy
          delete item.updateTime
        })
        // console.info('wareInNum---', wareInNum)
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
        } else if (!isNoSerial) {
          this.$notification['error']({
            message: '提示',
            description:
                '自有库只支持有码退回~',
            duration: 4
          })
        } else if (!isBackReason) {
          this.$notification['error']({
            message: '提示',
            description:
                '退货入库到寄售库，无码出入库理由不能为空哦~',
            duration: 4
          })
        }
        const params = {
          distCode: this.proWrap.distCode,
          docNo: this.proWrap.docNo,
          docDate: this.proWrap.docData,
          docType: this.proWrap.busType,
          whCode: this.proWrap.whCode,
          remark: this.proWrap.remark,
          detailList: this.productList
        }
        if (this.routeQuery.wareType) {
          params.distribution = this.proWrap.distribution
          params.isDistribution = this.routeQuery.wareType ? 1 : 0
        } else {
          params.cusCode = this.proWrap.cusCode
        }
        this.locFormData.locationData = []
        // console.info('this.proType', this.productList)
        if (this.proType === 'delivery') {
          this.productList.map(delivery => {
            if (delivery.force && delivery.whName === '' &&
                this.locFormData.locationData.findIndex(loc => (loc.serialNumber === delivery.serialNumber)) === -1) {
              this.locFormData.locationData.push(delivery)
            }
          })
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
        if (this.locFormData.locationData.length > 0) {
          this.locationAll = true
          this.locFormData = {
            ...this.locFormData,
            visible: true,
            distCode: this.proWrap.distCode,
            docType: this.proWrap.busType,
            wareType: this.routeQuery.wareType
          }
        }
        if (wareInNum > 0) {
          this.$notification['error']({
            message: '提示',
            description: '非特殊型号不可做无码进货入库，请重新修改入库产品！',
            duration: 4
          })
        }
        // console.info('isWhType====', this.isWhType, 'this.whType====', this.whType)
        if (this.whType === 4 && !this.isWhType) {
          // console.info('-----')
          this.showConfirm()
        } else if (this.whType !== 4 && !this.isWhType && this.proWrap.busType === '02') {
          // console.info('0-0000000000')
          this.isWhType = true
        } else if (this.proWrap.busType !== '02') {
          this.isWhType = true
        }
        // console.info('isNoSerial====', isEPa, isNoSerial, this.isWhType, isBackReason)
        if (isEPa && isNormal && isNoSerialNum && virtual && this.locFormData.locationData.length === 0 && wareInNum === 0 && this.isWhType && isNoSerial && isBackReason) {
          params.reportReason = this.proWrap.reportReason
          if (!this.isSubmit) {
            this.isSubmit = true
            // console.info('提交了')
            submitProduct(params).then(res => {
              if (res.message === 'SUCCESS') {
                // this.$emit('back')
                this.$router.push({ name: 'FileManagement' })
                this.isSubmit = false
                this.isWhType = false
                this.detail = {
                  isShowTool: false,
                  isShowDrafts: false,
                  isShowSubmit: false
                }
                this.udiList = []
                this.productList = []
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
      if (this.getParamsRed.parentCom === 'Drafts') {
        const params = {
          id: this.getParamsRed.docId
        }
        draftsDelete(params).then(res => {
          // console.info('delete----',res)
        })
      }
    },
    showConfirm () {
      const _that = this
      this.$confirm({
        title: '确认退货入库到污损库?',
        onOk () {
          _that.isWhType = true
          _that.handleSubmit()
        },
        onCancel () {
          _that.isWhType = false
        },
        class: 'test'
      })
    },
    onMudleUp () {
      // this.$emit("back", false)
      // console.info(' this.routeQuery', this.routeQuery, this.getParamsRed)
      let routeFrom, routeQuery
      if (this.routeFrom) {
        routeFrom = this.routeFrom
        routeQuery = this.routeQuery
      } else {
        routeFrom = this.getParamsRed.parentCom
        routeQuery = {
          ...this.getParamsRed
        }
      }
      this.$router.push({
        name: routeFrom,
        params: routeQuery
      })
      this.detail = {
        isShowTool: false,
        isShowDrafts: false,
        isShowSubmit: false
      }
      this.udiList = []
      this.productList = []
    },
    // 保存草稿箱
    onSaveDrafts () {
      // console.info('this.proWrap', this.proWrap)
      const params = {
        distCode: this.proWrap.distCode,
        cusCode: this.proWrap.cusCode,
        docNo: this.proWrap.docNo,
        docDate: this.proWrap.docData,
        docType: this.proWrap.busType,
        whCode: this.proWrap.whCode,
        remark: this.proWrap.remark,
        detailList: this.productList,
        reportReason: this.proWrap.reportReason,
        jsonErrorList: this.jsonErrorList,
        distribution: this.proWrap.distribution,
        authorize: this.authorize,
        isDistribution: this.routeQuery.wareType ? 1 : 0
      }
      draftsNew(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '提示',
            description: '保存成功！',
            duration: 4
          })
          // this.$emit("back")
          this.$router.push({
            name: 'Drafts'
          })
          this.detail = {
            isShowTool: false,
            isShowDrafts: false,
            isShowSubmit: false
          }
        } else {
          this.$notification['error']({
            message: '提示',
            description: '出错了哦！',
            duration: 4
          })
        }
      })
      if (this.getParamsRed.parentCom === 'Drafts') {
        const params = {
          id: this.getParamsRed.docId
        }
        draftsDelete(params).then(res => {
          // console.info("delete----", res)
        })
      }
    },
    // 点击批量添加
    handleuidMore () {
      if (!this.isBtn) {
        this.uidMore = true
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    handleUdiSub (val) {
      // console.info('val',newVal)
      if (val.length > 0) {
        val.map(item => {
          if (item !== '' && item.length > 48) {
            this.$notification['error']({
              message: '提示',
              description: '呀，udi码超长啦！',
              duration: 4
            })
          } else {
            const params = {
              distCode: this.proWrap.distCode,
              udi: item
            }
            this.getScanIn(params)
            this.uidMore = false
          }
        })
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请输入唯一码！',
          duration: 4
        })
      }
    },
    handleUdiCancle () {
      this.uidMore = false
    },
    // 初始化点击
    handleClick (val) {
      if (!this.isBtn) {
        // console.info('---------', this.whType, this.proWrap.busType, 'getParamsRed', this.getParamsRed)
        const getParams = getParamsFromStore('NEWWARE')
        this.routeQuery = {
          ...getParams
        }
        switch (val.type) {
          case 'noUdi': // 无码新增
            this.isNoCode = true
            this.isShowSearch = true
            this.deliveryData = {
              whList: this.proWrap.whList,
              distCode: this.proWrap.distCode,
              docType: this.proWrap.busType,
              wareType: this.routeQuery.wareType ? this.routeQuery.wareType : null
            }
            // if (this.proWrap.busType === '02' && this.whType === 3) {
            if (this.proWrap.busType === '02') {
              this.deliveryData.whType = this.whType
            }
            break
          case 'preStorage':
            this.isPreAdd = true
            this.fromData = {
              title: '预入库新增',
              type: 'fromPro',
              visible: true,
              distCode: this.proWrap.distCode,
              docType: this.proWrap.busType
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
            this.scanStart = true
            window.addEventListener('keydown', this.scanWrapper, false)
            break
          case 'preStorageIn':
            this.isPreAdd = true
            this.fromData = {
              title: '在库产品新增',
              type: 'fromProIn',
              visible: true,
              // typeCode: this.newData.typeCode,
              distCode: this.proWrap.distCode,
              whFromList: this.whFromList,
              docType: this.proWrap.busType
            }
            break
          default:
            break
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },

    // 提交
    scanContent (params) {
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
          // console.info('hasUid',this.udiList,this.productList)
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
    handleEdit (params) {
      // console.info('changeparams---', params)
      let proIndex = -1
      if (params.serialNumber && params.serialNumber !== null) {
        proIndex = this.productList.findIndex(
          item => item.serialNumber === params.serialNumber
        )
      } else {
        proIndex = this.productList.findIndex(
          item => item.id === params.id
        )
      }
      // console.info('proIndex=====', proIndex)
      if (proIndex > -1) {
        this.productList[proIndex] = JSON.parse(JSON.stringify(params))
      }

      // console.info('this.productList---',this.productList)
    },
    // 删除
    handleRemove (params) {
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
    // 一键清除错误行
    handleRemoveAll () {
      // console.info('this.udiList===',this.udiList)
      this.udiList = []
      const newList = JSON.parse(JSON.stringify(this.productList))
      const trueProList = []
      newList.map(item => {
        if (item.errorMessage !== 'true') {
          trueProList.push(item)
          this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
        }
      })
      this.productList = trueProList
      this.jsonErrorList = []
      // console.info('this.udiList---',this.udiList)
    },
    // 清空
    getEmpty () {
      this.isVirtual = false
      this.productList = []
      this.udiList = []
      this.jsonErrorList = []
      this.haAuth = 'has'
    },
    // 获取未授权医院
    getAllHos (val, distCode) {
      // console.info(val)
      const params = {
        distCode: distCode,
        page: 1,
        size: 9999
      }
      const _that = this
      unAuthHosList(params).then(res => {
        res.data.list.map(item => {
          if (item.hosCode === val) {
            _that.proWrap.cusName = item.hosName
          }
        })
      })
    },
    // 是否为三产业务
    getEstate (getParams) {
      if (getParams.wareType === 'estate' && getParams.proType === 'wareIn') {
        this.isEstate = true
        this.handleBusiness('02')
      } else if (getParams.wareType === 'estate' && getParams.proType === 'delivery') {
        this.handleBusiness('11')
        this.isEstate = true
      }
    },
    // 新增初始化
    getFirstData () {
      this.isBtn = true
      let getParams
      if (this.$route.params.pageTitle) {
        getParams = this.$route.params
        saveParamsFromStore(getParams, 'NEWWARE')
        this.getParamsRed = getParams
      } else {
        getParams = getParamsFromStore('NEWWARE')
        this.getParamsRed = getParamsFromStore('NEWWARE')
        this.routeQuery = {
          ...getParams
        }
      }
      this.routeQuery.wareType = getParams.wareType ? getParams.wareType : null
      // console.info('getParams===', getParams)
      if (getParams.wareType === 'estate') {
        this.delivery = 'estate'
      }
      this.proWrap = {
        ...this.proWrap,
        docNo: '',
        cusCode: undefined,
        docData: null,
        remark: '',
        reportReason: '',
        distribution: ''
      }
      // 初始化数据清空
      this.getEmpty()
      const _that = this
      const getFirstDatas = {}
      if (getParams.parentCom === 'Drafts') {
        this.handleBusType()
        this.getEstate(getParams)
        this.pageTitle = getParams.pageTitle
        this.proType = getParams.proType
        console.info('getParams.docType', getParams)
        this.proWrap.busType = getParams.docType
        const params = {
          id: getParams.docId
        }
        draftsDetail(params).then(res => {
          if (res.message === 'SUCCESS') {
            this.proWrap = {
              ...this.proWrap,
              distList: res.data.distList,
              cusList: res.data.cusList,
              whList: res.data.whList,
              docNo: res.data.document.docNo,
              docData: res.data.document.docDate ? moment(res.data.document.docDate).format('YYYY-MM-DD') : null,
              remark: res.data.document.remark,
              distCode: res.data.document.distCode,
              reportReason: res.data.document.reportReason,
              busType: res.data.document.docType
            }
            this.haAuth = res.data.document.authorize ? res.data.document.authorize : 'has'
            this.authorize = res.data.document.authorize ? res.data.document.authorize : 'has'
            this.productList = res.data.document.detailList
            this.jsonErrorList = res.data.document.jsonErrorList ? res.data.document.jsonErrorList : []
            res.data.document.detailList.map(item => {
              this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
            })
            if (res.data.document.distribution) {
              this.proWrap.distribution = res.data.document.distribution
              if (res.data.document.docType === '02') {
                this.isEstate = true
                this.handleBusiness('02')
              } else {
                this.isEstate = true
                this.handleBusiness('11')
              }
            }
          }
          // this.proWrap.busType = getParams.docType
          const params = {
            distCode: res.data.document.distCode,
            docType: getParams.docType
          }
          this.getWhList(params, res.data.document.whCode)
          this.getCusList(params, res.data.document.cusCode)
          if (res.data.document.authorize !== 'has') {
            this.getAllHos(res.data.document.cusCode, res.data.document.distCode)
          }
          this.isBtn = false
        })
      } else if (getParams.parentCom === 'FileManagement') {
        this.handleBusType()
        this.getEstate(getParams)
        this.pageTitle = getParams.pageTitle
        this.proType = getParams.proType
        const params = {
          id: getParams.fileIdDoc
        }

        getAutoJson(params).then(res => {
          if (res.message === 'SUCCESS') {
            let jsonParam = {}
            const jsonAuto = JSON.parse(res.data.fileJson)
            // console.info('jsonAuto====',jsonAuto)
            this.jsonErrorList = res.data.errorIndexList
            jsonAuto.detailList.map((file, index) => {
              if (this.jsonErrorList.indexOf((index + 1).toString()) !== -1) {
                file.errorMessage = 'true'
              } else {
                file.errorMessage = 'false'
              }
            })
            this.proWrap = {
              ...this.proWrap,
              distList: jsonAuto.distList,
              cusList: jsonAuto.cusList,
              whList: jsonAuto.whList,
              docData: jsonAuto.docDate ? moment(jsonAuto.docDate).format('YYYY-MM-DD') : null,
              remark: jsonAuto.remark,
              distCode: jsonAuto.distCode,
              docNo: jsonAuto.docNo,
              busType: jsonAuto.docType,
              reportReason: jsonAuto.reportReason
            }
            this.productList = jsonAuto.detailList
            jsonAuto.detailList.map(item => {
              this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
            })

            if (jsonAuto.distribution) {
              this.proWrap.distribution = jsonAuto.distribution
              if (jsonAuto.docType === '02') {
                this.isEstate = true
                this.handleBusiness('02')
              } else {
                this.isEstate = true
                this.handleBusiness('11')
              }
            } else {
              this.haAuth = (jsonAuto.hosAuthFlag === '1' || !jsonAuto.hosAuthFlag) ? 'has' : 'hasNo'
              this.authorize = (jsonAuto.hosAuthFlag === '1' || !jsonAuto.hosAuthFlag) ? 'has' : 'hasNo'
              jsonParam = {
                distCode: jsonAuto.distCode,
                docType: jsonAuto.docType
              }
              if (jsonAuto.hosAuthFlag === '2') {
                this.getAllHos(jsonAuto.cusCode, jsonAuto.distCode)
              }
              this.getCusList(jsonParam, jsonAuto.cusCode)
            }
            this.getWhList(jsonParam, jsonAuto.whCode)

            // 判断业务类型
            this.getDocumentDistList()
            this.isBtn = false
          }
          // console.info('this.productList---',this.productList)
        })
      } else {
        // 判断业务类型
        this.handleBusType()
        // console.info('this.pageType---',this.pageType)
        const params = {
          distCode: this.$store.state.user.info.distCode,
          docType: this.pageType
        }
        this.pageTitle = getParams.pageTitle
        this.proType = getParams.proType
        this.proWrap.docData = new Date()
        addWareData(params).then(res => {
          // console.info("res-----", res)
          if (res.message === 'SUCCESS') {
            if (res.data.whList.length === 0) {
              this.$notification['error']({
                message: '错误',
                description: '请先添加库位，再操作新增出入库！',
                duration: 4
              })
            } else {
              this.proWrap = {
                ...this.proWrap,
                distList: res.data.distList,
                cusList: res.data.cusList,
                docNo: res.data.docNo,
                distCode: res.data.distList[0].distCode
              }
              // console.info('this.routeQuery.wareType===', this.routeQuery.wareType)
              // if (this.routeQuery.wareType) {
              //   this.proWrap.whList = res.data.whFromList
              //   this.whQueram = res.data.whFromList
              // } else {
              this.proWrap.whList = res.data.whFromList
              this.whQueram = res.data.whFromList
              // }
              // console.info('this.whQueram', this.whQueram)
              this.whFromList = res.data.whFromList

              if (getParams.proType === 'wareIn') {
                this.proWrap.whList = res.data.whList
                this.proWrap.cusCode = res.data.cusList[0].cusCode
                this.proWrap.whCode = res.data.whList[0].whCode
              }
            }
            this.getEstate(getParams)
            this.isBtn = false
          }
        })
      }
    }
  },
  watch: {
    $route (to, from) {
      // console.info('to--',to)
      if (to.name.indexOf('_Edit') !== -1) {
        const getParams = to.params
        this.isBtn = true
        this.routeFrom = getParams.parentCom
        this.routeQuery = {
          ...getParams
        }
        this.getFirstData()
      }
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.scanWrapper, false)
    saveParamsFromStore(null)
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
          width: 25% !important;
          flex-grow: 1;
          background: rgba(251, 251, 251, 1);
          text-align: right;
          line-height: 56px;
          padding: 0 12px;
          display: inline-block;
          font-size: 13px;
          color: rgba(52, 53, 62, 1);

          small {
            color: red;
            padding: 0 4px 0 0;
          }
        }

        .basicInfo {
          flex-grow: 1;
          width: 75% !important;
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

  //一键清除
  .removeAll {
    position: fixed;
    right: 0;
    bottom: 32px;
    background: rgba(62, 77, 168, 1);
    height: 32px;
    line-height: 32px;
    border-radius: 16px 0px 0px 16px;
    z-index: 9999;
    color: white;
    padding: 0 0 0 10px;
    font-size: 14px;
    cursor: pointer;

    .iconfont {
      font-size: 28px;
      float: left;
      margin: 0 6px 0 0;
    }

    span {
      display: none;
      padding: 0 10px 0 0;
    }

    &:hover {
      span {
        display: inline-block;
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

    .ant-spin-container {
      height: 100%;
    }
  }

  .scanOverview {
    .ant-popover-inner {
      width: 100%;
    }

    .scanCon {
      text-align: center;
      padding: 24px 0;

      p {
        line-height: 32px;
        color: rgba(177, 177, 177, 1);
        font-size: 14px;
      }
    }
  }

  :global {
    .basicBorder {
      .ant-select-selection-selected-value {
        font-size: 13px;
      }

      .ant-select-selection__rendered {
        margin: 0 6px;
      }

      .ant-input {
        font-size: 13px;
        padding: 4px 6px;
      }

      .ant-select-selection .ant-select-search__field__placeholder, .ant-select-selection .ant-select-selection__placeholder {
        font-size: 13px;
      }
    }
  }

</style>
