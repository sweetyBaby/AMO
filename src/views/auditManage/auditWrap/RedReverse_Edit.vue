<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ titleData.title }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top" v-model="detail.isShowTool">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="manualSearch" v-if="!isClosed">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>手动选择</span>
                </template>
                <i class="iconfont icon-plus" />
              </a-tooltip>
            </span>
            <!-- <span class="titleBtn" @click="accordCode" v-if="!isClosed">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>根据单号</span>
                </template>
                <i class="iconfont icon-orderIn" />
              </a-tooltip>
            </span> -->
            <!--          <span class="titleBtn" @click="handleSubmit">-->
            <!--            <a-tooltip placement="top" v-model="detail.isShowSubmit">-->
            <!--              <template slot="title">-->
            <!--                <span>保存</span>-->
            <!--              </template>-->
            <!--              <i class="iconfont icon-save"></i>-->
            <!--            </a-tooltip>-->
            <!--          </span>-->
          </div>
        </a-col>
      </a-row>
    </div>
    <red-reverse-edit v-if="isEdit && isShow" :titleDetail="titleData" @addEstate="handleEstSub" />
    <red-reverse-detail v-if="!isEdit && isShow" :titleDetail="titleData" @addEstate="handleEstSub" @handleType="handleType" @edit="handleEstEdit" />
    <div class="addDeatils" v-show="isEmpty && !isClosed">
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
        <div class="scanBor"></div>
      </div>
    </div>
    <div>
      <!-- 产品明细-->
      <div class="productDetails" v-if="!isEmpty">
        <div>
          <div class="tableTitle">产品明细</div>
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
                <div class="detailsProduct">
                  <span v-if="negative">-</span>
                  <a-input style="margin: -5px 0" v-model="record.newQty" @change="changeQty(record)" @blur="blurQty(record)" :disabled="isClosed"></a-input>
                </div>
              </template>
            </span>

            <span slot="operation" slot-scope="text, record">
              <template>
                <div>
                  <a-popover placement="bottomRight" overlayClassName="auditOper">
                    <template slot="content">
                      <a @click="handleEdit(record)">
                        <i class="iconfont icon-tableEmpty"></i>编辑
                      </a>
                    </template>
                    <i class="iconfont icon-tableMore"></i>
                  </a-popover>
                  <span>|</span>
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
      <a-drawer
        title="手动添加"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        :destroyOnClose="true"
        width="680">
        <add-product-manual @selectedData="selectedDataManual" :selectedProduct="titleData" />
      </a-drawer>
    </div>
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
        <invoice-details-add :detailsAddData="titleData" @selectedData="selectedData" />
      </template>
    </a-modal>
  </a-card>
</template>

<script>
import {
  invoiceSeller,
  invoiceBuyer,
  invoiceAdd,
  invoiceUpdatem
} from '@/api/auditManage/auditManage'
import {
  outVoucherVadd,
  addOutPro,
  outVoucherUpdate,
  deleteOutPro,
  getOutProList,
  outVoucherDetails,
  updateOutPro
} from '@/api/auditManage/outVoucher'
import moment from 'moment'
import SelectCusName from '@/views/auditManage/auditWrap/modules/SelectCusName'
import AddProductManual from './modules/addProductManual'
import RedReverseEdit from './modules/RedReverseEdit'
import RedReverseDetail from './modules/OutVoucherDetail'
import InvoiceDetailsAdd from './modules/invoiceDetailsAdd'
import { getStore } from '@/utils/storage'
const columns = [{
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
  // 操作
]
export default {
  name: 'RedReverseDetails',
  props: ['type'],
  components: {
    AddProductManual,
    RedReverseEdit,
    RedReverseDetail,
    InvoiceDetailsAdd
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    // this.getFirst()
  },
  mounted() {
    this.getFirst()
  },
  data() {
    return {
      titleData: {},
      cusList: [],
      buyerData: [],
      sellerData: [],
      uploadData: {
        fileType: 3,
        uploadType: 1
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
      negative: false,
      accompanyList: {
        fileList: [],
        param: {

        }
      },
      isEmpty: true,
      isShowSearch: false,
      invoiceDetailsAdd: {
        invoiceDetailsAdd: false,
        invoiceDetailsAddType: '',
        title: '',
        productAdd: [],
        accompanyShow: false
      },
      isSave: false,
      tableData: [],
      isEdit: true,
      columns: columns,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      },
      queryParam: {
        page: 1,
        size: 10
      },
      detail: {
        isShowTool: false,
        isShowDrafts: false,
        isShowSubmit: false
      },
      previewVisible: false,
      previewImage: '',
      isShow: false,
      isClosed: false,
      isDel: false
    }
  },
  methods: {
    moment,
    getFirst() {
      const newData = getStore('redReverseDetail')
      this.titleData = {
        ...this.titleData,
        ...newData
      }

      if (newData.id) {
        this.isEdit = false
        this.titleData.id = newData.id
        this.detailsData()
        this.isEdit = false
        if (newData.status === '3') { // 关账
          this.columns = this.columns.filter(item => item.title !== '操作')
          this.isClosed = true
        } else {
          const index = this.columns.findIndex(item => item.title === '操作')
          if (index === -1) {
            this.columns.push({
              title: '操作',
              dataIndex: 'actions',
              width: '100px',
              scopedSlots: { customRender: 'operation' }
            })
          }
          this.isClosed = false
        }
      } else {
        this.isEdit = true
        this.isEmpty = true
        this.tableData = []
        this.isClosed = false
      }
      // 获取销货方
      this.getInvoiceSeller()
      this.getBuyerData({
        code: this.$store.state.user.info.distCode,
        type: 1
      })
      this.isShow = true
    },
    invoiceTypeChange() {
      // 发票类型切换
      if (
        this.titleData.inType === '04' ||
                this.titleData.inType === '10'
      ) {
        this.titleData.verifyCodeShow = true
      } else {
        this.titleData.verifyCode = undefined
        this.titleData.verifyCodeShow = false
      }
    },
    disabledDate(current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
      })
    },
    handleEstSub(val) {
      const newData = JSON.parse(window.localStorage.getItem('redReverseDetail'))
      this.isEdit = false
      this.titleData = {
        ...newData,
        ...val
      }
      this.detailsData()
    },
    handleType(val) {
      // console.info('val====', val)
      this.negative = (val === '02')
    },
    handleEstEdit() {
      this.isEdit = true
    },
    sellerChange(value, option) {
      // console.info('====', option.data.attrs.type )
      this.sellerData.forEach(item => {
        if (item.code === value) {
          this.titleData.distName = item.name
        }
      })
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
    handleChangeCus() {
      const seleCus = this.titleData.cusCode
      this.cusList.forEach(item => {
        if (item.code === seleCus) {
          this.titleData.cusName = item.name
        }
      })
      this.$forceUpdate()
    },
    getBuyerData(param, key) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.cusList = res.data
        this.buyerData = res.data
        this.$forceUpdate()
      })
    },
    // 已授权未授权
    handleAuth() {
      this.titleData.cusCode = undefined
      this.titleData.cusName = ''
    },
    // 发票数据
    selectData() {
      return {
        distCode: this.titleData.distCode,
        cusCode: this.titleData.cusCode
      }
    },
    handleSelectOk(subVal) {
      this.titleData.cusCode = subVal.cusCode
      this.titleData.cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle() {
      this.selectShow = false
    },
    handleDateChange(date, string) {
      this.titleData.timeSelect = moment(string, 'YYYY-MM-DD')
    },
    handleMoment(val) {
      if (val) {
        return moment(val, 'YYYY-MM-DD HH:mm')
      }
      return null
    },
    manualSearch() {
      if (this.isEdit && this.titleData.type === 'add') {
        this.$notification['info']({
          message: '提示',
          description: '还未新增出入库单凭证，不可以关联产品！',
          duration: 2
        })
      } else {
        // 手动添加详情
        this.isShowSearch = true
        // this.invoiceDetailsAdd.invoiceDetailsAdd = true;
        this.invoiceDetailsAdd.invoiceDetailsAddType = 'manual'
        this.invoiceDetailsAdd.title = '手动选择'
      }
    },
    accordCode() {
      if (this.isEdit && this.titleData.type === 'add') {
        this.$notification['info']({
          message: '提示',
          description: '还未新增出入库单凭证，不可以关联产品！',
          duration: 2
        })
      } else {
        // 单号添加详情
        this.invoiceDetailsAdd = {
          invoiceDetailsAdd: true,
          invoiceDetailsAddType: 'accordCode',
          title: '根据单号'
        }
      }
    },
    onSearchClose() {
      // 关闭手动添加
      this.isShowSearch = false
    },
    selectedDataManual(data) {
      // 手动添加
      this.invoiceDetailsAdd.productAdd = data
      this.addProductOK()
    },
    addProductCancel() {
      // 取消添加产品
      this.invoiceDetailsAdd.productAdd = []
    },
    selectedData(data) {
      // 添加产品
      this.invoiceDetailsAdd.productAdd = data
    },
    addProductOK() {
      // 确认添加产品
      if (this.invoiceDetailsAdd.productAdd.length < 1) {
        this.invoiceDetailsAdd.invoiceDetailsAdd = false
        return false
      }
      const param = {
        voucherId: this.titleData.id,
        list: this.invoiceDetailsAdd.productAdd
      }
      addOutPro(param).then(res => {
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
            message: '提示',
            description: res.message,
            duration: 4
          })
        }
        this.invoiceDetailsAdd.invoiceDetailsAdd = false
        this.isShowSearch = false
      })
    },
    detailsData() {
      // 获取详情信息
      const param = {
        ...this.queryParam,
        voucherId: this.titleData.id,
        type: this.type
      }
      getOutProList(param).then(res => {
        this.tableData = res.data.list.map(item => {
          return {
            ...item,
            newQty: item.qty
          }
        })
        this.pagination = {
          ...this.pagination,
          total: res.data.total
        }
        this.isEmpty = !(res.data.list.length > 0)
      })
    },
    handleTableChange(pagination) {
      console.info('pagination===', pagination)
      // 表格翻页
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam = {
        ...this.queryParam,
        page: pagination.current,
        size: pagination.pageSize
      }
      this.detailsData()
    },
    handleTaxChange(e) {
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
    },
    handleBack() {
    //   const newData = JSON.parse(window.localStorage.getItem('redReverseDetail'))
      this.$router.push({
        // name: newData.parentCom
        name: 'RedReverse'
      })
      this.handleReset()
    },
    handleReset() {
      this.isEdit = true
      this.detail = {
        isShowTool: false,
        isShowDrafts: false,
        isShowSubmit: false
      }
      this.tableData = []
      this.isShow = false
      this.titleData = {}
      this.isEmpty = true
      window.localStorage.setItem('redReverseDetail', {})
    },
    handleSubmit() {
      this.handleReset()
    },
    handleDelete(record) {
      if (!this.isDel) {
        // 发票产品删除
        this.isDel = true
        const param = {
          id: record.id
        }
        deleteOutPro(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 4
            })
            this.detailsData()
          }
        })
      } else {
        this.$notification['info']({
          message: '提示',
          description: '数据加载中，请稍后！',
          duration: 4
        })
      }
    },
    changeQty(record) {
      // 数量改变
      record.changeStatusQty = true
    },
    blurQty(record) {
      // console.info(' record====', record)
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
        }
        updateOutPro(param).then(res => {
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
              description: res.message || '修改失败！',
              duration: 2
            })
            record.newQty = record.qty
          }
        })
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
        updateOutPro(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '修改成功',
              duration: 4
            })
          }
        })
      }
    }

  },
  watch: {
    $route(to, from) {
      if (to.name === 'RedReverse_Edit') {
        this.getFirst()
      }
    }
  }
}
</script>

<style lang="less" scoped>
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

    .tablecell {
        >div {
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

                &:hover {
                    color: #3e4da8;
                }

                width: 100%;
                height: 72px;
                display: table-cell;
                text-align: center;
                vertical-align: middle;
                padding: 14px;
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
            position: relative;

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

.detailsProduct {
    position: relative;

    span {
        position: absolute;
        left: 4px;
        z-index: 99;
    }
}
</style>
