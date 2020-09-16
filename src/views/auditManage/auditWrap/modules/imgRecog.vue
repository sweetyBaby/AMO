<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="14">
          <h3>图片识别添加发票</h3>
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
    <div>
      <a-form layout="inline">
        <div class="invoiceTableManual" v-for="(item,key) in imgList">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>发票类型
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-select :style="{ maxWidth:'255px',width:'100%' }" placeholder="请选择发票类型" v-model="item.ocrInType" @change="invoiceTypeChange(key)">
                    <a-select-option v-for="(item,key) in invoiceList" :key="key" :value="item.code">{{ item.name }}</a-select-option>
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
                  <a-input placeholder="请输入发票代码" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.ocrInCode" />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>发票号码
                </a-col>
                <a-col :span="18" class="rightcell borderRadiusRight">
                  <a-input placeholder="请输入发票号码" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.ocrInNo" />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>开票日期
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-date-picker v-model="timeSelect[key]" :disabledDate="disabledDate" :style="{ maxWidth:'255px',width:'100%' }"></a-date-picker>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>销货方
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-select placeholder="请选择销货方" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.distCode" @change="(value,option)=>{sellerChange(value,option,key,item)}" :getPopupContainer="triggerNode => triggerNode.parentNode">
                    <a-select-option v-for="(item,index) in sellerData" :key="index" :value="item.code" :type="item.type" :title="item.name">{{ item.name }}</a-select-option>
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
                  <a-input placeholder="请输入配送商" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.distribution" />
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
                    <a-select style="width:75px" placeholder="已授权" v-model="item.authorize" @change="handleAuth(key)">
                      <a-select-option value="has">已授权</a-select-option>
                      <a-select-option value="hasNo">未授权</a-select-option>
                    </a-select>
                    <a-select
                      style="width: 180px;"
                      showSearch
                      placeholder="选择客户"
                      optionFilterProp="children"
                      @change="handleChangeCus(key)"
                      v-model="item.cusCode"
                      v-show="item.authorize !== 'hasNo'">
                      <a-select-option v-for="cusItem in cusList" :key="cusItem.code" :value="cusItem.code" :title="cusItem.name">{{ cusItem.name }}</a-select-option>
                    </a-select>
                    <a-input
                      placeholder="请选择客户名称"
                      @click="handleSelectCus(key)"
                      style="width: 100%;max-width:180px;"
                      v-model="item.cusName"
                      v-show="item.authorize === 'hasNo'"
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
                  <a-input placeholder="请输入不含税金额" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.ocrNonetaxtotal">
                    <a-icon slot="prefix" type="minus" v-if="item.negative" style="font-size:10px;" />
                  </a-input>
                  <!-- <span v-show="item.negative" class="priceNegative">-</span> -->
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8" v-show="item.verifyCodeShow">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>校验码后六位
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-input placeholder="请输入校验码后六位" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.ocrVerifyCode" />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>销量月份
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-select style="width: 100%; max-width: 255px" placeholder="选择销量月份" optionFilterProp="children" v-model="item.date" @change="(value,option)=>{saleMonthChange(value,option,key,item)}">
                    <a-select-option v-for="month in monthList" :key="month.code" :value="month.name" :title="month.name" :configType="month.configType">{{ month.name }}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">添加图片</a-col>
                <a-col :span="18" class="rightcell">
                  <span class="imgMsg" @click="viewImg(item)">查看图片</span>
                  <a-modal :visible="imgVisible" :footer="null" @cancel="imgCancel" width="660px" class="imgModal">
                    <img alt="example" style="width: 100%" :src="inUrl" />
                  </a-modal>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" :class="item.verifyCodeShow ? 'leftcell borderRadiusLeft' : 'leftcell'">
                  <span class="mustFill">*</span>发票状态
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-select :style="{ maxWidth:'255px',width:'100%' }" placeholder="请选择发票状态" v-model="item.inStatus" @change="invoiceStatus(item)">
                    <a-select-option v-for="(item,key) in invoiceStatusList" :key="key" :value="item.code">{{ item.name }}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" :class="item.verifyCodeShow ? 'leftcell' : 'leftcell borderRadiusLeft'">备注</a-col>
                <a-col :span="18" class="rightcell">
                  <a-input placeholder="备注" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.inRemark" />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <!--          <div class="deleteInvoice" @click="deleteInvoice(key)">删除发票</div>-->
          <div class="errorInvoice" v-show="item.result === 'error'">异常</div>
        </div>
        <select-cus-name v-if="selectShow" :visible="selectShow" :cusData="selectData(selectKey)" @selectCus="handleSelectOk" @selectCancle="handleSelectCancle"></select-cus-name>
      </a-form>
    </div>
  </div>
</template>

<script>
import {
  invoiceAdd,
  invoiceSeller,
  invoiceBuyer,
  EstateAdd,
  getSaleMonth
} from '@/api/auditManage/auditManage'
import moment from 'moment'
import {
  ContactsOutline
} from '@ant-design/icons/lib/dist'
import SelectCusName from './SelectCusName'
import {
  setStore,
  getStore
} from '@/utils/storage'

export default {
  name: 'ImgRecog',
  props: ['imgUploadList', 'invoiceType'],
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
        code: 1,
        name: '蓝票'
      }, {
        code: 2,
        name: '红票'
      }],
      imgVisible: false,
      imgList: [],
      keepList: [],
      sellerData: [],
      buyerData: {},
      inUrl: '',
      saveStatus: false,
      selectShow: false,
      selectKey: 0,
      cusList: [],
      addType: null,
      monthList: []
    }
  },
  created() {
    //   console.log( this.imgUploadList);
    for (let i = 0; i < this.imgUploadList.length; i++) {
      if (this.imgUploadList[i].result !== 'error') {
        const str = this.imgUploadList[i].ocrVerifyCode
        this.imgUploadList[i].ocrVerifyCode = str.substr(str.length - 6)
        this.imgUploadList[i].ocrInDate = moment(
          this.imgUploadList[i].ocrInDate
        ).format('YYYY-MM-DD')
        this.keepList.push(JSON.parse(JSON.stringify(this.imgUploadList[i])))
      }
    }
    // console.log('==========',this.imgUploadList);
    this.getSalesMonth()
    this.getImgList()
    this.getInvoiceSeller()
    const addType = getStore('EstateInfo')
    this.addType = addType.addType
  },
  methods: {
    invoiceStatus(item) {
      // 状态切换
      if (item.inStatus === 2) {
        item.negative = true
      } else {
        item.negative = false
      }
      this.$forceUpdate()
    },
    saleMonthChange(value, option, key, item) {
      item.invoiceType = option.data.attrs.configType
      this.$forceUpdate()
    },
    getSalesMonth() {
      const _that = this
      getSaleMonth().then(res => {
        // console.info('res----', res)
        res.data.map(item => {
          _that.monthList.push({
            code: item.id,
            name: item.year + '-' + item.month,
            configType: item.configType
          })
        })
      })
    },
    filterOptionImg(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleChangeBuyer(value, item, key) {
      // 选择购货方
      item.cusCode = value
      this.$forceUpdate()
    },
    disabledDate(current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    invoiceTypeChange(index) {
      // 发票类型切换

      if (
        this.imgList[index].ocrInType === '04' ||
                this.imgList[index].ocrInType === '10'
      ) {
        this.imgList[index].verifyCodeShow = true
      } else {
        // console.log("======", this.buyerData.ocrVerifyCode);
        // console.log("------------", this.imgList[index].ocrVerifyCode);
        this.imgList[index].ocrVerifyCode = undefined
        this.imgList[index].verifyCodeShow = false
      }
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },
    sellerChange(value, option, key, item) {
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      item.cusCode = undefined
      this.getBuyerData(param, key)
    },
    // 发票数据
    selectData(cusKey) {
      return {
        distCode: this.imgList[cusKey].distCode,
        cusKey: cusKey,
        cusCode: this.imgList[cusKey].cusCode,
        cusName: this.imgList[cusKey].cusName
      }
    },
    handleAuth(cusKey) {
      this.imgList[cusKey].cusCode = undefined
      this.imgList[cusKey].cusName = ''
    },
    handleChangeCus(cusKey) {
      const seleCus = this.imgList[cusKey].cusCode
      this.cusList.forEach(item => {
        if (item.code === seleCus) {
          this.imgList[cusKey].cusName = item.name
        }
      })
      this.$forceUpdate()
    },
    // 选择购货方弹框
    handleSelectCus(diskey) {
      // console.info('diskey',diskey)
      this.selectKey = diskey
      if (this.imgList[diskey].distCode) {
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
      // console.info('subVal====',subVal)
      // console.info(this.imgList)
      this.imgList[subVal.cusKey].cusCode = subVal.cusCode
      this.imgList[subVal.cusKey].cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle() {
      this.selectShow = false
    },
    getBuyerData(param, key) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.cusList = res.data
        this.buyerData[key] = res.data
        this.$forceUpdate()
      })
    },
    getImgList() {
      console.log(' this.imgList=', this.imgList)
      // 获取图片列表
      this.imgList = this.imgUploadList
      for (let i = 0; i < this.imgList.length; i++) {
        const str = this.imgList[i].ocrVerifyCode
        if (this.imgList[i].result !== 'error') {
          this.timeSelect[i] = moment(this.imgList[i].ocrInDate)
          this.imgList[i].ocrVerifyCode = str.substr(str.length - 6)
          this.imgList[i].inStatus = 1
        } else {
          this.imgList[i].inStatus = undefined
          this.imgList[i].ocrInType = undefined
        }
        if (this.imgList[i].ocrInType === '01') {
          this.imgList[i].verifyCodeShow = false
        } else {
          this.imgList[i].verifyCodeShow = true
        }
        this.imgList[i].status = 1
        this.imgList[i].reportType = 2
        this.imgList[i].imgVisible = false
        this.imgList[i].distCode = undefined
        this.imgList[i].cusCode = undefined
      }
    },
    viewImg(item) {
      // 查看图片
      this.inUrl = item.inUrl
      this.imgVisible = true
    },
    imgCancel() {
      // 取消查看图片
      this.imgVisible = false
    },
    deleteInvoice(key) {
      // 删除
      this.imgList.splice(key, 1)
      this.timeSelect.splice(key, 1)
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
      if (this.imgList.length === 0) {
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
      const param = []
      if (this.imgList.length > 0) {
        for (let i = 0; i < this.imgList.length; i++) {
          // 判断异常发票
          if (this.imgList[i].result === 'error') {
            this.$notification['error']({
              message: '提示',
              description: '异常发票不能保存！',
              duration: 4
            })
            this.saveStatus = false
            return false
          }
          this.imgList[i].ocrInDate = moment(this.timeSelect[i]).format(
            'YYYY-MM-DD'
          )
          const currentData = this.imgList[i]
          if (
            this.isEmpty(currentData.ocrInType) ||
                        this.isEmpty(currentData.ocrInCode) ||
                        this.isEmpty(currentData.ocrInNo) ||
                        this.isEmpty(currentData.distCode) ||
                        this.isEmpty(currentData.date) ||
                        this.addType === null && this.isEmpty(currentData.cusCode) ||
                        this.isEmpty(this.timeSelect[i]) ||
                        this.isEmpty(currentData.ocrNonetaxtotal) ||
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
          if (currentData.ocrInType === '04' || currentData.ocrInType === '10') {
            if (this.isEmpty(currentData.ocrVerifyCode)) {
              this.$notification['error']({
                message: '提示',
                description: '必填信息不能为空！',
                duration: 4
              })
              this.saveStatus = false
              return false
            }
          }
          if (currentData.ocrInCode.length > 20) {
            this.$notification['error']({
              message: '提示',
              description: '发票代码长度不能超过20！',
              duration: 4
            })
            this.saveStatus = false
            return false
          }
          if (!this.isEmpty(currentData.inRemark)) {
            if (currentData.inRemark.length > 200) {
              this.$notification['error']({
                message: '提示',
                description: '备注长度不能超过200！',
                duration: 4
              })
              this.saveStatus = false
              return false
            }
          }
          const re = /^(\d+)(.\d{0,2})?$/
          if (
            isNaN(currentData.ocrNonetaxtotal) ||
                        currentData.ocrNonetaxtotal < 0
          ) {
            this.$notification['error']({
              message: '提示',
              description: '不含税金额格式不正确！',
              duration: 4
            })
            this.saveStatus = false
            return false
          } else if (currentData.ocrNonetaxtotal.length > 20) {
            this.$notification['error']({
              message: '提示',
              description: '不含税金额长度不能超过20！',
              duration: 4
            })
            this.saveStatus = false
            return false
          } else if (!re.test(currentData.ocrNonetaxtotal)) {
            this.$notification['error']({
              message: '提示',
              description: '不含税金额最多保留小数点后两位！',
              duration: 4
            })
            this.saveStatus = false
            return false
          }
          if (
            this.keepList[i].ocrInCode !== currentData.ocrInCode ||
                        this.keepList[i].ocrInNo !== currentData.ocrInNo ||
                        this.keepList[i].ocrInType !== currentData.ocrInType ||
                        this.keepList[i].ocrInDate !== currentData.ocrInDate ||
                        this.keepList[i].ocrNonetaxtotal !== currentData.ocrNonetaxtotal ||
                        this.keepList[i].ocrVerifyCode !== currentData.ocrVerifyCode
          ) {
            this.imgList[i].reportType = 3
            //  currentData.reportType=3;
          }
          const ImgData = {
            invoice: {
              inCode: currentData.ocrInCode,
              inNo: currentData.ocrInNo,
              inType: currentData.ocrInType,
              inDate: currentData.ocrInDate,
              noneTaxTotal: currentData.ocrNonetaxtotal,
              verifyCode: currentData.ocrVerifyCode,
              inRemark: currentData.inRemark,
              inStatus: currentData.inStatus,
              date: currentData.date,
              status: 1,
              distCode: currentData.distCode,
              distName: currentData.distName,
              reportType: currentData.reportType,
              invoiceType: currentData.invoiceType ? currentData.invoiceType : '1',
            },
            picId: currentData.id
          }
          if (this.addType === null) {
            ImgData.invoice.cusCode = currentData.cusCode
            ImgData.invoice.cusName = currentData.cusName
          } else {
            ImgData.invoice.distribution = currentData.distribution
          }
          param.push(ImgData)
        }

        const ImgObj = param[0]
        ImgObj.invoice.hosAuthFlag = ImgObj.invoice.authorize === 'hasNo' ? '2' : '1'
        const userDistCode = getStore('USER_DIST_CODE')
        const userDistName = getStore('USER_DIST_NAME')
        ImgObj.invoice.reportOrgCode = userDistCode
        ImgObj.invoice.reportOrgName = userDistName
        if (this.addType === null) {
          invoiceAdd(ImgObj).then(res => {
            this.handleResult(res)
          })
        } else {
          EstateAdd(ImgObj).then(res => {
            this.handleResult(res)
          })
        }
        // console.info('param=====',param)
        this.$emit('imgRecogClear')
      } else {
        return false
      }
    },
    handleResult(res) {
      const _that = this
      if (res.code === 200) {
        this.$notification['success']({
          message: '提示',
          description: '保存成功！',
          duration: 4
        })
        const ImgObj = res.data.invoice
        setStore('AUDITEDIT', {})
        const Details = getStore('EstateInfo')
        if (Details.addType === null) {
          const detailsData = {}
          detailsData.id = ImgObj.id
          detailsData.status = ImgObj.status
          detailsData.verifyStatus = ImgObj.verifyStatus
          detailsData.verifyErrCode = ImgObj.verifyErrCode
          detailsData.verifyErrMsg = ImgObj.verifyErrMsg
          setStore('EstateId', JSON.stringify(detailsData))
          _that.$router.push({
            name: 'AuditManage_Detail'
          })
        } else {
          const paramId = {
            InvoiceId: ImgObj.id,
            distribution: ImgObj.distribution,
            verifyStatus: ImgObj.verifyStatus,
            verifyErrCode: ImgObj.verifyErrCode,
            verifyErrMsg: ImgObj.verifyErrMsg,
            inStatus: ImgObj.inStatus,
            distCode: ImgObj.distCode
          }
          setStore('EstateId', paramId)
          _that.$router.push({
            name: 'PerfessionWrap_Detail'
          })
        }
      } else {
        this.$notification['error']({
          message: '保存失败',
          description: res.message,
          duration: 4
        })
        _that.saveStatus = false
      }
    },

    handleBack() {
      // 返回
      this.$emit('imgRecog', 'index')
      this.$emit('imgRecogClear')
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

    /*margin-left: 10px;*/
    border: 1px solid #e9e9e9;
    border-right: none;
    border-bottom: none;
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

/*.ant-modal-body {*/
/*  .ant-input-affix-wrapper {*/
/*    margin-bottom: 20px;*/
/*    width: 328px;*/
/*    height: 32px;*/
/*    .ant-input-search-button {*/
/*      height: 32px;*/
/*      background: #f6f6f6 !important;*/
/*      color: #939393;*/
/*      border: 1px solid #e9e9e9;*/
/*    }*/
/*  }*/
/*}*/
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

.rightcell {
    :global {
        .ant-select-selection__rendered {
            margin: 0 6px !important;
        }

        .ant-input {
            padding: 4px 6px;
        }

        .ant-select-selection-selected-value {
            padding-right: 10px;
            font-size: 13px;
        }
    }
}
</style>
