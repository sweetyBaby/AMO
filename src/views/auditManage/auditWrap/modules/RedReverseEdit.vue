<template>
  <a-form layout="inline" :form="form">
    <div class="invoiceTableManual">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>出入库单凭证号</span>
                </template>
                <span class="mustFill">*</span>出入库单凭证号
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell borderRadiusRight">
              <a-input
                placeholder="出入库单凭证号"
                :style="{ maxWidth:'255px',width:'100%' }"
                v-model="wareNo"
                @change="handleDocNo"
              />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>经销商名称
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select
                placeholder="请选择经销商"
                :style="{ maxWidth:'255px',width:'100%' }"
                v-model="titleData.distCode"
                @change="sellerChange"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="(item,key) in sellerData"
                  :value="item.code"
                  :title="item.name"
                  :key="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>客户名称
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input-group compact :style="{margin:'12px 0'}">
                <a-select
                  style="width:75px"
                  placeholder="已授权"
                  v-model="titleData.authorize"
                  @change="handleAuth"
                >
                  <a-select-option value="has">已授权</a-select-option>
                  <a-select-option value="hasNo">未授权</a-select-option>
                </a-select>
                <a-select
                  style="width: 180px;"
                  showSearch
                  placeholder="选择客户"
                  optionFilterProp="children"
                  v-model="titleData.cusCode"
                  v-show="titleData.authorize !== 'hasNo'"
                  @change="handleChangeCus"
                >
                  <a-select-option
                    v-for="cusItem in cusList"
                    :key="cusItem.code"
                    :value="cusItem.code"
                    :title="cusItem.name"
                  >
                    {{ cusItem.name }}
                  </a-select-option>
                </a-select>
                <a-input
                  placeholder="请选择客户名称"
                  @click="handleSelectCus"
                  style="width: 100%;max-width:180px;"
                  v-model="titleData.cusName"
                  v-show="titleData.authorize === 'hasNo'"
                  readOnly
                />
              </a-input-group>
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
                optionFilterProp="children"
                v-model="titleData.date"

                @change="(value,option)=>{saleMonthChange(value,option,titleData)}"
              >
                <a-select-option
                  v-for="item in monthList"
                  :key="item.code"
                  :value="item.name"
                  :title="item.name"
                  :configType="item.configType"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>单据类型
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select
                placeholder="请选择单据类型"
                :style="{ maxWidth:'255px',width:'100%' }"
                v-model="titleData.docType"
                @change="handleType"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="(item,key) in typeList"
                  :value="item.code"
                  :title="item.name"
                  :key="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>原凭证单据号</span>
                </template>
                <span class="mustFill">*</span>原凭证单据号
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell borderRadiusRight">
              <a-input
                placeholder="请输入原凭证单据号"
                :style="{ maxWidth:'255px',width:'100%' }"
                v-model="wareNoOrigin"
                @change="handleDocNoOrigin"
              />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" :style="{padding: '6px 0 0 0',height: '124px',}">
          <a-row class="tablecell">
            <a-col :span="2" class="leftcell" :style="{height: '116px'}">
              备注
            </a-col>
            <a-col :span="22" class="rightcell" :style="{height: '116px'}">
              <a-textarea
                v-model="titleData.remark"
                placeholder="请输入备注"
                :style="{ maxWidth:'255px',width:'100%' }"
                :maxLength="100"
                :autosize="{ minRows: 2, maxRows: 6 }"
              ></a-textarea>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <div class="deleteInvoice" @click="estateAdd">保存附件</div>
      <!--       选择购货方-->
      <select-cus-name
        v-if="selectShow"
        :visible="selectShow"
        :cusData="selectData"
        @selectCus="handleSelectOk"
        @selectCancle="handleSelectCancle"
      ></select-cus-name>
    </div>
  </a-form>

</template>

<script>
import {
  invoiceBuyer,
  invoiceSeller,
  getEstateDocNo,
  getSaleMonth
} from '@/api/auditManage/auditManage'
import {
  outVoucherVadd,
  addOutPro,
  outVoucherUpdate,
  deleteOutPro
} from '@/api/auditManage/outVoucher'
import moment from 'moment'
import SelectCusName from '@/views/auditManage/auditWrap/modules/SelectCusName'
import { getStore } from '@/utils/storage'
export default {
  name: 'RedReverseEdit',
  components: {
    SelectCusName
  },
  props: ['titleDetail'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    const newData = JSON.parse(JSON.stringify(this.titleDetail))
    this.titleData = newData
    this.timeSelect = newData.inDate
      ? moment(moment(newData.inDate).format('YYYY-MM-DD'), 'YYYY-MM-DD')
      : null
    this.verifyCode = newData.verifyCode
    // console.info('newData---Detail===', newData)
    if (newData.type === 'add') {
      this.getDocNo()
    }

    // 获取销货方
    this.getInvoiceSeller()
    this.getBuyerData(
      {
        code: this.$store.state.user.info.distCode,
        type: 1
      }
    )
    this.getMonth()
  },
  data () {
    return {
      isAuditAdd: true,
      isWareDoc: false,
      isPusure: false,
      isNoSupport: false,
      titleData: {
        distCode: this.$store.state.user.info.distCode
      },
      cusList: [],
      monthList: [],
      buyerData: [],
      typeList: [
        { code: '02', name: '退货入库' },
        { code: '11', name: '销售出库' }
      ],
      sellerData: [],
      uploadData: {
        fileType: 3,
        uploadType: 1,
        correlationId: ''
      },
      previewVisibleTitle: false,
      headerUpload: {
        Authorization: 'Bearer ' + this.$store.state.user.token
      },
      selectShow: false,
      imgVisible: false,
      srcImg: '',
      dateFormat: 'YYYY-MM-DD',
      timeSelect: null,
      tableNegative: false,
      isAllEmpty: false,
      verifyCode: '',
      wareNo: '',
      wareNoOrigin: '',
      isSubmit: true,
      previewVisible: false,
      fileList: [],
      previewImage: ''
    }
  },
  methods: {
    moment,
    getMonth () {
      const _that = this
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
    uploadPreview (file) {
      this.previewImage = file.response.data.fileUrl
      this.previewVisible = true
    },
    uploadCancel () {
      // 取消
      this.previewVisible = false
    },
    handleDocNo (e) {
      // console.info('val===', e.target.value)
      this.titleData.docNo = e.target.value
    },
    handleDocNoOrigin (e) {
      this.titleData.wareNoOrigin = e.target.value // 原单据号
    },
    getDocNo () {
      getEstateDocNo().then(res => {
        if (res.message === 'SUCCESS') {
          this.wareNo = res.data.docNo
          this.titleData.docNo = res.data.docNo
        } else {
          this.$notification['error']({
            message: '获取单号失败！',
            description: res.message,
            duration: 4
          })
        }
      })
    },
    disabledDate (current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    getInvoiceSeller () {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },

    sellerChange (value) {
      console.info('====', value)
      this.sellerData.forEach(item => {
        if (item.code === value) {
          this.titleData.distName = item.name
        }
      })
      // 选择销货方
      const param = {
        code: value,
        type: 1
      }
      this.titleData.cusCode = undefined
      this.getBuyerData(param)
    },
    // 选择购货方弹框
    handleSelectCus () {
      this.selectShow = true
      this.selectData = {
        distCode: this.titleData.distCode,
        cusCode: this.titleData.cusCode,
        cusName: this.titleData.cusName
      }
    },
    saleMonthChange(value, option, item) {
      item.invoiceType = option.data.attrs.configType
      item.voucherStatus = option.data.attrs.configType
      this.handleChangeCus()
    },
    handleChangeCus () {
      const seleCus = this.titleData.cusCode
      this.cusList.forEach(item => {
        if (item.code === seleCus) {
          this.titleData.cusName = item.name
        }
      })
      this.$forceUpdate()
    },
    getBuyerData (param, key) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.cusList = res.data
        this.buyerData = res.data
        this.$forceUpdate()
      })
    },
    // 已授权未授权
    handleAuth () {
      this.titleData.cusCode = undefined
      this.titleData.cusName = ''
    },
    uploadChangeTitle ({ file, fileList }) {
      // title上传
      if (file.status === 'done' || file.status === 'removed') {
        if (file.response.code === 500) {
          this.$notification['error']({
            message: file.status === 'done' ? '上传失败，发票将添加不成功，请重新上传正确的发票！' : '删除失败！',
            description: file.response.message,
            duration: 2
          })
        } else if (file.response.code === 200) {
          // console.info('file.response====', fileList)
          this.$notification['success']({
            message: '提示',
            description: file.status === 'done' ? '上传成功' : '删除成功',
            duration: 2
          })
          this.fileList = fileList
          this.titleData.fileList = fileList
          const arr = []
          if (fileList !== 0) {
            fileList.map(item => {
              arr.push(item.response.data.id)
            })
            this.fileId = arr.toString()
          } else {
            this.fileId = ''
          }
          this.$forceUpdate()
        }
      }
    },
    titleImgClose () {
      // 关闭title图片
      this.previewVisibleTitle = false
    },
    viewImgShow () {
      // 查看图片
      this.srcImg = this.titleData.fileUrl
      this.imgVisible = true
    },
    imgCancel () {
      // 取消查看图片
      this.imgVisible = false
    },
    beforeUpload (file, fileList) {
      // 发票上传前回调
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
    estateAdd () {
      if (this.isSubmit) {
        this.titleData.docDate = this.timeSelect
        const currentData = JSON.parse(JSON.stringify(this.titleData))
        const redReverseDetail = getStore('redReverseDetail')
        currentData.type = redReverseDetail.redReverseData.type // 接口区分红冲还是出入库
        const userDistCode = getStore('USER_DIST_CODE')
        const userDistName = getStore('USER_DIST_NAME')
        currentData.reportOrgCode = userDistCode
        currentData.reportOrgName = userDistName
        if (
          this.isDataEmpty(currentData.docNo) ||
            this.isDataEmpty(currentData.date) ||
            this.isDataEmpty(currentData.distCode) ||
            this.isDataEmpty(currentData.cusCode) ||
            this.isDataEmpty(currentData.docType)
        ) {
          this.$notification['error']({
            message: '提示',
            description: '必填信息不能为空！',
            duration: 4
          })
        } else if (!currentData.isUpdate) {
          currentData.fileId = this.fileId
          outVoucherVadd(currentData).then(res => {
            if (res.code === 200) {
              currentData.id = res.data
              this.$emit('addEstate', currentData)
            } else {
              this.$notification['error']({
                message: '保存失败',
                description: res.message,
                duration: 4
              })
            }
          })
        } else {
          const param = {
            invoice: currentData,
            picId: currentData.id
          }
          outVoucherUpdate(param).then(res => {
            if (res.code === 200) {
              this.$emit('addEstate', currentData)
            } else {
              this.$notification['error']({
                message: '修改失败',
                description: res.message,
                duration: 4
              })
            }
          })
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '后台数据处理中，请稍后再试！',
          duration: 4
        })
      }
    },
    isDataEmpty (str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    // 发票数据
    selectData () {
      return {
        distCode: this.titleData.distCode,
        cusCode: this.titleData.cusCode
      }
    },
    handleSelectOk (subVal) {
      // console.info('subVal====', subVal)
      this.titleData.cusCode = subVal.cusCode
      this.titleData.cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    handleDateChange (date, string) {
      // console.info('date===', date, string)
      this.titleData.timeSelect = moment(string, 'YYYY-MM-DD')
    },
    handleType (code) {
      console.info('code', code)
    },
    handleMoment (val) {
      if (val) {
        return moment(val, 'YYYY-MM-DD HH:mm')
      }
      return null
    },
    handleTaxChange (e) {
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
    },
    handleCode (val) {
      // console.info('val===', val)
      this.titleData.verifyCode = val
    }
  }
}
</script>

<style scoped lang="less">
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

    .ant-row {
      margin: 0 !important;
    }

    .ant-col-8 {
      padding: 0 !important;
    }
    .tableEmpty{
      display: block;
      height: 57px;
      width: 100%;
      border-right: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
    }
    .tablecell {
      > div {
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
      }

      .leftcell {
        text-align: right;
        padding: 0 15px;
        font-size: 14px;
        color: #34353e;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-height: 57px;
        .mustFill {
          color: #e17877;
          margin-right: 5px;
        }
      }

      .rightcell {
        text-align: left;
        padding: 0 20px;
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
          > div {
            height: 100%;
          }
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

  .ant-upload-list-picture .ant-upload-list-item, .ant-upload-list-picture-card .ant-upload-list-item{
    border: none;
  }

</style>
