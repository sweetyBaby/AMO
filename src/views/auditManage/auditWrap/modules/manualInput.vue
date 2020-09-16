<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="14">
          <h3>手动添加发票</h3>
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
            <span class="titleBtn" @click="manualAdd">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加</span>
                </template>
                <i class="iconfont icon-plus" />
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
    <div>
      <!-- <a-form layout="inline"> -->
      <div class="invoiceTableManual" v-for="(item,key) in inputData">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell">
                <span class="mustFill">*</span>发票类型
              </a-col>
              <a-col :span="18" class="rightcell">
                <a-select :style="{ maxWidth:'255px',width:'100%' }" placeholder="请选择发票类型" @change="invoiceTypeChange(key)" v-model="inputData[key].invoice.inType" :getPopupContainer="triggerNode => triggerNode.parentNode">
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
                <a-input placeholder="请输入发票代码" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.inCode" />
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell">
                <span class="mustFill">*</span>发票号码
              </a-col>
              <a-col :span="18" class="rightcell borderRadiusRight">
                <a-input placeholder="请输入发票号码" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.inNo" />
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell">
                <span class="mustFill">*</span>开票日期
              </a-col>
              <a-col :span="18" class="rightcell">
                <a-date-picker v-model="timeSelect[key]" :style="{ maxWidth:'255px',width:'100%' }" :disabledDate="disabledDate"></a-date-picker>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell">
                <span class="mustFill">*</span>销货方
              </a-col>
              <a-col :span="18" class="rightcell">
                <a-select placeholder="请选择销货方" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.distCode" @change="(value,option)=>{sellerChange(value,option,key)}" :getPopupContainer="triggerNode => triggerNode.parentNode">
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
                <a-input placeholder="请输入配送商" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.distribution" />
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
                  <a-select style="width:75px" placeholder="已授权" v-model="inputData[key].invoice.authorize" @change="handleAuth(key)">
                    <a-select-option value="has">已授权</a-select-option>
                    <a-select-option value="hasNo">未授权</a-select-option>
                  </a-select>
                  <a-select
                    style="width: 180px;"
                    showSearch
                    placeholder="选择客户"
                    optionFilterProp="children"
                    v-model="inputData[key].invoice.cusCode"
                    v-show="inputData[key].invoice.authorize !== 'hasNo'"
                    @change="handleChangeCus(key)">
                    <a-select-option v-for="item in cusList" :key="item.code" :value="item.code" :title="item.name">{{ item.name }}</a-select-option>
                  </a-select>
                  <a-input
                    placeholder="请选择客户名称"
                    @click="handleSelectCus(key)"
                    style="width: 100%;max-width:180px;"
                    v-model="inputData[key].invoice.cusName"
                    v-show="inputData[key].invoice.authorize === 'hasNo'"
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
                <a-input placeholder="请输入不含税金额" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.noneTaxTotal" v-show="inputData[key].invoice.negative">
                  <a-icon slot="prefix" type="minus" style="font-size:10px;" />
                </a-input>
                <a-input placeholder="请输入不含税金额" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.noneTaxTotal" v-show="!inputData[key].invoice.negative" />

                <!-- <span v-show="inputData[key].invoice.negative" class="priceNegative">-</span> -->
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8" v-show="inputData[key].invoice.verifyCodeShow">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell">
                <span class="mustFill">*</span>校验码后六位
              </a-col>
              <a-col :span="18" class="rightcell">
                <a-input placeholder="请输入校验码后六位" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.verifyCode" />
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell">添加图片</a-col>
              <a-col :span="18" class="rightcell">
                <span class="imgMsg" v-show="item.invoice.uploadStatus" @click="viewImg(item)">查看图片</span>
                <a-upload
                  action="/amo/upload/file/add"
                  @change="(value)=>{uploadChange(value,key)}"
                  :showUploadList="false"
                  :headers="headerUpload"
                  :beforeUpload="beforeUpload"
                  :data="uploadData">
                  <span v-show="item.invoice.uploadStatus">重新上传</span>
                  <span v-show="!item.invoice.uploadStatus">上传一张图片</span>
                </a-upload>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" :class="inputData[key].invoice.verifyCodeShow ? 'leftcell borderRadiusLeft' : 'leftcell'">
                <span class="mustFill">*</span>发票状态
              </a-col>
              <a-col :span="18" class="rightcell">
                <a-select :style="{ maxWidth:'255px',width:'100%' }" placeholder="请选择发票状态" @change="statusChange(inputData[key].invoice)" v-model="inputData[key].invoice.inStatus" :getPopupContainer="triggerNode => triggerNode.parentNode">
                  <a-select-option v-for="(item,key) in invoiceStatusList" :key="key" :value="item.code">{{ item.name }}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" :class="inputData[key].invoice.verifyCodeShow ? 'leftcell' : 'leftcell borderRadiusLeft'">备注</a-col>
              <a-col :span="18" class="rightcell">
                <a-input placeholder="备注" :style="{ maxWidth:'255px',width:'100%' }" v-model="inputData[key].invoice.inRemark" :maxLength="100" />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <!--        <div class="invoiceType ant-tag-cyan">-->
        <!--          <span v-show="isInvoice">发票上报</span>-->
        <!--          <span v-show="isVoucher">凭证上报</span>-->
        <!--        </div>-->
        <div class="deleteInvoice" @click="deleteInvoice(key)">删除发票</div>
      </div>
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
  EstateAdd
} from '@/api/auditManage/auditManage'
import {
  getDocumentCusList
} from '@/api/depot/wareHouse'
import moment from 'moment'
import SelectCusName from './SelectCusName'

export default {
  name: 'ManualInput',
  props: ['invoiceType'],
  components: {
    SelectCusName
  },
  data() {
    return {
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
      sellerData: [],
      buyerData: [],
      saveStatus: false,
      selectShow: false,
      selectKey: 0,
      cusList: [],
      isInvoice: true,
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
    const addType = JSON.parse(window.localStorage.getItem('EstateAdd'))
    this.addType = addType.addType
    if (addType.addType !== null) {
      this.uploadData.fileType = 11
    }
  },
  methods: {
    statusChange(data) {
      // 发票状态切换
      if (data.inStatus === '2') {
        data.negative = true
      } else {
        data.negative = false
      }
    },
    disabledDate(current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    invoiceTypeChange(index) {
      // 发票类型切换
      //   const verifyCode = this.inputData[index].invoice.verifyCode;
      if (
        this.inputData[index].invoice.inType === '04' ||
                this.inputData[index].invoice.inType === '10'
      ) {
        // this.inputData[index].invoice.verifyCode = verifyCode;
        this.inputData[index].invoice.verifyCodeShow = true
      } else {
        this.inputData[index].invoice.verifyCode = undefined
        this.inputData[index].invoice.verifyCodeShow = false
      }
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },
    handleAuth(cusKey) {
      if (this.inputData[cusKey].invoice.authorize === 'has') {
        const params = {
          distCode: this.$store.state.user.info.distCode
        }
        this.getCusList(params)
      }
      this.inputData[cusKey].invoice.cusCode = undefined
      this.inputData[cusKey].invoice.cusName = ''
    },
    getCusList(params, checkedcus) {
      getDocumentCusList(params).then(res => {
        if (res.message === 'SUCCESS') {
          console.info('res====', res)
        }
      })
    },
    handleChangeCus(cusKey) {
      const seleCus = this.inputData[cusKey].invoice.cusCode
      // console.info('this.cusList====',this.cusList)
      this.cusList.forEach(item => {
        if (item.code === seleCus) {
          this.inputData[cusKey].invoice.cusName = item.name
        }
      })
    },

    // 发票数据
    selectData(cusKey) {
      return {
        distCode: this.inputData[cusKey].invoice.distCode,
        cusKey: cusKey,
        cusCode: this.inputData[cusKey].invoice.cusCode,
        cusName: this.inputData[cusKey].invoice.cusName
      }
    },
    // 选择购货方弹框
    handleSelectCus(disKey) {
      this.selectKey = disKey
      // console.info('3333')
      if (this.inputData[disKey].invoice.distCode) {
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
      this.inputData[subVal.cusKey].invoice.cusCode = subVal.cusCode
      this.inputData[subVal.cusKey].invoice.cusName = subVal.cusName
      this.selectShow = false
      // if(this.inputData[subVal.cusKey].invoice.needInvoice === '1'){
      //   this.isInvoice = true
      //   this.isVoucher = false
      // } else {
      //   this.isInvoice = false
      //   this.isVoucher = true
      // }
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
    sellerChange(value, option, key) {
      // console.info('value====',value)
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.inputData[key].invoice.cusCode = undefined
      this.inputData[key].invoice.distCode = value
      this.getBuyerData(param, key)
    },
    getBuyerData(param, key) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        // console.info('res====',res)
        this.cusList = res.data
        this.buyerData[key] = res.data
        this.$forceUpdate()
      })
    },
    viewImg(item) {
      // 查看图片
      this.srcImg = item.invoice.srcImg
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
          this.inputData[key].invoice.uploadStatus = true
          this.inputData[key].picId = info.file.response.data.id
          this.inputData[key].invoice.srcImg = info.file.response.data.fileUrl
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
      if (this.inputData.length === 0) {
        this.$notification['error']({
          message: '提示',
          description: '暂无发票，无法保存',
          duration: 4
        })
        return false
      }
      if (this.saveStatus) {
        this.$notification['error']({
          message: '提示',
          description: '正在保存中，请稍后...',
          duration: 4
        })
        return false
      }
      this.saveStatus = true
      if (this.inputData.length > 0) {
        for (let i = 0; i < this.inputData.length; i++) {
          this.inputData[i].invoice.inDate = moment(this.timeSelect[i]).format(
            'YYYY-MM-DD'
          )
          const currentData = this.inputData[i].invoice
          if (
            this.isEmpty(currentData.inType) ||
                        this.isEmpty(currentData.inCode) ||
                        this.isEmpty(currentData.inNo) ||
                        this.isEmpty(this.timeSelect[i]) ||
                        this.isEmpty(currentData.distCode) ||
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
            currentData.noneTaxTotal &&
                        currentData.noneTaxTotal.length > 20
          ) {
            this.$notification['error']({
              message: '提示',
              description: '不含税金额长度不能超过20！',
              duration: 4
            })
            this.saveStatus = false
            return false
          }
        }
        if (this.invoiceType) {
          this.inputData.map(item => {
            item.invoiceType = this.invoiceType.invoiceType
          })
        }
        this.inputData.invoice.hosAuthFlag = this.inputData.invoice.authorize === 'hasNo' ? '2' : '1'
        const userDistCode = getStore('USER_DIST_CODE')
        const userDistName = getStore('USER_DIST_NAME')
        this.inputData.invoice.reportOrgCode = userDistCode
        this.inputData.invoice.reportOrgName = userDistName
        if (this.addType === null) {
          invoiceAdd(this.inputData).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '保存成功！',
                duration: 4
              })
              this.$emit('manualInput', 'index')
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
          // console.info('444444', this.inputData)
          EstateAdd(this.inputData).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '保存成功！',
                duration: 4
              })
              this.$emit('manualInput', 'index')
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
        return false
      }
    },
    handleBack() {
      // 返回
      this.$emit('manualInput', 'index')
    }
  }
}
</script>

<style lang="less" scoped>
.borderRadiusRight {
    border-radius: 0 8px 0 0;
}

.borderRadiusLeft {
    border-radius: 0 0 0 8px;
}

/*模态框按钮*/
.imgModal {
    .anticon-close {
        color: #000 !important;
        border: none !important;
    }
}

/*详情基本信息*/
.invoiceTableManual {
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

    margin-top: 10px;
    border: 1px solid #e9e9e9;
    border-right: none;
    border-bottom: none;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fbfbfb;
    line-height: 56px;
    position: relative;

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

    /*.invoiceType{*/
    /*  position: absolute;*/
    /*  right: 120px;*/
    /*  bottom: 12px;*/
    /*  border: 1px solid #e9e9e9;*/
    /*  line-height: 28px;*/
    /*  padding: 0 10px;*/
    /*  border-radius: 4px;*/
    /*  cursor: pointer;*/
    /*}*/
    .ant-row {
        margin: 0 !important;
    }

    .ant-col-8 {
        padding: 0 !important;
    }

    .tablecell {
        >div {
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
            line-height: 57px;
            height: 57px;
            font-size: 13px;

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

.imgModal {
    .ant-modal-body {
        .ant-input-affix-wrapper {
            margin-bottom: 20px;
            width: 328px;
            height: 32px;

            .ant-input-search-button {
                height: 32px;
                background: #f6f6f6 !important;
                color: #939393;
                border: 1px solid #e9e9e9;
            }
        }
    }
}
</style>
