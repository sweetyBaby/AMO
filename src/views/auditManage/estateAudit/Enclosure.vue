<template>
  <a-card :bordered="false" v-if="pageIndex">
    <a-spin tip="正在识别中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingExport"></a-spin>
    <div class="pageTitle estateBtn">
      <div class="icons-list pageTitle-Btn">
        <span class="titleBtn" v-if="hasPermission('imgAdd')">
          <a-upload
            action="/amo/upload/file/dealPic"
            @change="uploadChange"
            :fileList="fileList"
            :showUploadList="false"
            :headers="headerUpload"
            :data="uploadData"
            :beforeUpload="beforeUpload"
            :disabled="verifyStatus !== '03' && verifyStatus !== '05'">
            <a-tooltip placement="top">
              <template slot="title">
                <span>图片识别</span>
              </template>
              <i class="iconfont icon-img" />
            </a-tooltip>
          </a-upload>
        </span>
      </div>
      <div class="scanInfo">
        <a-popover title="开始扫码" trigger="click" :visible="scanStart" :overlayStyle="{ width:'330px' }" overlayClassName="scanOverview">
          <template slot="content">
            <div class="scanCon">
              <img :src="scanImgUrl" alt />
              <p>用扫码抢扫描发票二维码</p>
            </div>
          </template>
          <a-input
            placeholder="单击扫码添加附件"
            :style="{ width:'260px',float:'right' }"
            v-model="scanVal"
            autocomplete="off"
            @change="handleScan"
            id="myInput"
            @blur="handleRemoveScan"
            @focus="handleFocus"
            :disabled="verifyStatus !== '03' && verifyStatus !== '05'">
            <i slot="prefix" class="iconfont icon-scan"></i>
          </a-input>
        </a-popover>
      </div>
    </div>
    <EstateEmpty @click="handleUpEstate" :isTitle="isEmpty" />
    <div v-if="!isEmpty">
      <s-table
        ref="table"
        class="auditWrap"
        size="default"
        rowKey="key"
        :pageNum="queryParam.page"
        :pageSize="queryParam.size"
        :columns="columns"
        :data="loadData"
        :rowClassName="record => record.inStatus === '1' ? '' : 'textRed'">
        <span slot="isOnRecord" slot-scope="text, record" class="cusName-Icon">
          <a-tooltip placement="top">
            <template slot="title">
              <span v-show="record.auth === true">已备案</span>
              <span v-show="record.auth !== true">未备案</span>
            </template>
            <i class="iconfont icon-allauthorized" v-show="record.auth === true"/>
            <i class="iconfont icon-unauthorized" v-show="record.auth !== true"/>
          </a-tooltip>
          <span class="cusNameTab" v-show="record.docType !== '11'"></span>
          {{ text }}
        </span>
        <span slot="inNo" slot-scope="text, record">
          <span class="auditTitle">
            <small>配</small>
            <span>{{ record.distribution }}</span>
            <b>-</b>
            <small>购</small>
            <a-tooltip placement="top" :title="record.cusName">
              <span class="serialName">{{ record.cusName }}</span>
            </a-tooltip>
          </span>
          <span class="borderL" v-if="record.inStatus !== null">
            <span v-if="record.inStatus === '1'" class="invoiceStatusTable1"></span>
            <span v-else class="invoiceStatusTable2"></span>
          </span>
          <a-tag color="cyan" v-show="record.invoiceType === '2'">补传</a-tag>
          <a-tag color="blue" v-show="record.invoiceType === '3'">申诉</a-tag>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <div>
              <a-popover placement="bottomRight" v-model="record.isVoid">
                <template slot="content">
                  <p @click="handleDetails(text,record)" v-show="record.status !== '2'">
                    <i class="iconfont icon-detail" />
                    {{ (record.productFlag === '0') ? '添加明细' : '查看详情' }}
                  </p>
                  <p v-if="record.status === '2'">
                    <i class="iconfont icon-void" />已作废
                  </p>
                  <p v-else @click="showConfirm(text,record)">
                    <i class="iconfont icon-void" />作废
                  </p>
                  <!--<p @click="deleteTableData(text,record)"><i class="iconfont icon-empty"/>删除</p>-->
                </template>
                <i class="iconfont icon-tableMore" />
              </a-popover>
            </div>
          </template>
        </span>
        <!-- 未授权标签-->
        <span slot="cusName" slot-scope="text, record" class="cusName-Icon">
          <a-tooltip placement="top" v-show="record.hosAuthFlag === '2'">
            <template slot="title">
              <span v-show="record.hosAuthFlag === '2'">未授权</span>
            </template>
            <i class="iconfont icon-unauthorized" v-show="record.hosAuthFlag === '2'" />
          </a-tooltip>
          <a-tooltip placement="top" :title="text">
            <span class="serialName">{{ text }}</span>
          </a-tooltip>
        </span>
        <!-- 名称超出省略  -->
        <template slot="name" slot-scope="name">
          <a-tooltip placement="top" :title="name">
            <span class="serialName">{{ name }}</span>
          </a-tooltip>
        </template>
      </s-table>
    </div>
  </a-card>
  <a-card :bordered="false" v-else-if="pageScan" :invoiceType="invoiceType">
    <Scan @scanBack="scanBack"></Scan>
  </a-card>
  <a-card :bordered="false" v-else-if="pageManual">
    <ManualInput @manualInput="scanBack" :invoiceType="invoiceType"></ManualInput>
  </a-card>
  <a-card :bordered="false" v-else-if="pageImg">
    <ImgRecog @imgRecog="scanBack" @imgRecogClear="imgRecogClear" :imgUploadList="imgUploadList" :invoiceType="invoiceType"></ImgRecog>
  </a-card>
  <a-card :bordered="false" v-else-if="pageDetails">
    <AddNewEstate @details="scanBack" :detailsDataProp="detailsData"></AddNewEstate>
  </a-card>
</template>

<script>
import moment from 'moment'
import {
  STable
} from '@/components'
import {
  getPerssionAudit,
  invoiceUpdate,
  invoiceSeller,
  invoiceBuyer,
  PerssionDel
} from '@/api/auditManage/auditManage'
import {
  fetchTemplate
} from '@/api/depot/depot'
import {
  DataFilter,
  exportTable,
  BtnShow,
  getStore,
  setStore
} from '@/utils/storage'
import Scan from '../auditWrap/modules/scan'
import ManualInput from '../auditWrap/modules/manualInput'
import ImgRecog from '../auditWrap/modules/imgRecog'
import AddDetails from '../auditWrap/modules/addDetails'
import EstateEmpty from './modules/EstateEmpty'
import AddNewEstate from './AddNewEstate'
import scanImg from '@/assets/icons/scanImg.png'

export default {
  name: 'Enclosure',
  props: ['type', 'isAuditShow'],
  components: {
    STable,
    Scan,
    ManualInput,
    ImgRecog,
    AddDetails,
    EstateEmpty,
    AddNewEstate
  },
  data() {
    return {
      btnPermission: [],
      tableList: [],
      CheckTrue: [{
        verifyStatus: '01',
        verifyErrMsg: '验真异常'
      },
      {
        verifyStatus: '02',
        verifyErrMsg: '验真不通过'
      },
      {
        verifyStatus: '03',
        verifyErrMsg: '验真通过'
      },
      {
        verifyStatus: '05',
        verifyErrMsg: '关账'
      },
      {
        verifyStatus: '00',
        verifyErrMsg: '其他'
      }
      ],
      upFromList: [{
        code: '1',
        type: '正常',
        name: '正常'
      }, {
        code: '2',
        type: '补传',
        name: '补传'
      }, {
        code: '3',
        type: '申诉',
        name: '申诉'
      }],
      // 查询参数
      queryParam: {
        page: 1,
        size: 10
      },
      excelUpload: {
        invoiceType: '1'
      },
      loadingSpin: false,
      loadingExport: false,
      statusTable: [1, 3],
      fileList: [],
      uploadNum: 0,
      uploadData: {
        fileType: 21,
        uploadType: 1,
        invoiceType: '1'
      },
      imgUploadList: [],
      isShowSearch: false,
      isEmpty: false,
      pageIndex: true,
      pageScan: false,
      pageImg: false,
      pageManual: false,
      pageDetails: false,
      dateSelected: [],
      detailsData: {
        distributionInvoiceId: '',
        status: '',
        verifyStatus: '',
        verifyErrMsg: '',
        type: 'add',
        inType: 1,
        invoiceType: '1'
      },
      columns: [{
        title: '配送商/购货方',
        dataIndex: 'distibution',
        width: '240px',
        scopedSlots: {
          customRender: 'inNo'
        }
      },
      {
        title: '发票号码/凭证号',
        dataIndex: 'inNo',
        width: '200px',
        scopedSlots: {
          customRender: 'isOnRecord'
        }
      },
      {
        title: '验真结果',
        dataIndex: 'verifyStatus',
        width: '100px',
        customRender: (text, record) => {
          switch (text) {
            case '01':
              return '验真异常'
              break
            case '02':
              if (record.verifyErrCode === '2000' || record.verifyErrCode === '3000') {
                return '审计异常'
              }
              return '验真不通过'

              break
            case '03':
              if (record.inType < 20) {
                return '审计通过'
              }
              return null

              break
            case '05':
              return '关账'
              break
            default:
              break
          }
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '55px',
        customRender: text => {
          switch (text) {
            case '1':
              return '正常'
              break
            case '2':
              return '作废'
              break
            case '3':
              return '重复'
              break
            case '99':
              return '已删除'
              break
          }
        }
      },
      {
        title: '开票日期',
        dataIndex: 'inDate',
        width: '100px',
        customRender: text => {
          if (text !== null) {
            // return moment(text).format('YYYY-MM-DD HH:mm:ss')
            return moment(text).format('YYYY-MM-DD')
          }
        }
      },
      {
        title: '销量月份',
        dataIndex: 'salesYear ',
        width: '130px',
        customRender: (text, record) => {
          if (record.salesYear !== null && record.salesMonth !== null) {
            return record.salesYear + '-' + record.salesMonth
          }
          return null
        }
      },
      {
        title: '附件类型',
        dataIndex: 'inType',
        width: '120px',
        customRender: text => {
          switch (text) {
            case '01':
            case '04':
            case '10':
              return '发票'
              // eslint-disable-next-line no-unreachable
              break
            case '20':
              return '出入库单凭证'
              // eslint-disable-next-line no-unreachable
              break
            case '30':
              return '合同'
              // eslint-disable-next-line no-unreachable
              break
            case '40':
              return '无支持件'
              // eslint-disable-next-line no-unreachable
              break
          }
        }
      },
      {
        title: '更新时间',
        dataIndex: 'operDate',
        width: '130px',
        customRender: text => {
          if (text !== null) {
            return moment(text).format('YYYY-MM-DD HH:mm')
          }
        }
      }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const _that = this
        return getPerssionAudit(Object.assign(this.queryParam, parameter)).then(
          res => {
            if (res.code === 500) {
              _that.$notification['error']({
                message: res.code,
                description: res.message,
                duration: 4
              })
              this.tableList = []
              this.isEmpty = true
              return []
            }

            this.queryParam.size = res.data && res.data.pageSize ? res.data.pageSize : 0
            const auditManageData = DataFilter(res, 'ware')
            this.tableList = auditManageData
            // console.log('=======', auditManageData)
            if (auditManageData.data.length === 0) {
              this.isEmpty = true
            } else {
              this.isEmpty = false
            }
            return auditManageData
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: [],
      rowSelection: {
        onSelect: this.onSelect,
        onSelectAll: this.onSelectAll
      },
      sellerData: [],
      buyerData: [],
      statusList: [{
        code: 1,
        name: '正常'
      },
      {
        code: 2,
        name: '作废'
      },
      {
        code: 3,
        name: '重复'
      }
      ],
      distributionInvoiceId: '',
      scanStart: false,
      scanImgUrl: scanImg,
      scanVal: '',
      keepScanList: [],
      verifyStatus: '01',
      invoiceType: {
        invoiceType: '1'
      },
      isVoid: false,
      isChecked: false
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
    this.getFirstLoad()
    this.getInvoiceSeller()
    this.setParenRoute()
  },
  methods: {
    setParenRoute() {
      const _that = this
      const callback = function () {
        _that.pageIndex = true
        _that.pageScan = false
        _that.pageImg = false
        _that.pageManual = false
        _that.pageDetails = false
        window.removeEventListener('popstate', callback)
      }
      history.pushState(
        null,
        null,
        '/auditManage/estateAudit/PerfessionWrap#eclosure'
      )
      window.addEventListener('popstate', callback)
    },
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad() {
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      this.btnPermission = BtnShow(currentRoute)
      if (this.hasPermission('down') || this.hasPermission('scan' || this.hasPermission('imgAdd')) && this.columns.length < 9) {
        this.columns.push({
          title: '操作',
          align: 'center',
          width: '100px',
          scopedSlots: {
            customRender: 'action'
          }
        })
      }
      const InvoiceId = getStore('EstateId')
      // console.info('InvoiceId---', InvoiceId)
      this.distributionInvoiceId = InvoiceId.InvoiceId
      this.queryParam.distributionInvoiceId = InvoiceId.InvoiceId
      // console.info('this.queryParam---', this.queryParam)
      this.detailsData.distributionInvoiceId = InvoiceId.InvoiceId
      this.verifyStatus = InvoiceId.verifyStatus
      this.detailsData.PareStatus = InvoiceId.verifyStatus
      this.detailsData.distribution = InvoiceId.distribution
      if (this.type && this.type === 'supple') {
        this.invoiceType.invoiceType = '2'
        this.uploadData.invoiceType = '2'
        this.detailsData.invoiceType = '2'
      } else if (this.type && this.type === 'appeal') {
        this.invoiceType.invoiceType = '3'
        this.uploadData.invoiceType = '3'
        this.detailsData.invoiceType = '3'
      }
      this.pageIndex = true
    },
    handleImgUp() {
      if (this.verifyStatus !== '03' && this.verifyStatus !== '05') {
        this.$notification['error']({
          message: '错误提示',
          description: '主发票只有验真通过，才可上传附件哟~',
          duration: 4
        })
      }
    },
    handleExport() {
      this.loadingExport = true
      this.queryParam = {
        ...this.queryParam,
        page: undefined,
        size: undefined
      }
      exportTable(
        this.tableList.data,
        this.queryParam,
        '/amo/invoice/export',
        '发票管理导出列表'
      ).then(doc => {
        this.loadingExport = false
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    tableSearch() {
      // 表格查询
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleChangeStatus(value) {
      // 更改状态
      this.queryParam.status = value.join()
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },
    sellerChange(value, option) {
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.getBuyerData(param)
    },
    getBuyerData(param) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.buyerData = res.data
      })
    },
    imgRecogClear() {
      // 清除图片上传数据
      this.fileList = []
      this.imgUploadList = []
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
      if (fileList.length !== 0) {
        for (let i = fileList.length - 1; i >= 0; i--) {
          const size = fileList[i].size / 1024 / 1024
          if (size > 5) {
            fileList.splice(i, 1)
          }
        }
      }
      this.uploadNum = fileList.length
    },
    beforeUploadExcel(file) {
      const size = file.size / 1024 / 1024
      if (size > 10) {
        this.$notification['error']({
          message: '上传失败',
          description: '文件大小不能超过10M！',
          duration: 4
        })
        return false
      }
    },
    uploadChangeExcel({
      file,
      fileList
    }) {
      if (file.status === 'done') {
        if (file.response.code === 500) {
          this.$notification['error']({
            message: '上传失败',
            description: file.response.message,
            duration: 4
          })
        } else if (file.response.code === 200) {
          this.$notification['success']({
            message: '提示',
            description: '上传成功',
            duration: 4
          })
          this.$refs.table.refresh(false)
          this.$router.push({
            name: 'InvoiceFile'
          })
        }
      }
    },
    uploadChange({
      file,
      fileList
    }) {
      // console.info('fileList====', fileList)
      this.fileList = []
      // 发票图片新增上传
      this.loadingSpin = true
      if (fileList.length !== 0) {
        for (let i = fileList.length - 1; i >= 0; i--) {
          const size = fileList[i].size / 1024 / 1024
          if (size > 5) {
            fileList.splice(i, 1)
            this.loadingSpin = false
          }
        }
      }
      this.fileList = fileList
      if (fileList.length === this.uploadNum) {
        let turnOn = true
        for (let i = this.fileList.length - 1; i >= 0; i--) {
          if (
            this.fileList[i].status !== 'done' &&
                        this.fileList[i].status !== 'error'
          ) {
            turnOn = false
          }
        }
        if (turnOn) {
          this.loadingSpin = false
          for (let j = this.fileList.length - 1; j >= 0; j--) {
            if (this.fileList[j].response.code === 500) {
              this.$notification['error']({
                message: this.fileList[j].name + '上传失败',
                description: this.fileList[j].response.message,
                duration: 4
              })
              this.fileList.splice(j, 1)
            } else if (this.fileList[j].status === 'error') {
              this.$notification['error']({
                message: this.fileList[j].name + '上传失败',
                description: '网络错误',
                duration: 4
              })
              this.fileList.splice(j, 1)
            } else {
              this.imgUploadList = []
              this.imgUploadList.push(this.fileList[j].response.data[0])
            }
          }
          if (this.fileList.length !== 0) {
            const ImgData = {
              ...this.imgUploadList[0],
              imgId: this.imgUploadList[0].id,
              inType: this.imgUploadList[0].ocrInType,
              inCode: this.imgUploadList[0].ocrInCode,
              inNo: this.imgUploadList[0].ocrInNo,
              inDate: this.imgUploadList[0].ocrInDate,
              cusCode: this.imgUploadList[0].cusCode,
              noneTaxTotal: this.imgUploadList[0].ocrNonetaxtotal,
              verifyCode: this.imgUploadList[0].ocrVerifyCode.substr(this.imgUploadList[0].ocrVerifyCode.length - 6),
              fileUrl: this.imgUploadList[0].inUrl,
              reportType: 2,
            }
            delete ImgData.id
            const params = {
              auditTitle: '图片发票上传',
              type: 'add',
              invoice: ImgData,
              invoiceType: this.type === 'supple' ? '2' : (this.type === 'appeal' ? '3' : '1')
            }
            this.detailsData.inType = 1
            // console.info('params=====', params)
            setStore('estateDetail', params)
            // localStorage.setItem('estateDetail', JSON.stringify(params))
            this.setRouterState()
            this.pageIndex = false
            this.pageScan = false
            this.pageImg = false
            this.pageManual = false
            this.pageDetails = true
            this.fileList = []
          }
        }
      }
    },
    downloadTemplate() {
      // 下载模板
      const downloadParam = 'model=invoice&type=excel'
      fetchTemplate(downloadParam).then(res => {
        window.location.href = res.data
      })
    },
    setRouterState() {
      const _that = this
      const callback = function () {
        _that.pageIndex = true
        _that.pageScan = false
        _that.pageImg = false
        _that.pageManual = false
        _that.pageDetails = false
        window.removeEventListener('popstate', callback)
      }
      let parmPath = '/auditManage/estateAudit/PerfessionWrap#eclosure'
      if (this.type && this.type === 'supple') {
        parmPath = '/auditManage/supplement/PerfessionSupple#eclosure'
      } else if (this.type && this.type === 'appeal') {
        parmPath = '/auditManage/appeal/PerfessionAppeal#eclosure'
      }
      // console.info('parmPath===', parmPath)
      history.pushState(
        null,
        null,
        parmPath
      )
      window.addEventListener('popstate', callback)
    },
    handleDetails(text, record) {
      // console.info('record====', record)
      this.setRouterState()
      // 添加明细
      this.detailsData = {
        ...record,
        type: 'edit'
      }
      this.pageIndex = false
      this.pageScan = false
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = true
      this.handleUpEstate({
        type: 'details'
      },
      record
      )
    },
    scanBack() {
      // 扫码返回
      this.isEmpty = false
      this.pageIndex = true
      this.pageScan = false
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = false
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
      })
    },
    manualUpload() {
      // 手工录入
      this.setRouterState()
      this.pageIndex = false
      this.pageScan = false
      this.pageImg = false
      this.pageManual = true
      this.pageDetails = false
      this.detailsData = {
        ...this.detailsData,
        type: 'add',
        inType: 1
      }
      this.detailsData.inType = 1
    },
    scanUpload() {
      // 扫码添加
      this.setRouterState()
      this.pageIndex = false
      this.pageScan = true
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = false
      this.detailsData.inType = 1
    },
    handleSearch() {
      // 展开搜索
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    handlePicker(date, dateString) {
      // 日期选择
      this.queryParam.beginInDate = dateString[0]
      this.queryParam.endInDate = dateString[1]
    },
    onSelect(record, selected, selectedRows) {
      // 勾选选中
    },
    onSelectAll(selected, selectedRows, changeRows) {
      // 全选
    },
    showConfirm (text, record) {
      const _that = this
      this.$confirm({
        title: '确认作废该发票?',
        onOk () {
          _that.toVoid(text, record)
        },
        onCancel () {
        }
      })
    },
    toVoid(text, record) {
      record.isVoid = false
      record.isChecked = false
      // 作废
      const param = {
        id: record.id
      }
      PerssionDel(param).then(res => {
        // console.log(this.queryParam)
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '提示',
            description: '作废成功！',
            duration: 4
          })
        } else {
          this.$notification['error']({
            message: '提示',
            description: res.message || '作废失败！',
            duration: 4
          })
        }
        this.$refs.table.refresh(false)
      })
    },
    deleteTableData(text, record) {
      // 删除
      const param = {
        invoice: {
          id: record.id,
          status: 99
        }
      }
      invoiceUpdate(param).then(res => {
        this.$refs.table.refresh(false)
        this.$notification['success']({
          message: '提示',
          description: '删除成功！',
          duration: 4
        })
      })
    },
    resetSearchForm() {
      // 重置
      this.queryParam = {
        ...this.queryParam,
        verifyStatus: undefined,
        distCode: undefined,
        cusCode: undefined,
        inNo: '',
        beginInDate: '',
        endInDate: '',
        cusName: '',
        invoiceType: undefined,
        status: '1,3'
      }
      this.dateSelected = []
      this.buyerData = []
      this.statusTable = [1, 3]
    },
    handleUpEstate(payload, record) {
      // console.info('this.verifyStatus====', this.verifyStatus)
      if (this.verifyStatus !== '03' && this.verifyStatus !== '05') {
        this.$notification['error']({
          message: '错误',
          description: '主发票只有验真通过，才可上传附件哟~',
          duration: 4
        })
      } else {
        let auditTitle = ''
        const addtype = payload.type
        let inType = 1
        switch (payload.type) {
          case 'wareDoc':
            auditTitle = '新增出入库单凭证'
            inType = 20
            break
          case 'noUdi':
            auditTitle = '发票手工新增'
            inType = 1
            break
          case 'purSure':
            auditTitle = '新增合同附件'
            inType = 30
            break
          case 'noSupport':
            auditTitle = '新增无支持件附件'
            inType = 40
            break
          case 'details':
            auditTitle = '发票明细'
            inType = record.inType
            break
          default:
            break
        }
        this.pageIndex = false
        this.pageScan = false
        this.pageImg = false
        this.pageManual = false
        this.pageDetails = true
        const params = {
          auditTitle: auditTitle,
          type: 'add',
          addtype: addtype
        }
        this.detailsData.inType = inType
        if (record) {
          params.invoiceId = record.id
          params.type = 'edit'
        }
        params.invoiceType = this.type === 'supple' ? '2' : (this.type === 'appeal' ? '3' : '1')
        localStorage.setItem('estateDetail', JSON.stringify(params))
      }
    },
    // 扫码新增
    handleScan(e) {
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleFocus() {
      const input = document.getElementById('myInput')
      input.focus()
      this.scanStart = true
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleRemoveScan() {
      window.removeEventListener('keydown', this.scanWrapper, false)
      this.scanStart = false
    },
    // 扫码
    scanWrapper(e) {
      if (e.keyCode === 13) {
        this.scanStart = false
        // if (this.keepScanList.indexOf(this.scanVal) === -1) {
        //     this.getScanIn(this.scanVal.split(','))
        // } else {
        //     this.$notification['error']({
        //         message: '错误',
        //         description: '该码已扫过，请勿重复扫码！',
        //         duration: 4
        //     })
        //     this.scanVal = ''
        // }
        this.getScanIn(this.scanVal.split(','))
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
          inDate: moment(code[5]).format('YYYY-MM-DD'),
          noneTaxTotal: Math.abs(code[4]),
          verifyCode: code[6].substring(code[6].length - 6, code[6]),
          inRemark: '',
          inStatus: '1',
          status: 1,
          distCode: undefined,
          distName: undefined,
          cusCode: undefined,
          cusName: undefined,
          reportType: 1,
          invoiceType: this.type === 'supple' ? '2' : (this.type === 'appeal' ? '3' : '1')
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
      // console.info('data====', data)
      // this.ScanList.unshift(data)
      this.detailsData.inType = 1
      const params = {
        ...this.detailsData,
        ...data,
        auditTitle: '扫码上传发票',
        type: 'add',
        inType: 1
      }
      //   localStorage.setItem('estateDetail', JSON.stringify(params))
      setStore('estateDetail', params)
      this.pageIndex = false
      this.pageScan = false
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = true
      this.scanVal = ''
    }
  },
  destroyed() {
    this.loadingSpin = false
    this.loadingExport = false
  },
  watch: {
    $route(to, from) {
      // console.info('to---', to)
      if (to.name === 'PerfessionWrap_Detail') {
        this.getFirstLoad()
      }
    },
    isAuditShow(newVal) {
      const _that = this
      const InvoiceId = getStore('EstateId')
      if (newVal) {
        this.$nextTick(() => {
          _that.getFirstLoad()
          if (InvoiceId.verifyStatus === '03') {
            _that.$refs.table.refresh(true)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/*红蓝票样式*/

.invoiceStatusTable1 {
    width: 2px;
    height: 100%;
    display: inline-block;
    background: #4e9df9;
}

.invoiceStatusTable2 {
    width: 2px;
    height: 100%;
    display: inline-block;
    background: #e17877;
}

/*空数据*/
.scanEmpty {
    width: 100%;
    text-align: center;

    h4 {
        color: rgba(147, 147, 147, 1);
        font-size: 14px;
        padding: 0 0 40px 0;
    }

    .scanInfo {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;

        .scanBor {
            width: 1px;
            height: 100%;
            min-height: 80px;
            display: inline-block;
            background: rgba(236, 236, 236, 1);
        }

        .scanListAudit {
            position: relative;
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

//上传中
.uploading {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.65);
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
}

/*popover*/
.ant-popover-inner-content a {
    display: block;
    height: 38px;
    line-height: 38px;
    padding-left: 31px;
    color: #939393;
}

.ant-popover-inner-content a:hover {
    color: #153aaf;
    background: #f6f6f8;
}

.ant-card-bordered {
    border: none !important;
}

.ant-popover-content {
    .ant-popover-inner-content {
        p {
            height: 38px;
            line-height: 38px;
            padding-left: 31px;
            color: #939393;
            margin-bottom: 0;
            cursor: pointer;

            i {
                margin-right: 12px;
            }
        }

        p:hover {
            color: #153aaf;
            background: #f6f6f8;
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

.serialName {
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    position: inherit;
}

//客户名称未授权图标样式
.cusName-Icon {
    .iconfont {
        cursor: pointer;
        font-size: 18px;
        line-height: 22px;
        color: #cfcfcf;
        margin: 0 4px 0 0;
        display: inline-block;

        &.icon-allauthorized {
            color: rgba(96, 198, 151, 1);
        }
    }
}

// tab 按钮样式
.estateBtn {
    position: absolute;
    top: -70px;
    right: 24px;
}

:global {
    .auditWrap {
        /deep/ .ant-table-body {
            table {
                border-collapse: separate;
                border-spacing: 0 10px;

                tr th {
                    background: none;
                    color: rgba(177, 177, 177, 1);
                    font-size: 12px;
                    font-weight: normal;
                }

                tr th,
                tr td {
                    border: none;
                }

                .ant-table-tbody tr {
                    box-shadow: 0px 3px 15px rgba(172, 173, 183, 0.2);

                    td {
                        color: rgba(147, 147, 147, 1);
                        font-size: 14px;
                        padding: 16px;
                        background: white;
                        border-top: 2px solid white;
                        border-bottom: 2px solid white;

                        &:first-child {
                            position: relative;
                            padding-left: 40px;
                            border-top-left-radius: 6px;
                            border-bottom-left-radius: 6px;
                            border-right: 2px solid white;

                            span.auditTitle {
                                /*position: absolute;*/
                                color: rgba(52, 53, 62, 1);
                                font-size: 14px;

                                >span {
                                    display: inline-block;
                                    float: left;
                                }

                                b {
                                    display: block;
                                    padding: 0 6px;
                                    float: left;
                                    color: rgba(177, 177, 177, 1);
                                }

                                small {
                                    font-size: 14px;
                                    color: rgba(177, 177, 177, 1);
                                    padding: 0 4px 0 0;
                                    float: left;
                                }
                            }

                            span.borderL {
                                display: block;
                                height: 80%;
                                width: 2px;
                                position: absolute;
                                top: 8px;
                                left: 8px;
                            }
                        }

                        &:last-child {
                            border-right: 2px solid white;
                            border-top-right-radius: 6px;
                            border-bottom-right-radius: 6px;
                        }

                        &:hover {
                            border: none;
                        }

                        span.auditTitle {
                            float: left;
                            padding: 0 8px 0 0;
                        }
                    }

                    &:hover {
                        td {
                            border-top: 2px solid rgba(251, 199, 115, 1);
                            border-bottom: 2px solid rgba(251, 199, 115, 1);

                            &:first-child {
                                border-left: 2px solid rgba(251, 199, 115, 1);
                            }

                            &:last-child {
                                border-right: 2px solid rgba(251, 199, 115, 1);
                            }
                        }

                        box-shadow: 0px 3px 15px rgba(172, 173, 183, 0.2);
                    }
                }
            }
        }
    }
}

.scanOverview {
    :global {
        .ant-popover-inner {
            width: 100% !important;
        }
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

.scanInfo {
    float: right;

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

.serialName {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
}
</style>
