<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="14">
          <h3>{{ title }}</h3>
        </a-col>
        <a-col :md="10">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSave()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>保存</span>
                </template>
                <i class="iconfont icon-save" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="invoiceTableManual">
      <!-- <a-form layout="inline"> -->
      <!--      <div class="invoiceTableManual" v-for="(item,key) in inputData">-->
      <a-row :gutter="24">
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>发票类型
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select
                :style="{ maxWidth:'255px',width:'100%' }"
                placeholder="请选择发票类型"
                @change="invoiceTypeChange"
                v-model="invoiceData.inType"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                :disabled="isEditShow">
                <a-select-option v-for="(item,key) in invoiceList" :key="key" :value="item.code" :title="item.name">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>发票代码
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="请输入发票代码" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.inCode" :disabled="isEditShow" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>发票号码
            </a-col>
            <a-col :span="18" class="rightcell borderRadiusRight">
              <a-input placeholder="请输入发票号码" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.inNo" :disabled="isEditShow" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>开票日期
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-date-picker v-model="invoiceData.inDate" :style="{ maxWidth:'255px',width:'100%' }" :disabledDate="disabledDate" :disabled="isEditShow"></a-date-picker>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>销货方
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select placeholder="请选择销货方" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.distCode" @change="(value,option) => { sellerChange(value,option) }" :getPopupContainer="triggerNode => triggerNode.parentNode">
                <a-select-option v-for="(item,key) in sellerData" :value="item.code" :type="item.type" :title="item.name" :key="key">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="addType !== null">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>配送商
            </a-col>
            <a-col :span="18" class="rightcell borderRadiusRight">
              <a-input placeholder="请输入配送商" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.distribution" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="addType === null">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>购货方
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input-group compact :style="{margin:'12px 0'}">
                <a-select style="width:75px" placeholder="已授权" v-model="invoiceData.authorize" @change="handleAuth">
                  <a-select-option value="has">已授权</a-select-option>
                  <a-select-option value="hasNo">未授权</a-select-option>
                </a-select>
                <a-select
                  style="width: 180px;"
                  showSearch
                  placeholder="选择客户"
                  optionFilterProp="children"
                  v-model="invoiceData.cusCode"
                  v-show="invoiceData.authorize !== 'hasNo'">
                  <a-select-option v-for="item in cusList" :key="item.code" :value="item.code" :title="item.name">{{ item.name }}</a-select-option>
                </a-select>
                <a-input
                  placeholder="请选择客户名称"
                  @click="handleSelectCus"
                  style="width: 100%;max-width:180px;"
                  v-model="invoiceData.cusName"
                  v-show="invoiceData.authorize === 'hasNo'"
                  readonly />
              </a-input-group>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>不含税金额
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="请输入不含税金额" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.noneTaxTotal" v-show="invoiceData.negative" :disabled="isEditShow && (invoiceData.inType === '01' || invoiceData.inType === '04' || invoiceData.inType === '10')">
                <a-icon slot="prefix" type="minus" style="font-size:10px;" />
              </a-input>
              <a-input placeholder="请输入不含税金额" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.noneTaxTotal" v-show="!invoiceData.negative" :disabled="isEditShow && (invoiceData.inType === '01' || invoiceData.inType === '04' || invoiceData.inType === '10')" />

              <!-- <span v-show="inputData[key].invoice.negative" class="priceNegative">-</span> -->
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8" v-show="invoiceData.verifyCodeShow">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>校验码后六位
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="请输入校验码后六位" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.verifyCode" :disabled="isEditShow" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>销量月份
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select
                style="width: 100%; max-width: 255px"
                placeholder="选择销量月份"
                v-model="invoiceData.date"
                @change="(value,option)=>{saleMonthChange(value,option,invoiceData)}">

                <a-select-option v-for="item in monthList" :key="item.code" :value="item.name" :title="item.name" :configType="item.configType">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">添加图片</a-col>
            <a-col :span="18" class="rightcell">
              <span class="imgMsg" v-show="invoiceData.uploadStatus" @click="viewImg">查看图片</span>
              <a-upload
                action="/amo/upload/file/add"
                @change=" uploadChange "
                :showUploadList="false"
                :headers="headerUpload"
                :beforeUpload="beforeUpload"
                :data="uploadData">
                <span v-show="invoiceData.uploadStatus">重新上传</span>
                <span v-show="!invoiceData.uploadStatus">上传一张图片</span>
              </a-upload>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" :class="invoiceData.verifyCodeShow ? 'leftcell borderRadiusLeft' : 'leftcell'">
              <span class="mustFill">*</span>发票状态
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select
                :style="{ maxWidth:'255px',width:'100%' }"
                placeholder="请选择发票状态"
                @change="statusChange"
                v-model="invoiceData.inStatus"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                :disabled="isEditShow && (invoiceData.inType === '01' || invoiceData.inType === '04' || invoiceData.inType === '10')">
                <a-select-option v-for="(item,key) in invoiceStatusList" :key="key" :value="item.code">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" :class="invoiceData.verifyCodeShow ? 'leftcell' : 'leftcell borderRadiusLeft'">备注</a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="备注" :style="{ maxWidth:'255px',width:'100%' }" v-model="invoiceData.inRemark" :maxLength="60" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <!--      </div>-->
      <a-modal :visible="imgVisible" :footer="null" @cancel="imgCancel" width="660px" class="imgModal">
        <img alt="example" style="width: 100%" :src="srcImg" />
      </a-modal>
      <select-cus-name v-if="selectShow" :visible="selectShow" :cusData="selectData(selectKey)" @selectCus="handleSelectOk" @selectCancle="handleSelectCancle"></select-cus-name>
      <!-- </a-form> -->
    </div>
  </div>
</template>

<script>
import {
  invoiceAdd,
  invoiceSeller,
  invoiceBuyer,
  EstateAdd,
  getSaleMonth,
  invoiceUpdate,
  EstateUpdate
} from '@/api/auditManage/auditManage'
import {
  getDocumentCusList
} from '@/api/depot/wareHouse'
import moment from 'moment'
import {
  getStore,
  setStore
} from '@/utils/storage'
import SelectCusName from './SelectCusName'

export default {
  name: 'AuditAdd',
  props: ['invoiceType', 'editData'],
  components: {
    SelectCusName
  },
  data() {
    return {
      title: '发票编辑',
      timeSelect: [null],
      invoiceList: [{
        code: '01',
        name: '增值税专用发票'
      },
      {
        code: '04',
        name: '增值税普通发票'
      },
      {
        code: '10',
        name: '增值税普通发票（电子）'
      }
      ],
      invoiceStatusList: [{
        code: '1',
        name: '蓝票'
      },
      {
        code: '2',
        name: '红票'
      }
      ],
      uploadData: {
        fileType: 1,
        uploadType: 1
      },
      monthList: [],
      authorize: 'has',
      imgVisible: false,
      srcImg: '',
      inputData: [{
        invoice: {
          inCode: '',
          inNo: '',
          inType: undefined,
          inDate: null,
          noneTaxTotal: '',
          taxTotal: '',
          verifyCode: '',
          inRemark: '',
          inStatus: undefined,
          status: '1',
          distCode: undefined,
          distName: '',
          cusCode: undefined,
          cusName: '',
          cusType: '',
          verifyCodeShow: true,
          negative: false,
          cusCategory: '',
          proxyOrgName: '',
          reportType: '3'
        },
        picId: ''
      }],
      invoiceData: {
        inCode: '',
        inNo: '',
        inType: undefined,
        inDate: null,
        noneTaxTotal: '',
        taxTotal: '',
        verifyCode: '',
        inRemark: '',
        inStatus: undefined,
        status: '1',
        distCode: undefined,
        distName: '',
        cusCode: undefined,
        cusName: '',
        cusType: '',
        verifyCodeShow: true,
        negative: false,
        cusCategory: '',
        proxyOrgName: '',
        reportType: '3',
        authorize: 'has'
      },
      picId: '',
      sellerData: [],
      buyerData: [],
      saveStatus: false,
      selectShow: false,
      selectKey: 0,
      cusList: [],
      isInvoice: true,
      isEditShow: false,
      isVoucher: false,
      addType: null
    }
  },
  computed: {
    headerUpload() {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
  },
  created() {
    this.getInvoiceSeller()
    this.getFirstLogin()
  },
  methods: {
    getFirstLogin() {
      const _that = this
      const editData = getStore('AUDITEDIT')
      const addType = getStore('EstateInfo')
      this.addType = addType.addType
      if (addType.addType !== null) {
        this.uploadData.fileType = 11
      }
      if (editData.id) {
        const params = {
          code: editData.distCode,
          type: 1
        }
        this.getBuyerData(params)
        this.invoiceData = editData
        this.invoiceData.inDate = moment(editData.inDate).format('YYYY-MM-DD')
        this.invoiceData.date = undefined
        // this.invoiceData.date = this.invoiceData.salesYear ? (this.invoiceData.salesYear + '-' + this.invoiceData.salesMonth) : undefined
        this.invoiceData.srcImg = this.invoiceData.fileUrl
        this.invoiceData.uploadStatus = this.invoiceData.imgShow
        if (this.invoiceData.verifyErrCode === '2000' || this.invoiceData.verifyErrCode === '3000') {
          this.isEditShow = true
        }
        this.invoiceData.authorize = this.invoiceData.hosAuthFlag === '2' ? 'hasNo' : 'has'
      } else {
        this.setFirst()
      }
      const invoiceType = this.invoiceType.invoiceType
      if (invoiceType === 1) {
        if (!addType.addType && !editData.id) {
          this.title = '发票新增'
        } else if (!addType.addType && editData.id) {
          this.title = '发票编辑'
        } else if (addType.addType === 'estate' && editData.id) {
          this.title = '配送商发票编辑'
        } else {
          this.title = '配送商发票新增'
        }
      } else if (invoiceType === 2) {
        this.title = '图片识别'
      } else {
        this.title = '扫码识别'
      }
      this.monthList = []
      getSaleMonth().then(res => {
        res.data.map(item => {
          _that.monthList.push({
            code: item.id,
            name: item.year + '-' + item.month,
            configType: item.configType
          })
        })
      })
    },
    saleMonthChange(value, option, item) {
      item.invoiceType = option.data.attrs.configType
      item.voucherStatus = option.data.attrs.configType
      this.$forceUpdate()
    },
    setFirst() {
      this.invoiceData = {
        inCode: '',
        inNo: '',
        inType: undefined,
        inDate: null,
        noneTaxTotal: '',
        taxTotal: '',
        verifyCode: '',
        inRemark: '',
        inStatus: undefined,
        status: '1',
        distCode: undefined,
        distName: '',
        cusCode: undefined,
        cusName: '',
        cusType: '',
        verifyCodeShow: true,
        negative: false,
        cusCategory: '',
        proxyOrgName: '',
        reportType: '3',
        authorize: 'has'
      }
      this.isEditShow = false
    },
    statusChange(val) {
      // 发票状态切换
      if (val === '2') {
        this.invoiceData.negative = true
      } else {
        this.invoiceData.negative = false
      }
    },
    disabledDate(current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    invoiceTypeChange(val) {
      // 发票类型切换
      if (val === '04' || val === '10') {
        this.invoiceData.verifyCodeShow = true
      } else {
        this.invoiceData.verifyCode = undefined
        this.invoiceData.verifyCodeShow = false
      }
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },
    handleAuth() {
      if (this.invoiceData.authorize === 'has') {
        const params = {
          distCode: this.$store.state.user.info.distCode
        }
        this.getCusList(params)
      }
      this.invoiceData.cusCode = undefined
      this.invoiceData.cusName = ''
    },
    getCusList(params, checkedcus) {
      getDocumentCusList(params).then(res => {
        if (res.message === 'SUCCESS') {
          console.info('res====', res)
          this.cusList = res.data
        }
      })
    },
    handleChangeCus(val) {
      this.cusList.forEach(item => {
        if (item.code === val) {
          this.invoiceData.cusName = item.name
        }
      })
    },

    // 发票数据
    selectData() {
      return {
        distCode: this.invoiceData.distCode,
        cusCode: this.invoiceData.cusCode,
        cusName: this.invoiceData.cusName
      }
    },
    // 选择购货方弹框
    handleSelectCus(disKey) {
      this.selectKey = disKey
      if (this.invoiceData.distCode) {
        this.selectShow = true
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请先选择销货方！',
          duration: 4
        })
      }
    },
    handleSelectOk(subVal) {
      // console.info('subVal====', subVal)
      this.invoiceData.cusCode = subVal.cusCode
      this.invoiceData.cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle() {
      this.selectShow = false
    },
    beforeUpload(file, fileList) {
      // 上传前回调
      const size = file.size / 1024 / 1024
      if (size > 5) {
        this.$notification['error']({
          message: '上传失败',
          description: '文件大小不能超过5M！',
          duration: 4
        })
        return false
      }
    },
    sellerChange(value, option) {
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.invoiceData.cusCode = undefined
      this.invoiceData.distCode = value
      this.getBuyerData(param)
    },
    getBuyerData(param) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.cusList = res.data
        this.$forceUpdate()
      })
    },
    viewImg() {
      // 查看图片
      this.srcImg = this.invoiceData.srcImg
      this.imgVisible = true
    },
    imgCancel() {
      // 取消查看图片
      this.imgVisible = false
    },
    uploadChange(info, key) {
      // 上传
      if (info.file.status !== 'uploading') {}
      if (info.file.status === 'done') {
        if (info.file.response.code === 500) {
          this.$notification['error']({
            message: '上传失败',
            description: info.file.response.message,
            duration: 4
          })
        } else if (info.file.response.code === 200) {
          this.$notification['success']({
            message: '提示',
            description: '上传成功',
            duration: 4
          })
          this.invoiceData.uploadStatus = true
          this.inputData[0].picId = info.file.response.data.id
          this.picId = info.file.response.data.id
          this.srcImg = info.file.response.data.fileUrl
          this.invoiceData.srcImg = info.file.response.data.fileUrl
          this.$forceUpdate()
        }
        if (info.fileList.length > 1) {
          info.fileList.splice(0, 1)
        }
      } else if (info.file.status === 'error') {
        this.$notification['error']({
          message: '提示',
          description: '上传失败！',
          duration: 4
        })
      }
    },
    deleteInvoice(key) {
      // 删除
      this.inputData.splice(key, 1)
      this.timeSelect.splice(key, 1)
      this.buyerData.splice(key, 1)
    },
    manualAdd() {
      // 添加
      this.timeSelect.unshift(null)
      this.buyerData.unshift([])
      this.inputData.unshift({
        invoice: {
          inCode: '',
          inNo: '',
          inType: undefined,
          inDate: null,
          noneTaxTotal: '',
          taxTotal: '',
          verifyCode: '',
          inRemark: '',
          inStatus: undefined,
          negative: false,
          status: '1',
          distCode: undefined,
          distName: '',
          cusCode: undefined,
          cusName: '',
          cusType: '',
          verifyCodeShow: true,
          cusCategory: '',
          proxyOrgName: '',
          reportType: '3'
        },
        picId: ''
      })
    },
    isEmpty(str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    handleSave() {
      // 保存
      if (this.saveStatus) {
        this.$notification['error']({
          message: '提示',
          description: '正在保存中，请稍后...',
          duration: 4
        })
        return false
      }
      this.saveStatus = true
      this.invoiceData.inDate = moment(this.invoiceData.inDate).format('YYYY-MM-DD')
      this.invoiceData.hosAuthFlag = this.invoiceData.authorize === 'hasNo' ? '2' : '1'

      const currentData = this.invoiceData
      if (
        this.isEmpty(currentData.inType) ||
                this.isEmpty(currentData.inCode) ||
                this.isEmpty(currentData.inNo) ||
                this.isEmpty(currentData.inDate) ||
                this.isEmpty(currentData.distCode) ||
                this.isEmpty(currentData.date) ||
                this.addType === null && this.isEmpty(currentData.cusCode) ||
                this.isEmpty(currentData.noneTaxTotal) ||
                this.isEmpty(currentData.inStatus) ||
                this.addType !== null && this.isEmpty(currentData.distribution)
      ) {
        this.$notification['error']({
          message: '提示',
          description: '必填信息不能为空！',
          duration: 4
        })
        this.saveStatus = false
        return false
      }
      if (currentData.inType === '04' || currentData.inType === '10') {
        if (this.isEmpty(currentData.verifyCode)) {
          this.$notification['error']({
            message: '提示',
            description: '必填信息不能为空！',
            duration: 4
          })
          this.saveStatus = false
          return false
        }
      }
      const re = /^(\d+)(.\d{0,2})?$/
      if (currentData.inCode && currentData.inCode.length > 20) {
        this.$notification['error']({
          message: '提示',
          description: '发票代码长度不能超过20！',
          duration: 4
        })
        this.saveStatus = false
        return false
      } else if (!re.test(currentData.noneTaxTotal)) {
        this.$notification['error']({
          message: '提示',
          description: '不含税金额最多保留小数点后两位！',
          duration: 4
        })
        this.saveStatus = false
        return false
      }
      if (currentData.remark && currentData.remark.length > 200) {
        this.$notification['error']({
          message: '提示',
          description: '备注长度不能超过200！',
          duration: 4
        })
        this.saveStatus = false
        return false
      }

      if (isNaN(currentData.noneTaxTotal) || currentData.noneTaxTotal < 0) {
        console.log(currentData.noneTaxTotal)
        this.$notification['error']({
          message: '提示',
          description: '不含税金额格式不正确！',
          duration: 4
        })
        this.saveStatus = false
        return false
      } else if (
        currentData.noneTaxTotal && currentData.noneTaxTotal.length > 20
      ) {
        this.$notification['error']({
          message: '提示',
          description: '不含税金额长度不能超过20！',
          duration: 4
        })
        this.saveStatus = false
        return false
      }
      this.inputData[0].invoice = this.invoiceData
      // console.info('this.invoiceData', this.invoiceData)
      const userDistCode = getStore('USER_DIST_CODE')
      const userDistName = getStore('USER_DIST_NAME')
      this.invoiceData.reportOrgCode = userDistCode
      this.invoiceData.reportOrgName = userDistName
      const auditObj = {
        invoice: this.invoiceData,
        picId: this.picId
      }
      const editData = getStore('AUDITEDIT')
      if (this.addType === null) {
        if (editData.id) {
          invoiceUpdate(auditObj).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '编辑成功！',
                duration: 4
              })
              setStore('AUDITEDIT', {})
              // console.info('auditObj.invoice----', auditObj.invoice)
              setStore('EstateId', auditObj.invoice)
              this.$router.push({
                name: 'AuditManage_Detail'
              })
            } else {
              this.$notification['error']({
                message: '编辑失败',
                description: res.message,
                duration: 4
              })
            }
            this.saveStatus = false
          })
        } else {
          invoiceAdd(auditObj).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '保存成功！',
                duration: 4
              })
              const invoiceInfo = res.data.invoice
              const params = {
                id: invoiceInfo.id,
                status: invoiceInfo.status,
                verifyStatus: invoiceInfo.verifyStatus,
                verifyErrCode: invoiceInfo.verifyErrCode,
                verifyErrMsg: invoiceInfo.verifyErrMsg
              }
              setStore('AUDITEDIT', {})
              setStore('EstateId', params)
              this.$router.push({
                name: 'AuditManage_Detail'
              })
            } else {
              this.$notification['error']({
                message: '保存失败',
                description: res.message,
                duration: 4
              })
            }
            this.saveStatus = false
          })
        }
      } else {
        // const editData = getStore('EstateId')

        if (editData && editData.id) {
          EstateUpdate(auditObj).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '保存成功！',
                duration: 4
              })
              setStore('AUDITEDIT', {})
              auditObj.id = editData.id
              setStore('EstateId', auditObj.invoice)
              this.$router.push({
                name: 'PerfessionWrap_Detail'
              })
            } else {
              this.$notification['error']({
                message: '保存失败',
                description: res.message,
                duration: 4
              })
            }
            this.saveStatus = false
          })
        } else {
          EstateAdd(auditObj).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '保存成功！',
                duration: 4
              })
              setStore('AUDITEDIT', {})
              const estateInfo = res.data.invoice
              const paramId = {
                InvoiceId: estateInfo.id,
                distribution: estateInfo.distribution,
                verifyStatus: estateInfo.verifyStatus,
                inStatus: estateInfo.inStatus,
                distCode: estateInfo.distCode
              }
              // console.info('paramId----', paramId)
              setStore('EstateId', paramId)
              this.$router.push({
                name: 'PerfessionWrap_Detail'
              })
            } else {
              this.$notification['error']({
                message: '保存失败',
                description: res.message,
                duration: 4
              })
            }
            this.saveStatus = false
          })
        }
      }
    },
    handleBack() {
      const addType = getStore('EstateInfo')
      setStore('EstateId', {})
      setStore('AUDITEDIT', {})
      setStore('EstateDetails', {})
      if (addType.parentCom) {
        // this.$router.push({
        //     name: addType.parentCom
        // })
        const parmPath = '/auditManage/estateAudit/PerfessionWrap#list'
        history.pushState(
          null,
          null,
          parmPath
        )
        const callback = function () {
          console.log('0903 销毁2')
          window.removeEventListener('popstate', callback)
        }
        window.addEventListener('popstate', callback)
        this.$router.go(0)
      } else {
        this.$router.push({
          name: 'AuditManage'
        })
      }
    }
  },
  watch: {
    editData(newVal, olcVal) {
      this.getFirstLogin()
    }
  }
}
</script>

<style lang="less" scoped>
.iconCheck {
    position: absolute;
    display: inline-block;
    right: 8px;
    // top: 215px;
    bottom: -17px;

    .check {
        font-size: 66px;
        opacity: 0.7;
    }

    .iconCheckUnpass {
        color: #e17877;
    }

    .iconcheckPass {
        color: #60c697;
    }

    .iconCheckAbnormal {
        color: #fbc773;
    }

    .iconNationTax {
        color: #e17877;
    }
}

.iconCheck:hover {
    .check {
        opacity: 1;
    }
}

.ant-input-affix-wrapper .ant-input:not(:first-child) {
    background: white;
}

.ant-select-disabled {
    .ant-select-selection {
        background-color: #f5f5f5 !important;
        opacity: 1;
        cursor: not-allowed;
        color: rgba(0, 0, 0, 0.25);
    }
}

.ant-input-disabled {
    background-color: #f5f5f5 !important;
    opacity: 1;
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
}

.borderRadiusRight {
    border-radius: 0 8px 0 0;
}

.borderRadiusLeft {
    border-radius: 0 0 0 8px;
}

.detailsProduct {
    position: relative;

    span {
        position: absolute;
        left: 4px;
        z-index: 99;
    }
}

/*模态框按钮*/
.imgModal {
    .anticon-close {
        color: #000 !important;
        border: none !important;
    }
}

/*产品列表*/
.productDetails {
    .ant-table-body {
        td {
            .icon-inputSub {
                cursor: pointer;
            }
        }
    }

    .icon-tableMore {
        &hover {
            color: #3e4da8 !important;
        }
    }
}

/*随行单*/
.accompanyList {
    .accompanyTitle {
        line-height: 52px;
        background: #f9f9f9;
        text-align: center;
        border-radius: 8px 8px 0px 0px;
        color: #939393;
        position: relative;
        border: 1px solid #efefef;

        .tip {
            position: absolute;
            left: 20px;
        }
    }

    .accompanyUpload {
        border: 1px solid #efefef;
        border-top: none;
        padding: 10px;

        .iconfont {
            font-size: 20px;
        }

        .ant-upload {
            &:hover {
                color: #3e4de8;
            }
        }

        .ant-upload-list {
            width: 100%;
        }

        .ant-upload-list-item {
            padding: 0;
        }
    }
}

/*收缩展开*/
.pageTitle {
    &.estateTitle {
        padding: 0 32px;
        margin: 0;

        .turnon {
            padding: 4px 14px;
        }

        .pageTitle-Btn {
            position: absolute;
            top: -60px;
            right: 24px;
        }
    }

    .detailsTitle {
        float: left;
    }

    .turnon {
        float: left;
        margin-left: 40px;
        font-size: 12px;
        color: #939393;
        cursor: pointer;
        background: #fcfcfc;
        border-radius: 20px;
        padding: 8px 14px;

        &:hover {
            color: #3e4da8;
        }

        .iconfont {
            margin-left: 10px;
            font-size: 10px;
        }
    }
}

/*表格样式*/
.tableTitle {
    margin-top: 20px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    border: 1px solid #efefef;
    border-radius: 8px 8px 0 0;
    border-bottom: none;
    background: #f9f9f9;
    color: #939393;
}

/*无发票列表*/
.addDeatils {
    width: 100%;
    padding: 60px 160px;
    text-align: center;

    h4 {
        font-size: 14px;
        color: #939393;
        padding: 0 0 40px 0;
    }

    .scanInfo {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;

        .scanBor {
            width: 1px;
            height: 100%;
            min-height: 80px;
            display: inline-block;
            background: rgba(236, 236, 236, 1);
        }

        .scanListAudit {
            //   position: relative;
            padding: 12px 40px 12px 94px;
            cursor: pointer;
            box-shadow: none;
            margin-top: 0;

            .scanIcon {
                position: absolute;
                left: 18px;
                top: 12px;
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background: white;
                border: 2px solid rgba(62, 77, 168, 1);
                line-height: 46px;
                justify-content: center;
                align-items: center;
                display: flex;

                .iconfont {
                    color: rgba(251, 199, 115, 1);
                    font-size: 30px;
                }
            }

            &:hover {
                background: rgba(251, 251, 251, 1);
            }

            .scanMain {
                text-align: left;
                width: 100%;

                h3 {
                    font-size: 18px;
                    color: rgba(62, 77, 168, 1);
                }

                p {
                    color: rgba(147, 147, 147, 1);
                    font-size: 14px;
                    margin: 0;
                }
            }
        }
    }
}

/*发票信息*/
.scanListAudit {
    ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: #939393;
    }

    ::-moz-placeholder {
        /* Firefox 19+ */
        color: #939393;
    }

    :-ms-input-placeholder {
        /* IE 10+ */
        color: #939393;
    }

    :-moz-placeholder {
        /* Firefox 18- */
        color: #939393;
    }

    .ant-tooltip-placement-top {
        top: 216.8px;
    }

    margin-top: 20px;
    padding: 30px 20px;
    box-shadow: 0px 5px 20px rgba(227, 227, 238, 1);
    border-radius: 8px;
    position: relative;

    .invoiceDelete {
        position: absolute;
        right: 20px;
        top: 10px;
        cursor: pointer;

        .iconfont {
            font-size: 24px;
            color: #cfcfcf;
            line-height: 1;

            &:hover {
                color: #3e4da8;
            }
        }
    }

    .scanListTitle {
        .code {
            margin-left: 10px;
            white-space: nowrap;

            span {
                font-size: 12px;
                color: #939393;
                line-height: 17px;
                position: relative;
                top: -2px;
                margin-right: 10px;
            }

            b {
                font-size: 18px;
                line-height: 33px;
                color: #939393;
            }
        }

        .checkCode {
            margin-left: 10px;
            white-space: nowrap;

            span {
                font-size: 14px;
                color: #3e4da8;
                line-height: 17px;
                margin-right: 10px;
            }

            b {
                font-size: 14px;
                line-height: 33px;
                color: #3e4da8;
            }
        }

        .invoiceLine {
            width: 100%;
            margin-top: 15px;

            div {
                width: 100%;
                height: 1px;
                background: #efefef;
                margin: 4px 0;
            }
        }

        .invoiceType {
            text-align: center;

            h3 {
                color: #3e4da8;
                font-size: 18px;
                font-weight: bold;
                position: relative;
                top: -12px;
                margin-bottom: 0;
            }

            p {
                color: #939393;
                font-size: 14px;
                position: relative;
                top: -10px;
            }
        }
    }
}

/*详情基本信息*/
.invoiceTableManual {
    /*margin-left: 10px;*/
    border: 1px solid #e9e9e9;
    border-right: none;
    border-bottom: none;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fbfbfb;
    line-height: 56px;
    position: relative;

    .errorInvoice {
        position: absolute;
        right: 150px;
        bottom: 12px;
        line-height: 28px;
        padding: 0 10px;
        color: #f00;
        font-size: 24px;
    }

    .deleteInvoice {
        position: absolute;
        right: 20px;
        bottom: 12px;
        border: 1px solid #e9e9e9;
        line-height: 28px;
        padding: 0 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .deleteInvoice:hover {
        border: 1px solid #3e4da8;
        background: #3e4da8;
        color: #fff;
    }

    :global {
        .ant-row {
            margin: 0 !important;
        }

        .ant-col-8 {
            padding: 0 !important;
        }
    }

    .tablecell {
        &>div {
            border-right: 1px solid #e9e9e9;
            border-bottom: 1px solid #e9e9e9;
        }

        .leftcell {
            text-align: right;
            padding: 0 12px;
            font-size: 13px;
            color: #34353e;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            .mustFill {
                color: #e17877;
                margin-right: 5px;
            }
        }

        .rightcell {
            text-align: left;
            padding: 0 12px;
            font-size: 13px;
            line-height: 57px;
            height: 57px;

            span {
                display: inline-block;
            }

            .priceNegative {
                position: absolute;
                left: 4px;
            }

            .ant-form-item-control-wrapper {
                width: 100%;
                margin-top: 12px;
            }

            .ant-upload {
                cursor: pointer;
                width: auto;

                &:hover {
                    color: #3e4da8;
                }
            }

            .imgMsg {
                margin-right: 20px;
                cursor: pointer;

                &:hover {
                    color: #3e4da8;
                }
            }

            .ant-row {
                margin-top: 10px;
            }
        }
    }
}

.invoiceTable {
    margin-left: 10px;
    border: 1px solid #e9e9e9;
    border-right: none;
    border-bottom: none;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fbfbfb;
    line-height: 56px;
    height: auto;

    .tablecell {
        div {
            border: none;
        }

        .leftcell {
            text-align: right;
            padding: 0 12px;
            font-size: 13px;
            color: #34353e;
            border-right: 1px solid #e9e9e9;
            border-bottom: 1px solid #e9e9e9;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .rightcell {
            text-align: left;
            padding: 0 12px;
            height: 57px;
            font-size: 13px;
            line-height: 57px;
            border-right: 1px solid #e9e9e9;
            border-bottom: 1px solid #e9e9e9;
            white-space: nowrap;
            text-overflow: ellipsis;

            .viewImg {
                cursor: pointer;

                &:hover {
                    color: #3e4da8;
                }
            }
        }
    }
}

.emptyScan {
    width: 190px;
    text-align: center;
    margin: 150px auto;

    .iconfont {
        font-size: 105px;
        color: #ececec;
    }

    h5 {
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        color: #939393;
    }

    p {
        font-size: 14px;
        line-height: 20px;
        color: #b1b1b1;
    }
}

.scanInfo {
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

.ant-table {
    td {
        .icon-success {
            font-size: 18px;
        }

        .ant-input-affix-wrapper {
            width: auto;
        }
    }
}

.basicInfo {
    .viewImg {
        cursor: pointer;
        margin-right: 20px;

        .ant-select-selection {
            max-width: 260px;
        }

        &:hover {
            color: #3e4da8;
        }
    }
}

.tableProduct {
    :global {
        .ant-table {
            table {
                border-top-left-radius: 0 !important;
                border-top-right-radius: 0 !important;
            }
        }
    }
}

.auditOper {
    .ant-popover-inner .ant-popover-inner-content {

        /*padding: 12px;*/
        a {
            padding: 0 0 0 32px;
            width: 100%;
            display: inline-block;
            color: #939393;

            .iconfont {
                padding: 0 12px 0 0;
            }

            &:hover {
                background: rgba(246, 246, 248, 1);
                color: rgba(21, 58, 175, 1);

                .iconfont {
                    color: rgba(21, 58, 175, 1);
                }
            }
        }
    }
}

/* 搜索样式 */
.searchWrap {
    .ant-select-selection--multiple {
        .ant-select-selection__rendered {
            ul {
                li {
                    margin-top: 10px;
                }
            }
        }
    }

    .ant-drawer-content-wrapper {
        background: rgba(251, 251, 251, 1);
        box-shadow: -3px 0px 6px rgba(0, 4, 123, 0.2);

        .ant-drawer-content {
            background: rgba(251, 251, 251, 1);

            .ant-drawer-header {
                border: none;
                background: rgba(251, 251, 251, 1);
                font-size: 14px;
            }

            .ant-drawer-close {
                .anticon {
                    color: rgba(148, 148, 148, 1);

                    &:hover {
                        color: rgba(62, 77, 168, 1);
                    }
                }
            }

            .ant-drawer-body {
                padding: 0 24px 24px 24px;
                height: calc(100% - 54px);

                /*overflow-y: auto;*/
                .searchList {
                    padding: 0 0 40px 0;

                    .ant-calendar-picker {
                        width: 100%;
                        max-width: none;
                    }

                    label {
                        color: rgba(147, 147, 147, 1);
                        font-size: 14px;
                        line-height: 20px;
                        margin: 0 0 8px 0;
                        width: 100%;
                        display: block;
                    }

                    .ant-input {
                        border: 1px solid rgba(233, 233, 233, 1);
                        border-radius: 4px;
                        background: white;
                        height: 44px;
                        line-height: inherit;
                    }

                    .ant-input-disabled {
                        cursor: pointer;
                    }

                    .ant-calendar-range-picker-separator {
                        vertical-align: inherit;
                    }

                    .ant-form-item-control-wrapper {
                        width: 100%;
                    }
                }

                .ant-form {
                    height: 100%;
                    padding: 0 0 60px 0;

                    .searchWrap {
                        height: 100%;
                        overflow-y: auto;

                        .ant-form-item {
                            width: 100%;
                            margin-right: 0;
                        }

                        .ant-select-selection {
                            background: #fff !important;
                            border: 1px solid #ececec !important;

                            .ant-select-selection__placeholder {
                                // color: #bfbfbf;
                            }
                        }

                        .ant-select-selection--single {
                            height: 42px;
                            width: 100%;
                        }

                        .ant-select-selection__rendered {
                            line-height: 42px;
                        }

                        .ant-select-dropdown-menu-item-active {
                            background-color: #e6f7ff !important;
                        }

                        .adInput-input {
                            .begin_date {
                                .anticon-calendar {
                                    color: #3e4da8;
                                }
                            }

                            .ant-form-item,
                            .ant-form-item-control-wrapper,
                            .ant-form-item-control {
                                width: 100%;
                            }

                            .ant-input {
                                width: 100%;
                                height: 44px;
                                background: rgba(252, 252, 252, 1);
                                border: 1px solid rgba(236, 236, 236, 1);
                                opacity: 1;
                                border-radius: 4px;
                            }

                            .ant-input-affix-wrapper .ant-input-suffix {
                                .icon-cancle {
                                    color: rgba(205, 223, 252, 1);
                                    font-size: 24px;
                                }
                            }
                        }
                    }

                    position: relative;

                    .table-page-search-submitButtons {
                        text-align: center;
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        left: 0;

                        .ant-btn {
                            width: 130px;
                            height: 44px;
                        }
                    }
                }
            }
        }
    }
}

.invoiceTip {
    padding: 24px 0;
    width: 100%;
    text-align: left;
}
</style>
