<template>
  <a-card :bordered="false" v-if="pageIndex">
    <a-spin tip="正在识别中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingExport"></a-spin>
    <div class="pageTitle estateBtn">
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <h3>配送商发票</h3>
        </a-col>
        <a-col :md="12" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="scanUpload" v-if="hasPermission('scan')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>扫码识别</span>
                </template>
                <i class="iconfont icon-scanIcon" />
              </a-tooltip>
            </span>
            <span class="titleBtn" v-if="hasPermission('imgAdd')">
              <a-upload
                action="/amo/upload/file/dealPic"
                @change="uploadChange"
                :fileList="fileList"
                :showUploadList="false"
                :headers="headerUpload"
                :data="uploadData"
                :beforeUpload="beforeUpload"
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>图片识别</span>
                  </template>
                  <i class="iconfont icon-img" />
                </a-tooltip>
              </a-upload>
            </span>
            <span class="titleBtn" @click="manualUpload" v-if="hasPermission('add')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>手工录入</span>
                </template>
                <i class="iconfont icon-plus" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search" />
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
        width="340"
      >
        <a-form layout="inline">
          <div class="searchWrap">
            <div class="searchList">
              <label for>销货方</label>
              <div class="basicInfo">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    placeholder="请选择销货方"
                    style="width: 100%"
                    v-model="queryParam.distCode"
                    @change="sellerChange"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    showSearch
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                  >
                    <a-select-option
                      v-for="(item,index) in sellerData"
                      :key="index"
                      :value="item.code"
                      :type="item.type"
                    >{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="searchList">
              <label for>配送商</label>
              <div class="basicInfo">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-model="queryParam.distribution"
                    placeholder="请输入配送商"
                  ></a-input>
                </a-form-item>
              </div>
            </div>
            <div class="searchList">
              <label for>发票号码</label>
              <a-input v-model="queryParam.inNo" placeholder="请输入发票号码" style="width: 100%;" />
            </div>
            <!--            <div class="searchList" style="width: 100%;">-->
            <!--              <label for>发票上传入口</label>-->
            <!--              <a-form-item style="width: 100%" has-feedback>-->
            <!--                <a-select-->
            <!--                  placeholder="选择上传入口"-->
            <!--                  style="width: 100%"-->
            <!--                  v-model="queryParam.invoiceType"-->
            <!--                  optionFilterProp="children"-->
            <!--                  :filterOption="filterOption"-->
            <!--                  showSearch-->
            <!--                  :getPopupContainer="triggerNode => triggerNode.parentNode"-->
            <!--                >-->
            <!--                  <a-select-option-->
            <!--                    v-for="(item,key) in upFromList"-->
            <!--                    :value="item.code"-->
            <!--                    :type="item.type"-->
            <!--                    :key="key"-->
            <!--                  >{{ item.name }}</a-select-option>-->
            <!--                </a-select>-->
            <!--              </a-form-item>-->
            <!--            </div>-->
            <div class="searchList">
              <label for>验真结果</label>
              <div class="basicInfo">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    placeholder="请选择验真结果"
                    style="width: 100%"
                    v-model="queryParam.verifyStatus"
                  >
                    <a-select-option
                      v-for="(item,index) in CheckTrue"
                      :key="index"
                      :value="item.verifyStatus"
                    >{{ item.verifyErrMsg }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="searchList">
              <label for>状态</label>
              <div class="basicInfo">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    placeholder="请选择状态"
                    style="width: 100%"
                    v-model="statusTable"
                    mode="multiple"
                    @change="handleChangeStatus"
                  >
                    <a-select-option
                      v-for="(item,index) in statusList"
                      :key="index"
                      :value="item.code"
                      :type="item.name"
                    >{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearchForm" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
    </div>
    <div v-if="!isEmpty">
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :pageNum="queryParam.page"
        :pageSize="queryParam.size"
        :columns="columns"
        :data="loadData"
        :rowClassName="record => record.inStatus === '1' ? '' : 'textRed'"
      >
        <span slot="verifyTxt" slot-scope="text, record">
          {{ verifyText(text, record) }}
          <a-tooltip placement="top" v-if="(record.verifyErrCode === '2000' || record.verifyErrCode === '3000') && record.verifyStatus === '02' ">
            <template slot="title">
              <span>{{ record.verifyErrMsg }}</span>
            </template>
            <i class="iconfont icon-tips text-red"/>
          </a-tooltip>
          <a-tag color="cyan" v-if="record.verifyErrCode === '1108'">国税维护</a-tag>
        </span>
        <span slot="inNo" slot-scope="text, record">
          <span v-if="record.inStatus === '1'" class="invoiceStatusTable1"></span>
          <span v-else class="invoiceStatusTable2"></span>
          {{ text }}
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
                    {{ (record.productFlag === '0') ? '查看明细' : '查看详情' }}
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
            <i class="iconfont icon-unauthorized" v-show="record.hosAuthFlag === '2'"/>
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
    <div class="scanEmpty" v-else>
      <h4>请在下方选择一种方式添加发票</h4>
      <div class="scanInfo">
        <div class="scanBor"></div>
        <div class="scanListAudit" @click="scanUpload">
          <span class="scanIcon">
            <i class="iconfont icon-scan" />
          </span>
          <div class="scanMain">
            <h3>扫码添加</h3>
            <p>扫码添加发票</p>
          </div>
        </div>
        <div class="scanBor"></div>
        <div class="scanListAudit">
          <a-upload
            action="/amo/upload/file/dealPic"
            @change="uploadChange"
            :fileList="fileList"
            :showUploadList="false"
            :headers="headerUpload"
            :data="uploadData"
            :beforeUpload="beforeUpload"
          >
            <span class="scanIcon">
              <i class="iconfont icon-plus" />
            </span>
            <div class="scanMain">
              <h3>图片识别</h3>
              <p>一次最多9张图片</p>
            </div>
          </a-upload>
        </div>
        <div class="scanBor"></div>
        <div class="scanListAudit" @click="manualUpload">
          <span class="scanIcon">
            <i class="iconfont icon-plus" />
          </span>
          <div class="scanMain">
            <h3>手工录入</h3>
            <p>手动填写发票</p>
          </div>
        </div>
        <div class="scanBor"></div>
      </div>
    </div>
  </a-card>
  <a-card :bordered="false" v-else-if="pageScan">
    <Scan @scanBack="scanBack" :invoiceType="invoiceType"></Scan>
  </a-card>
  <a-card :bordered="false" v-else-if="pageManual">
    <ManualInput @manualInput="scanBack" :invoiceType="invoiceType"></ManualInput>
  </a-card>
  <a-card :bordered="false" v-else-if="pageImg">
    <ImgRecog @imgRecog="scanBack" @imgRecogClear="imgRecogClear" :imgUploadList="imgUploadList" :invoiceType="invoiceType"></ImgRecog>
  </a-card>
  <a-card :bordered="false" v-else-if="pageDetails">
    <AddDetails @details="scanBack" :detailsDataProp="detailsData"></AddDetails>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import {
  getEstateAudit,
  EstateUpdate,
  invoiceSeller,
  invoiceBuyer,
  EstateDel
} from '@/api/auditManage/auditManage'
import { fetchTemplate } from '@/api/depot/depot'
import { DataFilter, exportTable, BtnShow, exportTabList, setStore, getStore } from '@/utils/storage'
import Scan from '../auditWrap/modules/scan'
import ManualInput from '../auditWrap/modules/manualInput'
import ImgRecog from '../auditWrap/modules/imgRecog'
import AddDetails from '../auditWrap/modules/addDetails'

export default {
  name: 'Perfessional',
  props: ['type', 'detail'],
  components: {
    STable,
    Scan,
    ManualInput,
    ImgRecog,
    AddDetails
  },
  data () {
    return {
      btnPermission: [],
      tableList: [],
      CheckTrue: [
        { verifyStatus: '01', verifyErrMsg: '验真异常' },
        { verifyStatus: '02', verifyErrMsg: '验真不通过/审计异常' },
        { verifyStatus: '03', verifyErrMsg: '审计通过' },
        { verifyStatus: '05', verifyErrMsg: '关账' },
        { verifyStatus: '00', verifyErrMsg: '其他' }
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
        size: 10,
        distCode: undefined,
        cusCode: undefined,
        inNo: '',
        beginInDate: '',
        endInDate: '',
        status: '1,3',
        invoiceType: undefined
      },
      excelUpload: {
        invoiceType: '1'
      },
      invoiceType: {
        invoiceType: '1'
      },
      loadingSpin: false,
      loadingExport: false,
      statusTable: [1, 3],
      fileList: [],
      uploadNum: 0,
      uploadData: {
        fileType: 11,
        uploadType: 1
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
      isAuditDetail: false,
      detailsData: {
        invoiceId: '',
        status: '',
        verifyStatus: '',
        verifyErrMsg: ''
      },
      columns: [
        {
          title: '验真结果',
          dataIndex: 'verifyStatus',
          width: '80px',
          scopedSlots: { customRender: 'verifyTxt' }
        },
        {
          title: '发票日期',
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
          title: '发票号码',
          dataIndex: 'inNo',
          width: '140px',
          scopedSlots: { customRender: 'inNo' }
        },
        {
          title: '销货方',
          dataIndex: 'distName',
          scopedSlots: {
            customRender: 'name'
          },
          width: '120px'
        },
        {
          title: '配送商',
          dataIndex: 'distribution',
          key: 'distribution',
          width: '120px'
        },
        {
          title: '录入方式',
          dataIndex: 'reportType',
          width: '80px',
          customRender: text => {
            switch (text) {
              case '1':
                return '扫码'
                // eslint-disable-next-line no-unreachable
                break
              case '2':
                return '图片识别'
                // eslint-disable-next-line no-unreachable
                break
              case '3':
                return '手工录入'
                // eslint-disable-next-line no-unreachable
                break
              case '4':
                return 'excel'
                // eslint-disable-next-line no-unreachable
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
        return getEstateAudit(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.queryParam.size = res.data.pageSize
            const auditManageData = DataFilter(res, 'perfession')
            this.tableList = auditManageData
            // console.log('=======',res.data,auditManageData);
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
      statusList: [
        { code: 1, name: '正常' },
        { code: 2, name: '作废' },
        { code: 3, name: '重复' }
      ]
    }
  },
  computed: {
    headerUpload () {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
  },
  created () {
    this.getFirstLoad()
    this.getInvoiceSeller()
  },
  methods: {
    verifyText (text, record) {
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
          return '审计通过'
          break
        case '05':
          return '关账'
          break
        default:
          break
      }
    },
    hasPermission (val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad () {
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      this.btnPermission = BtnShow(currentRoute)
      // console.info('BtnShow(currentRoute)---', BtnShow(currentRoute))
      if (this.hasPermission('down') || this.hasPermission('scan' || this.hasPermission('imgAdd') || this.hasPermission('add'))) {
        this.columns.push({
          title: '操作',
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        })
      }
      if (this.type && this.type === 'supple') {
        this.invoiceType.invoiceType = '2'
        this.queryParam.invoiceType = '2'
        this.uploadData.invoiceType = '2'
        this.detailsData.invoiceType = '2'
      } else if (this.type && this.type === 'appeal') {
        this.invoiceType.invoiceType = '3'
        this.queryParam.invoiceType = '3'
        this.uploadData.invoiceType = '3'
        this.detailsData.invoiceType = '3'
      }
    },
    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingExport = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/distribution/invoice/export',
          '配送商发票',
          true
        ).then(doc => {
          this.loadingExport = false
        })
      }
    },
    setRouterState () {
      // 设置路由返回值
      let parmPath = '/auditManage/estateAudit/PerfessionWrap#detail'
      if (this.type && this.type === 'supple') {
        parmPath = '/auditManage/supplement/PerfessionSupple#detail'
      } else if (this.type && this.type === 'appeal') {
        parmPath = '/auditManage/appeal/PerfessionAppeal#detail'
      }
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
        parmPath
      )
      window.addEventListener('popstate', callback)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    tableSearch () {
      // 表格查询
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleChangeStatus (value) {
      // 更改状态
      this.queryParam.status = value.join()
    },
    getInvoiceSeller () {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },
    sellerChange (value, option) {
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.getBuyerData(param)
    },
    getBuyerData (param) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.buyerData = res.data
      })
    },
    // handleBuy (buyer) {
    //   this.buyerData.map(item => {
    //     if (item.name.indexOf(buyer)) {
    //       this.queryParam.cusCode = item.code
    //     }
    //   })
    // },
    imgRecogClear () {
      // 清除图片上传数据
      this.fileList = []
      this.imgUploadList = []
    },
    beforeUpload (file, fileList) {
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
    beforeUploadExcel (file) {
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
    uploadChangeExcel ({ file, fileList }) {
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
          this.$router.push({ name: 'InvoiceFile' })
        }
      }
    },
    uploadChange ({ file, fileList }) {
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
              this.imgUploadList.push(this.fileList[j].response.data[0])
            }
          }
          if (this.fileList.length !== 0) {
            this.setRouterState()
            this.pageIndex = false
            this.pageScan = false
            this.pageImg = true
            this.pageManual = false
            this.pageDetails = false
            this.fileList = []
            this.setEstate()
          }
        }
      }
    },
    downloadTemplate () {
      // 下载模板
      const downloadParam = 'model=invoice&type=excel'
      fetchTemplate(downloadParam).then(res => {
        window.location.href = res.data
      })
    },
    handleDetails (text, record) {
      // console.info('record====', record)
      // 添加明细
      // console.log(record);
      this.detailsData = {
        ...this.detailsData,
        invoiceId: record.id,
        status: record.status,
        verifyStatus: record.verifyStatus,
        verifyErrCode: record.verifyErrCode,
        verifyErrMsg: record.verifyErrMsg,
        distribution: record.distribution
      }
      // this.setRouterState()
      // this.pageIndex = false
      // this.pageScan = false
      // this.pageImg = false
      // this.pageManual = false
      // this.pageDetails = true
      // this.$emit('DetailInfo')
      const params = {
        addType: 'estate',
        verifyStatus: record.verifyStatus,
        parentCom: 'PerfessionWrap'
      }
      setStore('EstateInfo', params)
      setStore('AUDITEDIT', {})
      setStore('estateDetail', this.detailsData)
      const paramId = {
        InvoiceId: record.id,
        distribution: record.distribution,
        verifyStatus: record.verifyStatus,
        verifyErrCode: record.verifyErrCode,
        verifyErrMsg: record.verifyErrMsg,
        inStatus: record.inStatus,
        distCode: record.distCode
      }
      setStore('EstateId', paramId)
      this.$router.push({
        name: 'PerfessionWrap_Detail'
      })
    },
    scanBack () {
      // 扫码返回
      this.pageIndex = true
      this.pageScan = false
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = false
      this.$emit('ListBack')
      // this.$refs.table.refresh(true)
    },
    manualUpload () {
      // 手工录入
      // this.setRouterState()
      // this.pageIndex = false
      // this.pageScan = false
      // this.pageImg = false
      // this.pageManual = true
      // this.pageDetails = false
      const params = {
        isEdit: true
      }
      this.setEstate()
      setStore('AUDITEDIT', JSON.stringify(params))
      this.$router.push({
        name: 'PerfessionWrap_Edit'
      })
    },
    scanUpload () {
      // 扫码添加
      // this.setRouterState()
      this.pageIndex = false
      this.pageScan = true
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = false
      this.setEstate()
    },
    setEstate () {
      const params = {
        addType: 'estate',
        parentCom: 'PerfessionWrap'
      }
      setStore('EstateInfo', JSON.stringify(params))
      // window.localStorage.setItem('EstateAdd', JSON.stringify(params))
    },
    handleSearch () {
      // 展开搜索
      this.isShowSearch = true
    },
    onSearchClose () {
      // 关闭搜索
      this.isShowSearch = false
    },
    handlePicker (date, dateString) {
      // 日期选择
      this.queryParam.beginInDate = dateString[0]
      this.queryParam.endInDate = dateString[1]
    },
    onSelect (record, selected, selectedRows) {
      // 勾选选中
    },
    onSelectAll (selected, selectedRows, changeRows) {
      // 全选
    },
    showConfirm (text, record) {
      if (record.isVoid) {
        record.isVoid = false
      }
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
    toVoid (text, record) {
      // 作废
      const param = {
        id: record.id
      }
      EstateDel(param).then(res => {
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '提示',
            description: '作废成功！',
            duration: 4
          })
          this.$refs.table.refresh(false)
        } else {
          this.$notification['error']({
            message: '提示',
            description: res.message || '作废成功！',
            duration: 4
          })
        }
      })
    },
    deleteTableData (text, record) {
      // 删除
      const param = {
        invoice: {
          id: record.id,
          status: 99
        }
      }
      EstateDel(param).then(res => {
        this.$refs.table.refresh(false)
        this.$notification['success']({
          message: '提示',
          description: '删除成功！',
          duration: 4
        })
      })
    },
    resetSearchForm () {
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
        status: '1,3',
        distribution: ''
      }
      this.dateSelected = []
      this.buyerData = []
      this.statusTable = [1, 3]
    }
  },
  watch: {

  }
}
</script>
<style lang="less" scoped>
/*红蓝票样式*/

.invoiceStatusTable1 {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  margin-right: 5px;
  top: -3px;
  background: #4e9df9;
}
.invoiceStatusTable2 {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  margin-right: 5px;
  top: -3px;
  background: #e17877;
}
/*空数据*/
.scanEmpty {
  width: 100%;
  text-align: center;
  padding: 68px 160px;
  margin-top: 100px;
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
}
//客户名称未授权图标样式
.cusName-Icon{
  .iconfont{
    cursor: pointer;
    font-size: 18px;
    line-height: 22px;
    float: left;
    color: #CFCFCF;
    margin: 0 4px 0 0;
    display: inline-block;
    &.icon-allauthorized{
      color: rgba(96, 198, 151, 1);
    }
  }
}
  /*// tab 按钮样式*/
  /*.estateBtn{*/
  /*  position: absolute;*/
  /*  top: -70px;*/
  /*  right: 24px;*/
  /*}*/
.text-red{ color:#e17877; }
</style>
