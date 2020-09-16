<template>
  <div>
    <div class="EstateTitle">
      <div class="icons-list pageTitle-Btn">
        <span class="titleBtn" @click="handleBack()">
          <a-tooltip placement="top">
            <template slot="title">
              <span>返回</span>
            </template>
            <i class="iconfont icon-back" />
          </a-tooltip>
        </span>

        <span class="titleBtn" @click="manualSearch" v-if="(titleData.status !== '2' && titleData.verifyStatus !== '05' && isShowAdd) || (titleData.status !== '2' && titleData.verifyStatus !== '05' && hasPermission('add'))">
          <a-tooltip placement="top">
            <template slot="title">
              <span>手动选择</span>
            </template>
            <a-button :disabled="isEdit">
              <i class="iconfont icon-plus" />
            </a-button>
          </a-tooltip>
        </span>
        <span class="titleBtn" v-if="(titleData.inType < 20 && titleData.status !== '2' && titleData.verifyStatus !== '05' && isShowAdd) || (titleData.status !== '2' && titleData.verifyStatus !== '05' && hasPermission('add'))">
          <a-upload
            action="/amo/upload/file/add"
            :fileList="accompanyList.fileList"
            :showUploadList="false"
            @change="uploadChange"
            :multiple="true"
            :beforeUpload="beforeUploadSui"
            :headers="headerUpload"
            :data="accompanyList.param"
            :disabled="isEdit">
            <a-tooltip placement="top">
              <template slot="title">
                <span>随行单</span>
              </template>
              <a-button :disabled="isEdit">
                <i class="iconfont icon-accompany" />
              </a-button>
            </a-tooltip>
          </a-upload>
        </span>
      </div>
    </div>
    <div class="EstateCon" v-if="!isAllData">
      <EstateEmpty @click="handleUpEstate" :isTitleisTitle="false" />
    </div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="14">
          <h3 class="detailsTitle">{{ titleInfo.auditTitle }}</h3>
        </a-col>
      </a-row>
    </div>
    <!-- 发票信息 -->
    <estate-edit v-if="isAllData && isEdit" :titleDetail="titleData" @addEstate="handleEstSub" />
    <estate-detail v-if="isAllData && !isEdit" :titleDetail="titleData" @addEstate="handleEstSub" @edit="handleEstEdit" />
    <!-- 关联产品 -->
    <div class="addDeatils" v-if=" titleData.status !=='2' && titleData.verifyStatus !== '05' && isShowAdd " v-show="isEmpty">
      <h4>请在下方选择一种方式添加发票明细</h4>
      <div class="scanInfo">
        <div class="scanBor"></div>
        <div class="scanListAudit" @click="manualSearch">
          <span class="scanIcon">
            <i class="iconfont icon-plus" />
          </span>
          <div class="scanMain">
            <h3>手动选择</h3>
            <p>从产品主数据选择</p>
          </div>
        </div>
        <div class="scanBor" v-if="titleData.inType < 20"></div>
        <div class="scanListAudit" v-if="titleData.inType < 20">
          <span class="titleBtn" v-if="titleData.status !== '2' && titleData.verifyStatus !== '05'">
            <a-upload
              action="/amo/upload/file/add"
              :fileList="accompanyList.fileList"
              :showUploadList="false"
              @change="uploadChange"
              :multiple="true"
              :beforeUpload="beforeUploadSui"
              :headers="headerUpload"
              :data="accompanyList.param"
              :disabled="isEdit">
              <span class="scanIcon">
                <i class="iconfont icon-orderIn" />
              </span>
              <div class="scanMain">
                <h3>随行单</h3>
                <p>上传随行单</p>
              </div>
            </a-upload>
          </span>
        </div>
        <div class="scanBor"></div>
      </div>
    </div>
    <div class="invoiceTip" v-if="titleData.verifyErrCode === '2000'">
      <h4>审计异常，异常信息为{{ titleData.verifyErrMsg }}。</h4>
    </div>
    <div class="invoiceTip" v-if="titleData.verifyErrCode === '3000'">
      <h4>审计异常，异常信息为{{ titleData.verifyErrMsg }}， 请新增出库，重新编辑发票信息。</h4>
    </div>
    <!-- 产品明细-->
    <div class="productDetails" v-if="tableData && tableData.length > 0">
      <div>
        <div class="tableTitle">发票产品明细</div>
        <a-table
          :columns="columns"
          :dataSource="tableData"
          rowKey="id"
          class="tableProduct"
          size="default"
          :pagination="pagination"
          @change="handleTableChange">
          <span slot="qty" slot-scope="text, record, index">
            <template>
              <div v-if="(titleData.status !== '2' && titleData.verifyStatus !== '05'&& isShowAdd)||(titleData.status !== '2' && titleData.verifyStatus !== '05' && hasPermission('add'))" class="detailsProduct">
                <span v-show="tableNegative">-</span>
                <a-input style="margin: -5px 0" v-model="record.newQty" @change="changeQty(record)" @blur="blurQty(record)" v-show="detailsDataProp.verifyStatus !== '05'"></a-input>
              </div>
              <div v-else>
                <span v-show="tableNegative">-</span>
                {{ record.qty }}
              </div>
            </template>
          </span>
          <span slot="nonePrice" slot-scope="text, record">
            <template>
              <div v-if="(titleData.status!=='2' && titleData.verifyStatus !== '05'&& isShowAdd) || (titleData.verifyStatus !== '05' && hasPermission('add'))">
                <a-input style="margin: -5px 0" v-model="record.nonePrice" @change="changeNonePrice(record)" @blur="blurNonePrice(record)"></a-input>
              </div>
              <div v-else>{{ record.nonePrice }}</div>
            </template>
          </span>
          <span slot="nonePriceTotal" slot-scope="text, record">
            <template>
              <span v-if="isNaN(record.nonePrice*record.qty)">0</span>
              <span v-else-if="tableNegative">{{ -(record.nonePrice*record.qty).toFixed(7) }}</span>
              <span v-else>{{ (record.nonePrice*record.qty).toFixed(7) }}</span>
            </template>
          </span>
          <span slot="operation" slot-scope="text, record">
            <template>
              <div>
                <a-popover placement="bottomRight" overlayClassName="auditOper">
                  <template slot="content">
                    <a @click="handleDelete(record)">
                      <i class="iconfont icon-tableEmpty"></i>删除
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore"></i>
                </a-popover>
              </div>
            </template>
          </span>
        </a-table>
      </div>
    </div>
    <!--    无码添加-->
    <a-drawer
      title="无码添加"
      placement="right"
      @close="onSearchClose"
      :visible="isShowSearch"
      wrapClassName="searchWrap"
      width="680">
      <add-manul @selectedData="selectedDataManual" :selectedProduct="invoiceDetailsAdd" />
    </a-drawer>
    <!-- 根据单号选择 -->
    <a-modal
      :title="invoiceDetailsAdd.title"
      v-model="invoiceDetailsAdd.invoiceDetailsAdd"
      width="1000px"
      :maskClosable="false"
      :destroyOnClose="true"
      @cancel="addProductCancel"
      @ok="addProductOK">
      <template>
        <InvoiceDetailsAdd :detailsAddData="titleData" @selectedData="selectedData"></InvoiceDetailsAdd>
      </template>
    </a-modal>
    <!--  随行单 -->
    <div class="accompanyList" v-show="titleData.inType < 20 && accompanyList.accompanyShow && accompanyList.fileList.length > 0 ">
      <div class="accompanyTitle">
        <span class="tip">注：最多上传9张</span>随行单
      </div>
      <div class="accompanyUpload">
        <div class="clearfix">
          <a-upload
            action="/amo/upload/file/add"
            listType="picture-card"
            :fileList="accompanyList.fileList"
            @preview="uploadPreview"
            @change="uploadChange"
            :multiple="true"
            :headers="headerUpload"
            :beforeUpload="beforeUploadSui"
            :data="accompanyList.param">
            <div v-if="accompanyList.fileList.length < 9 && titleData.verifyStatus !== '05' && !isEdit">
              <i class="iconfont icon-img"></i>
              <div class="ant-upload-text">点击上传</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="uploadCancel" width="660px" class="imgModal">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DataFilter,
  BtnShow,
  setStore,
  getStore
} from '@/utils/storage'
import {
  CheckList
} from '@/api/depot/depot'
import {
  PerssionDetail,
  estateProAdd,
  estateProDel,
  estateProUpdate,
  invoiceSeller,
  invoiceBuyer,
  deleteImg
} from '@/api/auditManage/auditManage'
import InvoiceDetailsAdd from '../auditWrap/modules/invoiceDetailsAdd'
import AddProductManual from '../auditWrap/modules/addProductManual'
import SelectCusName from '../auditWrap/modules/SelectCusName'
import moment from 'moment'
import AddManul from './modules/AddManual'
import EstateEmpty from './modules/EstateEmpty'
import EstateEdit from './modules/EstateEdit'
import EstateDetail from './modules/EstateDetail'

export default {
  name: 'AddNewEstate',
  components: {
    InvoiceDetailsAdd,
    AddProductManual,
    SelectCusName,
    AddManul,
    EstateEmpty,
    EstateEdit,
    EstateDetail
  },
  props: ['detailsDataProp'],
  data() {
    return {
      auditType: 'add',
      addData: {},
      titleInfo: {},
      isEdit: false,
      isAllData: false,
      errMsg: '',
      keepList: {},
      isShowSearch: false,
      editShow: true,
      invoiceDetailsAdd: {
        invoiceDetailsAdd: false,
        invoiceDetailsAddType: '',
        title: '',
        productAdd: [],
        accompanyShow: false
      },
      tableNegative: false,
      titleDataEdit: {
        timeSelect: null,
        inType: '',
        inStatus: 1
      },
      selectShow: false,
      columns: [{
        title: '产品型号',
        dataIndex: 'productModel',
        key: 'productModel'
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: '单位',
        key: 'uom',
        dataIndex: 'uom'
      },
      {
        title: '数量',
        key: 'qty',
        dataIndex: 'qty',
        width: '160px',
        scopedSlots: {
          customRender: 'qty'
        }
      },
        //   {
        //     title: '单价（不含税）',
        //     key: 'nonePrice',
        //     dataIndex: 'nonePrice',
        //     width: '160px',
        //     scopedSlots: {
        //       customRender: 'nonePrice'
        //     }
        //   },
        //   {
        //     title: '总价（不含税）',
        //     key: 'nonePriceTotal',
        //     dataIndex: 'nonePriceTotal',
        //     scopedSlots: {
        //       customRender: 'nonePriceTotal'
        //     }
        //   }
        // {
        //   title: '操作',
        //   dataIndex: 'operation',
        //   align: 'center',
        //   width: '100px',
        //   scopedSlots: { customRender: 'operation' }
        // }
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      },
      uploadData: {
        fileType: 1,
        uploadType: 1,
        correlationId: ''
      },
      previewVisibleTitle: false,
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
      previewVisible: false,
      previewImage: '',
      accompanyList: {
        param: {
          fileType: 22,
          uploadType: 1,
          correlationId: ''
        },
        fileList: []
      },
      isEmpty: true,
      imgList: [],
      titleData: {
        type: 'add'
      },
      tableData: [],
      sellerData: [],
      buyerData: [],
      turnOn: true,
      queryParam: {
        page: 1,
        size: 10
      },
      uploadStatus: true,
      uploadNumAdd: 0,
      saveStatus: false,
      selectData: {},
      parentStatus: '01',
      btnPermission: [],
      isShowAdd: true
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
    const newData = JSON.parse(JSON.stringify(this.detailsDataProp))
    const titleInfo = JSON.parse(localStorage.getItem('estateDetail'))
    const InvoiceId = getStore('EstateId')
    this.parentStatus = InvoiceId.verifyStatus
    this.titleInfo = titleInfo
    this.addData = newData
    const current = this.$route.path.split('/')
    const currentRoute = current[current.length - 1]
    this.btnPermission = BtnShow(currentRoute)
    if (this.detailsDataProp.verifyStatus !== '05' && this.hasPermission('add')) {
      const index = this.columns.findIndex(item => item.title === '操作')
      if (index === -1) {
        this.columns.push({
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '100px',
          scopedSlots: {
            customRender: 'operation'
          }
        })
      }
    }
    this.titleData.invoiceType = titleInfo.invoiceType
    if (titleInfo.type === 'add') {
      this.titleData = {
        type: 'add',
        addType: titleInfo.addtype,
        distributionInvoiceId: newData.distributionInvoiceId,
        distribution: newData.distribution,
        inStatus: InvoiceId.inStatus,
        invoiceType: titleInfo.invoiceType,
        distCode: InvoiceId.distCode
      }

      if (titleInfo.invoice) {
        this.titleData = {
          ...this.titleData,
          ...titleInfo.invoice
        }
      }
      this.isEdit = true
      this.isAllData = true
      this.auditType = 'add'
      // console.info('----', this.titleData)
    } else {
      // console.info('isDetail-----')
      this.detailsData()
      this.distCode = InvoiceId.distCode
      this.isEdit = false
      this.auditType = 'detail'
    }

    // console.info('newData----', newData)
    if (newData.inType > 19) {
      this.isShowAdd = true
      this.titleData.isShowEdit = true
    } else {
      if (newData.verifyStatus !== '03') {
        this.titleData.isShowEdit = true
      } else {
        this.titleData.isShowEdit = false
      }
      this.isShowAdd = false
    }
    // console.info('newData.isShowAdd====', this.isShowAdd)
  },
  methods: {
    moment,
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    titleImgClose() {
      // 关闭title图片
      this.previewVisibleTitle = false
    },
    viewImgShow() {
      // 查看title图片
      this.previewVisibleTitle = true
    },
    invoiceStatus(item) {
      // 发票状态切换
      if (item.inStatus === '2' && item.inType < 20) {
        this.titleData.negative = true
        this.tableNegative = true
      } else {
        this.titleData.negative = false
        this.tableNegative = false
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    checkStyle(record) {
      if (record.verifyStatus === '03') {
        return 'iconcheckPass'
      } else if (record.verifyStatus === '02') {
        if (record.verifyErrCode === '2000' || record.verifyErrCode === '3000') {
          return 'icon-AuditUnPass'
        }
        return 'iconCheckUnpass'
      } else if (record.verifyStatus === '01') {
        if (record.verifyErrCode === '1108') {
          return 'iconNationTax'
        }
        return 'iconCheckAbnormal'
      }
    },
    changeNonePrice(record) {
      // 单价改变
      record.changeStatusNonePrice = true
    },
    blurNonePrice(record) {
      // 修改单价
      if (record.changeStatusNonePrice) {
        record.changeStatusNonePrice = false
        if (record.nonePrice < 0 || isNaN(record.nonePrice)) {
          this.$notification['error']({
            message: '保存失败',
            description: '单价格式错误',
            duration: 4
          })
          return false
        }

        const index = record.nonePrice.indexOf('.')
        if (index !== -1) {
          const str = record.nonePrice.substring(
            index + 1,
            record.nonePrice.length
          )
          if (str.length > 7) {
            record.nonePrice = parseFloat(record.nonePrice).toFixed(7)
          }
        }
        const param = {
          id: record.id,
          nonePrice: record.nonePrice
        }
        estateProUpdate(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '修改成功',
              duration: 4
            })
          }
        })
      }
    },
    changeQty(record) {
      // 数量改变
      record.changeStatusQty = true
    },
    blurQty(record) {
      // 修改数量
      if (record.changeStatusQty) {
        record.changeStatusQty = false
        const param = {
          id: record.id,
          qty: record.newQty
        }
        if (!/^\d+$/.test(record.newQty)) {
          if (record.newQty < 0 || isNaN(record.newQty)) {
            this.$notification['error']({
              message: '保存失败',
              description: '数量格式错误',
              duration: 4
            })
          } else {
            this.$notification['error']({
              message: '保存失败',
              description: '数量不能为空',
              duration: 4
            })
          }
          this.detailsData()
          return false
        }
        if (record.newQty === 0) {
          this.tableNegative = false
        } else {
          const InvoiceId = JSON.parse(window.localStorage.getItem('EstateId'))
          if (InvoiceId.inStatus === '1') {
            this.tableNegative = false
          } else {
            this.tableNegative = true
          }
        }
        estateProUpdate(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '修改成功',
              duration: 4
            })
            this.detailsData()
          } else {
            this.$notification['error']({
              message: '提示',
              description: res.message || '修改失败',
              duration: 4
            })
            record.newQty = record.qty
          }
        })
      }
    },
    disabledDate(current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    onSearchClose() {
      // 关闭手动添加
      this.isShowSearch = false
    },
    beforeUploadSui(file, fileList) {
      // 随行单上传前回调
      const num = 9 - this.accompanyList.fileList.length
      this.uploadStatus = true
      if (fileList.length > num) {
        this.uploadNumAdd++
      }
      if (this.uploadNumAdd === fileList.length && fileList.length > num) {
        this.$notification['error']({
          message: '上传失败',
          description: '上传文件总数量不能大于9！',
          duration: 4
        })
      }
      if (fileList.length > num) {
        this.uploadStatus = false
        return false
      }
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
    beforeUpload(file, fileList) {
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
    handleTableChange(pagination) {
      // 表格翻页
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.detailsData()
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
        const param = {
          code: this.titleData.distCode,
          type: this.titleData.distType
        }
        this.getBuyerData(param)
      })
    },
    sellerChange(value, option) {
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.titleData.cusCode = undefined
      this.getBuyerData(param)
    },
    // 选择购货方弹框
    handleSelectCus() {
      if (this.titleData.distCode) {
        this.selectShow = true
        this.selectData = {
          distCode: this.titleData.distCode,
          cusKey: 0,
          cusCode: this.titleData.cusCode,
          cusName: this.titleData.cusName
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请先选择销货方！',
          duration: 4
        })
      }
    },
    // //发票数据
    // selectData(){
    //   return{
    //     distCode: this.titleData.distCode,
    //     cusKey: 0,
    //     cusCode: this.titleData.cusCode
    //   }
    // },
    handleSelectOk(subVal) {
      this.titleData.cusCode = subVal.cusCode
      this.titleData.cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle() {
      this.selectShow = false
    },
    getBuyerData(param) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.buyerData = res.data
      })
    },
    handleDelete(record) {
      // 发票产品删除
      const param = {
        id: record.id
      }
      estateProDel(param).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '提示',
            description: '删除成功',
            duration: 4
          })
          this.detailsData()
        }
      })
    },
    addProductCancel() {
      // 取消添加产品
      this.invoiceDetailsAdd.productAdd = []
    },
    addProductOK() {
      // 确认添加产品
      if (this.invoiceDetailsAdd.productAdd.length < 1) {
        this.invoiceDetailsAdd.invoiceDetailsAdd = false
        return false
      }
      // console.info('this.titleData====', this.titleData)
      const param = {
        invoiceId: this.titleData.id,
        list: this.invoiceDetailsAdd.productAdd
      }
      // console.info('param===', param)
      estateProAdd(param).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '提示',
            description: '添加成功',
            duration: 4
          })
          this.invoiceDetailsAdd.productAdd = []
          this.detailsData()
        } else {
          this.$notification['error']({
            message: '错误提示',
            description: res.message || '添加失败',
            duration: 4
          })
        }
        this.invoiceDetailsAdd.invoiceDetailsAdd = false
        this.isShowSearch = false
      })
    },
    selectedDataManual(data) {
      // console.info('data====', data)
      // 手动添加
      this.invoiceDetailsAdd.productAdd = data
      this.addProductOK()
    },
    selectedData(data) {
      // 添加产品
      this.invoiceDetailsAdd.productAdd = data
    },
    accordCode() {
      if (this.isEdit) {
        this.$notification['info']({
          message: '提示',
          description: '请先保存发票或附件信息，再关联产品',
          duration: 4
        })
      } else {
        // 单号添加详情
        this.invoiceDetailsAdd.invoiceDetailsAdd = true
        this.invoiceDetailsAdd.invoiceDetailsAddType = 'accordCode'
        this.invoiceDetailsAdd.title = '根据单号'
      }
    },
    manualSearch() {
      if (this.parentStatus === '03' || this.parentStatus === '05') {
        // console.info('ID====', this.titleData)
        if (this.isEdit && !this.titleData.id) {
          this.$notification['info']({
            message: '提示',
            description: '请先保存发票或附件信息，再关联产品',
            duration: 4
          })
        } else {
          // 手动添加详情
          this.isShowSearch = true
          this.invoiceDetailsAdd = {
            visible: true,
            invoiceDetailsAddType: 'manual',
            title: '手动选择',
            inType: this.titleData.inType
          }
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '主发票只有验真通过后，附件产品才可关联!',
          duration: 4
        })
      }
    },
    isEmptyData(str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    handleSave() {
      // 保存数据

    },
    detailsData() {
      const invoiceParam = JSON.parse(localStorage.getItem('estateDetail'))
      // console.info('this.titleData', this.titleData)
      // 获取详情信息
      const param = {
        invoice: {
          id: invoiceParam.invoiceId ? invoiceParam.invoiceId : this.titleData.id
        },
        invoiceProducts: {
          pageNum: this.queryParam.page,
          pageSize: this.queryParam.size
        }
      }
      PerssionDetail(param).then(res => {
        this.titleData = res.data.invoice
        // console.info('setTimeout---', res.data.invoice, 'this.titleData---', this.titleData)
        if (res.data.invoiceFileList !== null && res.data.invoiceFileList.length > 0) {
          const fileId = res.data.invoiceFileList.map(item => {
            return {
              uid: item.id,
              name: item.fileName,
              status: 'done',
              url: item.fileUrl,
              fileUrl: item.fileUrl
            }
          })
          // console.info('fileId===', fileId)
          this.titleData.fileId = fileId
          this.titleData.imgId = fileId.map(item => item.uid).toString()
          this.titleData.fileUrl = (res.data.invoiceFileList.length > 0) ? res.data.invoiceFileList[0].fileUrl : null
          this.titleData.imgShow = true
        } else {
          this.titleData.imgShow = false
        }
        const InvoiceId = JSON.parse(window.localStorage.getItem('EstateId'))
        if (res.data.invoice.inStatus === '1' || res.data.invoice.noneTaxTotal === 0 || res.data.invoice.inType >=
                    20) {
          this.titleData.negative = false
        } else {
          this.titleData.negative = true
        }

        if (InvoiceId.inStatus === '1') {
          this.tableNegative = false
        } else {
          this.tableNegative = true
        }
        if (res.data.invoice.hosAuthFlag === '2') {
          this.titleData.authorize = 'hasNo'
        } else {
          this.titleData.authorize = 'has'
        }
        this.accompanyList.param.correlationId = this.titleData.id
        this.uploadData.correlationId = this.titleData.id
        this.accompanyList.fileList = []
        if (res.data.accompanyFileList !== null && res.data.accompanyFileList !== '') {
          this.accompanyList.accompanyShow = true
          const currentList = res.data.accompanyFileList
          for (let i = 0; i < currentList.length; i++) {
            this.accompanyList.fileList.push({
              uid: currentList[i].id,
              id: currentList[i].id,
              name: currentList[i].fileName,
              status: 'done',
              url: currentList[i].fileUrl
            })
          }
        } else {
          this.accompanyList.accompanyShow = false
        }
        this.titleDataEdit.timeSelect = moment(this.titleData.inDate)
        this.titleDataEdit.inStatus = this.titleData.inStatus
        this.titleDataEdit.inType = this.titleData.inType
        this.tableData = res.data.invoiceProducts.list.map(detail => {
          return {
            ...detail,
            newQty: detail.qty
          }
        })
        const pagination = {
          ...this.pagination
        }
        pagination.total = res.data.invoiceProducts.total
        this.pagination = pagination

        if (this.tableData.length < 1) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].qty === null ||
                            this.tableData[i].qty === ''
            ) {
              this.tableData[i].qty = 1
            }
            if (
              this.tableData[i].nonePrice === null ||
                            this.tableData[i].nonePrice === ''
            ) {
              this.tableData[i].nonePrice = 0
            }
          }
        }
        this.keepList = JSON.parse(JSON.stringify(this.titleData))
        this.getKeepType(this.keepList.inType)

        this.isEdit = false
        this.isAllData = true
        this.titleData.isShowEdit = this.hasPermission('add')
        this.titleData.invoiceType = this.addData.invoiceType
        this.getInvoiceSeller()
        this.checkStyle(this.titleData)
      })
    },
    getKeepType(keepType) {
      switch (keepType) {
        case '增值税专用发票':
          this.keepList.inType = '01'
          break
        case '增值税普通发票':
          this.keepList.inType = '04'
          break
        case '增值税普通发票（电子）':
          this.keepList.inType = '10'
          break
        case '机打发票':
          this.keepList.inType = '97'
          break
        case '冠名票':
          this.keepList.inType = '98'
          break
        case '手术植入单':
          this.keepList.inType = '99'
          break
      }
    },
    getType(inType) {
      switch (inType) {
        case '01':
          this.titleData.inType = '增值税专用发票'
          this.titleData.verifyCodeShow = false
          break
        case '04':
          this.titleData.inType = '增值税普通发票'
          this.titleData.verifyCodeShow = true
          break
        case '10':
          this.titleData.inType = '增值税普通发票（电子）'
          this.titleData.verifyCodeShow = true
          break
        case '97':
          this.titleData.inType = '机打发票'
          this.titleData.verifyCodeShow = true
          break
        case '98':
          this.titleData.inType = '冠名票'
          this.titleData.verifyCodeShow = true
          break
        case '99':
          this.titleData.inType = '手术植入单'
          this.titleData.verifyCodeShow = true
          break
      }
    },
    uploadCancel() {
      // 取消
      this.previewVisible = false
    },
    uploadPreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    uploadChange({
      file,
      fileList
    }) {
      if (
        fileList.length ===
                this.uploadNumAdd + this.accompanyList.fileList.length &&
                !this.uploadStatus
      ) {
        this.uploadNumAdd = 0
      }
      if (fileList.length !== 0) {
        for (let i = fileList.length - 1; i >= 0; i--) {
          const size = fileList[i].size / 1024 / 1024
          if (size > 5) {
            fileList.splice(i, 1)
          }
          if (!fileList[i].status) {
            fileList.splice(i, 1)
          }
        }
      }
      if (file.status === 'removed') {
        if (file.id) {
          const param = {
            id: file.id
          }
          deleteImg(param).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '删除成功！',
                duration: 4
              })
            }
          })
        }
      }
      if (fileList.length > 0) {
        for (let i = fileList.length - 1; i >= 0; i--) {
          if (fileList[i].status === 'error') {
            this.$notification['error']({
              message: fileList[i].name + '上传失败',
              description: '网络错误',
              duration: 4
            })
            fileList.splice(i, 1)
          }
        }
      }
      this.accompanyList.fileList = fileList
      const currentList = this.accompanyList.fileList
      if (currentList.length > 0) {
        const index = currentList.length - 1
        for (let k = index; k >= 0; k--) {
          if (currentList[k].status === 'done') {
            if (
              currentList[k].response &&
                            currentList[k].response.code !== 200
            ) {
              this.$notification['error']({
                message: currentList[k].name + '上传失败',
                description: currentList[k].response.message,
                duration: 4
              })
              currentList.splice(k, 1)
            } else if (
              currentList[k].response &&
                            currentList[k].response.code === 200
            ) {
              currentList[k].uid = currentList[k].response.data.id
              currentList[k].id = currentList[k].response.data.id
              currentList[k].url = currentList[k].response.data.fileUrl
            }
          }
        }
      }
      if (this.accompanyList.fileList.length < 1) {
        this.accompanyList.accompanyShow = false
      } else if (this.accompanyList.fileList.length > 0) {
        this.accompanyList.accompanyShow = true
      }
    },
    turnonClick() {
      // 收缩展开
      this.turnOn = !this.turnOn
    },
    editTitleData() {
      this.editShow = true
    },
    handleBack() {
      this.isAllData = false
      // 返回
      this.$emit('details', 'index')
    },
    handleEstSub(val) {
      console.info('0903 val====', val)
      this.titleData = val
      this.detailsData()
      // this.isEdit = false
      // this.isAllData = true
    },
    handleEstEdit() {
      this.titleData.isUpdate = true
      this.isEdit = true
    },
    handleUpEstate() {
      this.titleData = {
        type: 'add'
      }
      this.isAllData = true
    }
  }
}
</script>

<style lang="less" scoped>
.EstateTitle {
    position: absolute;
    top: -56px;
    right: 32px;
}

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

    .iconCheckUnpass,
    .icon-AuditUnPass {
        color: #e17877;
    }

    .iconcheckPass {
        color: #60c697;
    }

    .iconCheckAbnormal {
        color: #fbc773;
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
    padding: 0 32px;

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

    /*详情基本信息*/

    .invoiceTableManual {
        margin-left: 10px;
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
                font-size: 14px;
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
                padding: 12px;
                line-height: 57px;

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
                padding: 0 15px;
                font-size: 14px;
                color: #34353e;
                border-right: 1px solid #e9e9e9;
                border-bottom: 1px solid #e9e9e9;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .rightcell {
                text-align: left;
                padding: 0 20px;
                height: 57px;
                border-right: 1px solid #e9e9e9;
                border-bottom: 1px solid #e9e9e9;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                .viewImg {
                    cursor: pointer;

                    &:hover {
                        color: #3e4da8;
                    }
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
            max-width: 240px;
        }

        &:hover {
            color: #3e4da8;
        }
    }
}

.tableProduct {
    .ant-table-thead {
        >tr:first-child {
            >th:first-child {
                border-top-left-radius: 0 !important;
            }

            >th:last-child {
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
