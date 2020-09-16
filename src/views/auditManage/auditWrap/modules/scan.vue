<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="14">
          <h3>扫码添加发票</h3>
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
          <div class="scanInfo">
            <a-input
              placeholder="请开始扫码"
              id="myInputAudit"
              :style="{ width:'240px',float:'right' }"
              v-model="scanVal"
              @click="handleScan"
              autocomplete="off"
              ref="scanInput"
              v-if="ScanList.length === 0">
              <i slot="prefix" class="iconfont icon-scan"></i>
            </a-input>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-if="isEmpty">
      <div class="emptyScan">
        <i class="iconfont iconlianhe1" />
        <h5>开始扫码</h5>
        <p>用扫码枪扫描发票上的二维码</p>
      </div>
    </div>
    <div v-else>
      <div class="scanListAudit" v-for="(item,key) in ScanList">
        <!--<div class="invoiceDelete" @click="deleteScanData(key)">
          <i class="iconfont icon-tableEmpty" />
        </div>-->
        <div class="scanListTitle">
          <div class="deleteInvoice" @click="deleteScanData(key)">删除发票</div>
          <a-row>
            <a-col :span="5">
              <div class="code">
                <span>发票代码</span>
                <b>{{ item.invoice.inCode }}</b>
              </div>
            </a-col>
            <a-col :span="4">
              <div class="invoiceLine">
                <div></div>
                <div></div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="invoiceType">
                <h3>{{ item.invoice.invoiceTypeName }}</h3>
                <p>开票日期：{{ moment(item.invoice.inDate).format('YYYY年MM月DD日') }}</p>
              </div>
            </a-col>
            <a-col :span="4">
              <div class="invoiceLine">
                <div></div>
                <div></div>
              </div>
            </a-col>
            <a-col :span="5">
              <div class="code">
                <span>发票号码</span>
                <b>{{ item.invoice.inNo }}</b>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="invoiceTable">
          <a-row>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>销货方
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-select placeholder="请选择销货方" style="width: 100%;max-width:240px;" v-model="item.invoice.distCode" @change="(value,option)=>{sellerChange(value,option,key)}" :getPopupContainer="triggerNode => triggerNode.parentNode">
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
                  <a-input placeholder="请输入配送商" :style="{ maxWidth:'255px',width:'100%' }" v-model="item.invoice.distribution" />
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
                    <a-select style="width:75px" placeholder="已授权" v-model="item.invoice.authorize" @change="handleAuth(key)">
                      <a-select-option value="has">已授权</a-select-option>
                      <a-select-option value="hasNo">未授权</a-select-option>
                    </a-select>
                    <a-select
                      style="width: 100%;max-width:175px;"
                      showSearch
                      placeholder="请选择购货方"
                      optionFilterProp="children"
                      @change="handleChangeCus(key)"
                      v-model="item.invoice.cusCode"
                      v-show="item.invoice.authorize !== 'hasNo'">
                      <a-select-option v-for="cusItem in cusList" :key="cusItem.code" :value="cusItem.code" :title="cusItem.name">{{ cusItem.name }}</a-select-option>
                    </a-select>
                    <a-input
                      placeholder="请选择购货方"
                      @click="handleSelectCus(key)"
                      style="width: 100%;max-width:175px;"
                      v-model="item.invoice.cusName"
                      v-show="item.invoice.authorize === 'hasNo'"
                      readonly />
                  </a-input-group>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">不含税金额</a-col>
                <a-col :span="18" class="rightcell">
                  <span v-show="item.invoice.negative">-</span>
                  {{ item.invoice.noneTaxTotal }}
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8" v-show="item.invoice.verifyCodeShow">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="校验码后六位">校验码后六位</a-col>
                <a-col :span="18" class="rightcell">{{ item.invoice.verifyCode }}</a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">
                  <span class="mustFill">*</span>销量月份
                </a-col>
                <a-col :span="18" class="rightcell">
                  <a-select style="width: 100%; max-width: 255px" placeholder="选择销量月份" optionFilterProp="children" v-model="item.invoice.date" @change="(value,option)=>{saleMonthChange(value,option,key,item.invoice)}">
                    <a-select-option v-for="subItem in monthList" :key="subItem.code" :value="subItem.name" :title="subItem.name" :configType="subItem.configType">{{ subItem.name }}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-col>
            <a-col span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="添加图片">添加图片</a-col>
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
                <a-col :span="6" class="leftcell">发票状态</a-col>
                <a-col :span="18" class="rightcell">
                  <a-select style="max-width: 260px; width: 100%;" placeholder="请选择发票状态" v-model="item.invoice.inStatus" @change="invoiceStatus(item.invoice)" :getPopupContainer="triggerNode => triggerNode.parentNode">
                    <a-select-option v-for="(item,key) in invoiceStatusList" :key="key" :value="item.code">{{ item.name }}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell">备注</a-col>
                <a-col :span="18" class="rightcell">
                  <a-input placeholder="备注" :style="{ maxWidth:'240px',width:'100%' }" v-model="item.invoice.inRemark" />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-modal :visible="imgVisible" :footer="null" @cancel="imgCancel" width="660px" class="imgModal">
        <img alt="example" style="width: 100%" :src="srcImg" />
      </a-modal>
      <select-cus-name v-if="selectShow" :visible="selectShow" :cusData="selectData(selectKey)" @selectCus="handleSelectOk" @selectCancle="handleSelectCancle"></select-cus-name>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  invoiceAdd,
  invoiceSeller,
  invoiceBuyer,
  EstateAdd,
  getSaleMonth
} from '@/api/auditManage/auditManage'

import SelectCusName from './SelectCusName'
import {
  setStore,
  getStore
} from '@/utils/storage'
export default {
  name: 'Scan',
  props: ['invoiceType'],
  components: {
    SelectCusName
  },
  data() {
    return {
      scanVal: '',
      isEmpty: true,
      ScanList: [],
      keepScanList: [],
      sellerData: [],
      buyerData: [],
      srcImg: '',
      invoiceStatusList: [{
        code: 1,
        name: '蓝票'
      }, {
        code: 2,
        name: '红票'
      }],
      uploadData: {
        fileType: 1,
        uploadType: 1
      },
      imgVisible: false,
      saveStatus: false,
      selectShow: false,
      selectKey: 0,
      cusList: [],
      picId: '',
      monthList: [],
      addType: null,
      timeSelect: null,
      authorize: 'has'
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
    this.$nextTick(x => {
      this.$refs.scanInput.focus()
    })
    this.handleScan()
    const addType = getStore('EstateInfo')
    this.addType = addType.addType
    if (addType.addType !== null) {
      this.uploadData.fileType = 11
    }
    this.getMonth()
  },
  methods: {
    moment,
    getMonth() {
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
    saleMonthChange(value, option, key, item) {
      item.invoiceType = option.data.attrs.configType
      this.$forceUpdate()
    },
    invoiceStatus(item) {
      // 切换发票状态
      if (item.inStatus === 2 && item.noneTaxTotal !== 0) {
        item.negative = true
      } else {
        item.negative = false
      }
      this.$forceUpdate()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
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
          this.ScanList[key].invoice.uploadStatus = true
          this.ScanList[key].picId = info.file.response.data.id
          this.picId = info.file.response.data.id
          this.srcImg = info.file.response.data.fileUrl
          this.ScanList[key].invoice.srcImg = info.file.response.data.fileUrl
          this.ScanList[key].invoice.authorize = 'has'
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
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },
    sellerChange(value, option, key) {
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.ScanList[key].invoice.cusCode = undefined
      this.ScanList[key].invoice.distCode = value
      this.getBuyerData(param, key)
    },
    handleAuth(cusKey) {
      this.ScanList[cusKey].invoice.cusCode = undefined
      this.ScanList[cusKey].invoice.cusName = ''
      this.$forceUpdate()
    },
    handleChangeCus(cusKey) {
      const seleCus = this.ScanList[cusKey].invoice.cusCode
      this.cusList.forEach(item => {
        if (item.code === seleCus) {
          this.ScanList[cusKey].invoice.cusName = item.name
        }
      })
      this.$forceUpdate()
    },
    // 发票数据
    selectData(cusKey) {
      return {
        distCode: this.ScanList[cusKey].invoice.distCode,
        cusKey: cusKey,
        cusCode: this.ScanList[cusKey].invoice.cusCode,
        cusName: this.ScanList[cusKey].invoice.cusName
      }
    },
    // 选择购货方弹框
    handleSelectCus(diskey) {
      this.selectKey = diskey
      // console.info('diskey',diskey)
      if (this.ScanList[diskey].invoice.distCode) {
        this.selectShow = true
        this.handleRemoveScan()
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
      // console.info(this.ScanList)
      this.ScanList[subVal.cusKey].invoice.cusCode = subVal.cusCode
      this.ScanList[subVal.cusKey].invoice.cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle() {
      this.selectShow = false
      this.handleScan()
    },
    getBuyerData(param, key) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.cusList = res.data
        this.buyerData[key] = res.data
        this.$forceUpdate()
      })
    },
    deleteScanData(key) {
      // 删除
      this.ScanList.splice(key, 1)
      this.keepScanList.splice(key, 1)
      this.buyerData.splice(key, 1)
      if (this.ScanList.length === 0) {
        this.isEmpty = true
      }
    },
    handleScan(e) {
      // 扫码添加
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleRemoveScan(e) {
      window.removeEventListener('keydown', this.scanWrapper, false)
    },
    // 扫码
    scanWrapper(e) {
      if (e.keyCode === 13) {
        if (this.keepScanList.indexOf(this.scanVal) === -1) {
          this.getScanIn(this.scanVal.split(','))
        } else {
          this.$notification['error']({
            message: '错误',
            description: '该码已扫过，请勿重复扫码！',
            duration: 4
          })
          this.scanVal = ''
        }
      }
    },
    getScanIn(code) {
      // 获取扫码信息
      if (code.toString().indexOf('，') !== -1) {
        this.$notification['error']({
          message: '提示',
          description: '请将输入法切换到英文并重新扫码！',
          duration: 4
        })
        this.scanVal = ''
        return false
      }
      if (code.length < 7) {
        this.$notification['error']({
          message: '提示',
          description: '该码不存在，请重新扫码或确认是否缺码！',
          duration: 4
        })
        this.scanVal = ''
        return false
      }
      const dateCurrent = moment(code[5]).format('YYYY年MM月DD日')
      if (dateCurrent === 'Invalid date') {
        this.$notification['error']({
          message: '提示',
          description: '发票日期不正确！',
          duration: 4
        })
        this.scanVal = ''
        return false
      }
      if (code[4] === '') {
        this.$notification['error']({
          message: '提示',
          description: '发票不含税金额不正确！',
          duration: 4
        })
        this.scanVal = ''
        return false
      }
      this.keepScanList.unshift(this.scanVal)
      this.buyerData.unshift([])
      const data = {
        invoice: {
          inCode: code[2],
          inNo: code[3],
          inType: code[1],
          inDate: code[5],
          noneTaxTotal: Math.abs(code[4]),
          verifyCode: code[6].substring(code[6].length - 6, code[6]),
          inRemark: '',
          inStatus: 1,
          status: 1,
          distCode: undefined,
          distName: undefined,
          cusCode: undefined,
          cusName: undefined,
          reportType: 1
        },
        picId: ''
      }
      switch (data.invoice.inType) {
        case '01':
          data.invoice.invoiceTypeName = '增值税专用发票'
          data.invoice.verifyCodeShow = false
          break
        case '04':
          data.invoice.invoiceTypeName = '增值税普通发票'
          data.invoice.verifyCodeShow = true
          break
        case '10':
          data.invoice.invoiceTypeName = '增值税普通发票（电子）'
          data.invoice.verifyCodeShow = true
          break
        case '51':
          data.invoice.inType = 10
          data.invoice.invoiceTypeName = '增值税普通发票（电子）'
          data.invoice.verifyCodeShow = true
          break
      }
      data.invoice.date = undefined
      this.ScanList[0] = data
      // this.timeSelect = data.inDate ?
      //     moment(moment(data.inDate).format('YYYY-MM-DD'), 'YYYY-MM-DD') :
      //     null
      this.isEmpty = false
      this.scanVal = ''
    },
    isEmptyData(str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    handleSave() {
      // 保存
      if (this.ScanList.length === 0) {
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
      if (this.ScanList.length > 0) {
        for (let i = 0; i < this.ScanList.length; i++) {
          this.ScanList[i].invoice.inDate = moment(
            this.ScanList[i].invoice.inDate
          ).format('YYYY-MM-DD')
          const currentData = this.ScanList[i].invoice
          if (
            this.isEmptyData(currentData.distCode) ||
                        (this.addType === null && this.isEmptyData(currentData.cusCode)) ||
                        (this.addType !== null && this.isEmptyData(currentData.distribution)) ||
                        this.isEmptyData(currentData.date) || currentData.date === undefined || currentData.date === null
          ) {
            this.$notification['error']({
              message: '提示',
              description: '必填项不能为空！',
              duration: 4
            })
            this.saveStatus = false
            return false
          }
          if (!this.isEmptyData(currentData.inRemark)) {
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
        }
        let scanData = {}
        scanData = this.ScanList[0]
        // let timeSelect = this.timeSelect
        // if (timeSelect) {
        //     let yearMonth = timeSelect.split('-')
        //     scanData.invoice.date = yearMonth[0] + '-' + yearMonth[1]
        // }

        scanData.invoice.hosAuthFlag = scanData.invoice.authorize === 'hasNo' ? '2' : '1'
        // scanData.picId = this.picId
        const userDistCode = getStore('USER_DIST_CODE')
        const userDistName = getStore('USER_DIST_NAME')
        scanData.invoice.reportOrgCode = userDistCode
        scanData.invoice.reportOrgName = userDistName
        if (this.addType === null) {
          invoiceAdd(scanData).then(res => {
            this.handleResult(res)
          })
        } else {
          EstateAdd(scanData).then(res => {
            this.handleResult(res)
          })
        }
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
        // this.$emit('scanBack', 'index')
        const ImgObj = res.data.invoice
        // this.$emit('imgRecog', 'index')
        // this.$emit('imgRecogClear')
        const detailsData = {}
        detailsData.id = ImgObj.id
        detailsData.status = ImgObj.status
        detailsData.verifyStatus = ImgObj.verifyStatus
        detailsData.verifyErrCode = ImgObj.verifyErrCode
        detailsData.verifyErrMsg = ImgObj.verifyErrMsg
        const params = {
          addType: this.addType
        }
        setStore('AUDITEDIT', {})

        setStore('EstateId', JSON.stringify(detailsData))
        if (this.addType === null) {
          _that.$router.push({
            name: 'AuditManage_Detail',
          })
        } else {
          params.parentCom = 'PerfessionWrap'
          setStore('EstateInfo', JSON.stringify(params))
          this.$router.push({
            name: 'PerfessionWrap_Detail'
          })
        }
      } else {
        this.$notification['error']({
          message: '保存失败',
          description: res.message,
          duration: 4
        })
        this.saveStatus = false
      }
    },
    handleBack() {
      this.$emit('scanBack', 'index')
    },
  },
  destroyed() {
    window.removeEventListener('keydown', this.scanWrapper, false)
  }
}
</script>

<style lang="less" scoped>
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

    margin-top: 20px;
    padding: 30px 20px;
    box-shadow: 0px 5px 20px rgba(227, 227, 238, 1);
    border-radius: 8px;
    position: relative;

    //小屏
    @media (max-width: 1550px) {
        padding: 30px 12px;
    }

    .deleteInvoice {
        position: absolute;
        right: 44px;
        bottom: 44px;
        border: 1px solid #e9e9e9;
        line-height: 28px;
        padding: 0 10px;
        border-radius: 4px;
        cursor: pointer;
        z-index: 99;
    }

    .deleteInvoice:hover {
        border: 1px solid #3e4da8;
        background: #3e4da8;
        color: #fff;
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

    .invoiceTable {
        /*margin-left: 10px;*/
        border: 1px solid #e9e9e9;
        border-right: none;
        border-bottom: none;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        background: #fbfbfb;
        line-height: 56px;
        height: 176px;

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
                line-height: 57px;
                height: 57px;
                font-size: 13px;

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
                    display: inline-block;

                    &:hover {
                        color: #3e4da8;
                    }
                }

                >span {
                    display: inline-block;
                }

                .ant-row {
                    margin-top: 10px;
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
</style>
