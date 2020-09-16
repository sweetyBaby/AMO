<template>
  <a-card :bordered="false" v-if="pageIndex">
    <a-spin tip="正在识别中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingExport"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>发票审计</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handlBack()">
              <a-tooltip placement="top" v-model="btn.isBack">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search"/>
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
              <label for>发票号码</label>
              <a-input v-model="queryParam.inNo" placeholder="请输入发票号码" style="width: 100%;"/>
            </div>
            <div class="searchList" style="width: 100%;">
              <label for>审计结果</label>
              <a-form-item style="width: 100%" has-feedback>
                <a-select
                  placeholder="选择审计结果"
                  style="width: 100%"
                  v-model="queryParam.auditResult"
                  optionFilterProp="children"
                  showSearch
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                >
                  <a-select-option
                    v-for="(item,key) in auditTypeList"
                    :value="item.typeCode"
                    :type="item.typeCode"
                    :key="key"
                  >{{ item.typeName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="searchList">
              <label for>审计说明</label>
              <div class="basicInfo">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    placeholder="请选择审计说明"
                    style="width: 100%"
                    v-model="queryParam.auditIntroduction"
                  >
                    <a-select-option
                      v-for="(item,index) in auditInfoList"
                      :key="index"
                      :value="item.typeCode"
                    >{{ item.typeName }}
                    </a-select-option>
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
        :scroll="{x:'2530px', y: 'calc(100vh - 220px)'}"
      >
        <span slot="inNo" slot-scope="text, record">
          <span v-if="record.inStatus === '1'" class="invoiceStatusTable1"></span>
          <span v-else class="invoiceStatusTable2"></span>
          {{ text }}
          <a-tag color="cyan" v-show="record.invoiceType === '2'">补传</a-tag>
          <a-tag color="blue" v-show="record.invoiceType === '3'">申诉</a-tag>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <div>
              <a-popover placement="bottomRight">
                <template slot="content">
                  <p @click="handleDetails(text,record)">
                    <i class="iconfont icon-detail"/>
                    查看详情
                  </p>
                </template>
                <i class="iconfont icon-tableMore"/>
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

  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import {
  invoiceList,
  invoiceUpdate,
  invoiceSeller,
  invoiceBuyer,
  getAuditList,
  getAuditDetail
} from '@/api/auditManage/auditManage'
import { fetchTemplate } from '@/api/depot/depot'
import { DataFilter, exportTable, BtnShow, saveParamsFromStore, getParamsFromStore } from '@/utils/storage'
import Scan from './modules/scan'
import ManualInput from './modules/manualInput'
import ImgRecog from './modules/imgRecog'
import AddDetails from './modules/addDetails'

export default {
  name: 'AuditManage',
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
        { verifyStatus: '02', verifyErrMsg: '验真不通过' },
        { verifyStatus: '03', verifyErrMsg: '验真通过' },
        { verifyStatus: '05', verifyErrMsg: '关账' },
        { verifyStatus: '00', verifyErrMsg: '其他' }
      ],
      auditTypeList: [
        {
          typeCode: '1',
          typeName: '验证结果一致'
        }, {
          typeCode: '2',
          typeName: '系统无法识别'
        }, {
          typeCode: '3',
          typeName: '无法验证'
        }, {
          typeCode: '4',
          typeName: '数据上报问题'
        }, {
          typeCode: '5',
          typeName: '问题销售数据'
        }],
      auditInfoList: [
        {
          typeCode: '1',
          typeName: '发票与查验结果一致'
        }, {
          typeCode: '2',
          typeName: '国税查无此票'
        }, {
          typeCode: '3',
          typeName: '发票已作废'
        }, {
          typeCode: '4',
          typeName: '销货方不一致'
        }, {
          typeCode: '5',
          typeName: '购货方不一致'
        }, {
          typeCode: '6',
          typeName: '产品型号不一致'
        }, {
          typeCode: '7',
          typeName: '数量不一致'
        }, {
          typeCode: '8',
          typeName: '查验结果不一致'
        }, {
          typeCode: '9',
          typeName: '开票日期超过三年'
        }, {
          typeCode: '10',
          typeName: '图片模糊无法识别'
        }, {
          typeCode: '11',
          typeName: '产品型号为空'
        }, {
          typeCode: '13',
          typeName: '当天发票无法验真'
        }, {
          typeCode: '14',
          typeName: '未提供发票照片'
        }, {
          typeCode: '16',
          typeName: '国税查验异常'
        }, {
          typeCode: '21',
          typeName: '超过该张票当天查验次数'
        }],
      auditDetail: [
        '发票与查验结果一致',
        '国税查无此票',
        '发票已作废',
        '销货方不一致',
        '购货方不一致',
        '产品型号不一致',
        '数量不一致',
        '查验结果不一致',
        '开票日期超过三年',
        '图片模糊无法识别',
        '产品型号为空',
        '产品单价不一致',
        '当天发票无法验真',
        '未提供发票照片',
        '系统未找到该发票',
        '国税查验异常（查验异常 (个别地区的部分数据在维护，建议一小时后尝试)）',
        '发票状态非正常',
        '非增值税发票',
        '校验码和开票合计金额不能同时为空',
        '五要素异常参数',
        '超过该张票当天查验次数'],
      upFromList: [
        {
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
        auditId: '',
        initiatorName: '',
        initDateStart: null,
        initDateEnd: null
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
        fileType: 1,
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
      detailsData: {
        invoiceId: '',
        status: '',
        verifyStatus: '',
        verifyErrMsg: ''
      },
      columns: [
        {
          title: '经销商代码',
          dataIndex: 'distCode',
          width: '8%',
        },
        {
          title: '经销商名称',
          dataIndex: 'distName',
          width: '8%',
          scopedSlots: {
            customRender: 'name'
          },
        },
        {
          title: '客户代码',
          dataIndex: 'cusCode',
          width: '8%'
        },
        {
          title: '客户名称',
          dataIndex: 'cusName',
          scopedSlots: {
            customRender: 'name'
          },
          width: '8%'
        },
        {
          title: '省市',
          dataIndex: 'province',
          width: '4%'
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          width: '5%'
        },
        {
          title: '数量',
          dataIndex: 'qty',
          width: '3%',
        },
        {
          title: '单位',
          dataIndex: 'uom',
          width: '3%',
        },
        {
          title: '发票号码',
          dataIndex: 'inNo',
          width: '5%',
        },
        {
          title: '发票日期',
          dataIndex: 'inDate',
          width: '5%',
          customRender: text => {
            if (text !== null) {
              return moment(text).format('YYYY-MM-DD')
            }
          }
        }, {
          title: '不含税总价',
          dataIndex: 'noneTaxTotal',
          width: '5%',
        }, {
          title: '审计结果',
          dataIndex: 'auditResult',
          width: '5%',
          customRender: text => {
            return this.getType(text)
          }
        }, {
          title: '审计说明',
          dataIndex: 'auditIntroduction',
          width: '5%',
          customRender: text => {
            return this.getDetail(text)
          }
        }, {
          title: '审计信息',
          dataIndex: 'auditInfo',
          width: '5%',
        }, {
          title: '税网结果',
          dataIndex: 'taxNetResult',
          width: '5%',
          customRender: (text) => {
            return text === '0' ? '未通过' : '通过'
          }
        }, {
          title: '备注',
          dataIndex: 'remark',
          width: '15%',
        }, {
          title: '操作',
          fixed: 'right',
          width: '6%',
          scopedSlots: {
            customRender: 'action'
          },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getAuditDetail(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.queryParam.size = res.data.pageSize
            const auditManageData = DataFilter(res, 'audit')
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
      pagination: {
        change: this.handlePage
      },
      sellerData: [],
      buyerData: [],
      statusList: [
        { code: 1, name: '正常' },
        { code: 2, name: '作废' },
        { code: 3, name: '重复' }
      ],
      btn: {
        isBack: false,
      }
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
    const AuditInfo = JSON.parse(window.localStorage.getItem('AuditDetail'))
    this.queryParam.auditId = AuditInfo.id
    this.getFirstLoad()
    this.getInvoiceSeller()
  },
  methods: {
    getType (type) {
      // console.info('type===', type)
      switch (type) {
        case '1':
          return '验证结果一致'
          break
        case '2':
          return '系统无法识别'
          break
        case '3':
          return '无法验证'
          break
        case '4':
          return '数据上报问题'
          break
        case '5':
          return '问题销售数据'
          break
        default:
          return null
          break
      }
    },
    getDetail (detail) {
      if (parseInt(detail) > 0) {
        return this.auditDetail[parseInt(detail) - 1]
      }
      return null
    },
    hasPermission (val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad () {
      //   const currentRoute = this.$route.meta.permission[0];
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      // console.log(currentRoute);
      this.btnPermission = BtnShow(currentRoute)
      // console.info('---', BtnShow(currentRoute))
      if (this.hasPermission('down') ||
          this.hasPermission('scan' || this.hasPermission('imgAdd') || this.hasPermission('add'))) {
        this.columns.push({
          title: '操作',
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        })
      }
    },
    handleExport () {
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
    setRouterState () {
      // 设置路由返回值
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
        '/auditManage/auditWrap/AuditManage#detail'
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
      this.$router.push({
        name: 'InvoiceAudit_Detail'
      })
      // console.info('record===', record)
      saveParamsFromStore(record.id, 'AUDITID')
    },
    handlBack () {
      this.$router.push({
        name: 'InvoiceAudit'
      })
      this.btn.isBack = false
      saveParamsFromStore(null, 'AUDITID')
    },
    scanBack () {
      // 扫码返回
      this.pageIndex = true
      this.pageScan = false
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = false
    },
    manualUpload () {
      // 手工录入
      this.setRouterState()
      this.pageIndex = false
      this.pageScan = false
      this.pageImg = false
      this.pageManual = true
      this.pageDetails = false
    },
    scanUpload () {
      // 扫码添加
      this.setRouterState()
      this.pageIndex = false
      this.pageScan = true
      this.pageImg = false
      this.pageManual = false
      this.pageDetails = false
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
    handlePage (page, size) {
      console.info(page, size)
    },
    onSelectAll (selected, selectedRows, changeRows) {
      // 全选
    },
    toVoid (text, record) {
      // 作废
      const param = {
        invoice: {
          id: record.id,
          status: 2,
          cusCode: record.cusCode,
          distCode: record.distCode
        }
      }
      invoiceUpdate(param).then(res => {
        console.log(this.queryParam)
        this.$refs.table.refresh(false)
        this.$notification['success']({
          message: '提示',
          description: '作废成功！',
          duration: 4
        })
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
      invoiceUpdate(param).then(res => {
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
        inNo: '',
        auditResult: undefined,
        auditIntroduction: undefined
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'InvoiceAudit_Edit') {
        const AuditInfo = JSON.parse(window.localStorage.getItem('AuditDetail'))
        this.queryParam.auditId = AuditInfo.id
        // console.info('AuditInfo.id--',AuditInfo.id)
        this.$refs.table.refresh(false)
      }
    }
  },
  destroyed () {
    this.btn.isBack = false
    this.loadingSpin = false
    this.loadingExport = false
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

  /*.ant-table {*/
  /*  .iconfont {*/
  /*    font-size: 28px;*/
  /*    line-height: 32px;*/
  /*    color: #c4c4c4;*/
  /*  }*/
  /*  .iconfont:hover {*/
  /*    color: #3e4da8 !important;*/
  /*  }*/
  /*}*/
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
  .cusName-Icon {
    .iconfont {
      cursor: pointer;
      font-size: 18px;
      line-height: 22px;
      float: left;
      color: #CFCFCF;
      margin: 0 4px 0 0;
      display: inline-block;

      &.icon-allauthorized {
        color: rgba(96, 198, 151, 1);
      }
    }
  }
</style>
