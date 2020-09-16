<template>
  <a-card :bordered="false" v-if="pageIndex">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>出入库单凭证申诉</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加出入库单凭证</span>
                </template>
                <i class="iconfont icon-plus"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search"></i>
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
              <label for>经销商名称</label>
              <a-select
                showSearch
                placeholder="请选择经销商名称"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.distCode"
              >
                <a-select-option
                  :value="item.distCode"
                  v-for="(item,index) in distList"
                  :key="index"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>出入库单号</label>
              <a-input v-model="queryParam.docNo" placeholder="请输入出入库单号" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for>客户名称</label>
              <a-input v-model="queryParam.cusName" placeholder="请输入客户名称" style="width: 100%;" />
            </div>
            <div class="searchList" style="width: 100%;">
              <label for>单据日期</label>
              <a-range-picker @change="handlePicker" v-model="dateSelected" />
            </div>
            <div class="basicInfo">
              <label for>状态</label>
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
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetCondition" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        :columns="columns"
        :data="loadData"
        rowKey="key"
        ref="table"
        size="default"
        :pageSize="queryParam.size"
      >
        <span slot="operation" slot-scope="text, record">
          <template>
            <div>
              <a-popover placement="bottomRight" v-model="record.isVoid">
                <template slot="content">
                  <p @click="viewDetail(record)">
                    <i class="iconfont icon-detail"></i>详情
                  </p>
                  <p v-if="record.status !== '2'" @click="showConfirm(record)">
                    <i class="iconfont icon-void"></i>作废
                  </p>
                  <p v-if="record.status === '2'">
                    <i class="iconfont icon-void"></i>已作废
                  </p>
                </template>
                <i class="iconfont icon-tableMore"></i>
              </a-popover>
            </div>
          </template>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card :bordered="false" v-else-if="pageAdd">
    <voucherAdd @voucherDetails="handleBack" :voucherStatus="voucherStatus"></voucherAdd>
  </a-card>
  <a-card :bordered="false" v-else-if="pageDetails">
    <voucherDetails :detailsData="detailsData" @back="handleBack"></voucherDetails>
  </a-card>
</template>

<script>
import { userDistRange } from '@/api/depot/wareHouse'
import { STable } from '@/components'
import { DataFilter, exportTable, BtnShow, exportTabList } from '@/utils/storage'
import { outVoucherList, outVoucherUpdate } from '@/api/auditManage/outVoucher'
import voucherAdd from './modules/voucherAdd'
import voucherDetails from './modules/voucherDetails'
import moment from 'moment'

const typeData = [{
  code: '01',
  name: '进货入库'
}, {
  code: '02',
  name: '退货入库'
}, {
  code: '03',
  name: '换货入库'
}, {
  code: '04',
  name: '调拨入库'
}, {
  code: '11',
  name: '销售出库'
}, {
  code: '12',
  name: '退货出库'
}, {
  code: '13',
  name: '换货出库'
}, {
  code: '15',
  name: '污损出库'
}, {
  code: '16',
  name: '调拨出库'
}, {
  code: '20',
  name: '库位调拨'
}, {
  code: '30',
  name: '库存上报'
}]

export default {
  name: 'OutVoucher',
  components: {
    STable,
    voucherAdd,
    voucherDetails
  },
  data () {
    return {
      btnPermission: [],
      distList: [],
      isShowSearch: false,
      pageIndex: true,
      pageAdd: false,
      pageDetails: false,
      loadingSpin: false,
      detailsData: '',
      isExport: false,
      columns: [
        {
          title: '经销商名称',
          key: 'distName',
          dataIndex: 'distName',
          width: '120px'
        },
        {
          title: '客户名称',
          key: 'cusName',
          dataIndex: 'cusName',
          width: '120px'
        },
        {
          title: '单据日期',
          key: 'docDate',
          dataIndex: 'docDate',
          customRender: text => {
            // return moment(text).format('YYYY-MM-DD HH:mm:ss')
            return moment(text).format('YYYY-MM-DD')
          },
          width: '100px'
        },
        {
          title: '出入库单号码',
          key: 'docNo',
          dataIndex: 'docNo',
          width: '180px'
        },
        {
          title: '单据类型',
          key: 'docType',
          dataIndex: 'docType',
          customRender: text => {
            return this.docType(text)
          },
          width: '100px'
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '70px',
          customRender: text => {
            switch (text) {
              case '1':
                return '正常'
                break
              case '2':
                return '作废'
                break
              case '3':
                return '关账'
                break
            }
          }
        },
        {
          title: '销量月份',
          dataIndex: 'salesYear ',
          width: '100px',
          customRender: (text, record) => {
            if (record.salesYear !== null && record.salesMonth !== null) {
              return record.salesYear + '-' + record.salesMonth
            }
            return null
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '120px',
          customRender: text => {
            if (text !== null) {
              return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        }
      ],
      statusTable: [1, 3],
      statusList: [
        { code: 1, name: '正常' },
        { code: 2, name: '作废' },
        { code: 3, name: '关账' }
      ],
      detailsShow: false,
      queryParam: {
        page: 1,
        size: 10,
        docNo: undefined,
        cusName: undefined,
        beginDocDate: undefined,
        endDocDate: undefined,
        status: '1,3',
        voucherStatus: '3'
      },
      voucherStatus: {
        voucherStatus: '3'
      },
      tableList: [],
      typeData,
      dateSelected: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return outVoucherList(Object.assign(this.queryParam, parameter)).then(
          res => {
            if (res.message === 'SUCCESS') {
              this.isExport = true
              this.queryParam.size = res.data.pageSize
              const ReportingList = DataFilter(res, 'report')
              this.tableList = ReportingList
              return ReportingList
            }
          }
        )
      }
    }
  },
  created () {
    this.getFirstLoad()
    this.getDistList()
  },
  methods: {
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
      if (this.hasPermission('add')) {
        this.columns.push({
          title: '操作',
          dataIndex: 'operation',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        })
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 单据类型
    docType (text) {
      let docName = ''
      this.typeData.forEach(item => {
        if (item.code === text) {
          docName = item.name
        }
      })
      return docName
    },
    getDistList () {
      const params = {
        distCode: this.$store.state.user.info.distCode
      }
      userDistRange(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.distList = res.data
        }
      })
    },
    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/document/voucher/export',
          '出入库单凭证导出列表'
        ).then(doc => {
          this.loadingSpin = false
        })
      }
    },
    handleChangeStatus (value) {
      // 更改状态
      this.queryParam.status = value.join()
    },
    showConfirm (record) {
      if (record.isVoid) {
        record.isVoid = false
      }
      const _that = this
      this.$confirm({
        title: '确认作废该发票?',
        onOk () {
          _that.toVoid(record)
        },
        onCancel () {
        }
      })
    },
    toVoid (record) {
      const param = {
        id: record.id,
        status: 2,
        docNo: record.docNo
      }
      outVoucherUpdate(param).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '提示',
            description: '操作成功！',
            duration: 4
          })
          this.$refs.table.refresh(false)
        } else {
          this.$notification['error']({
            message: '提示',
            description: res.message || '操作失败！',
            duration: 4
          })
        }
      })
    },
    handlePicker (date, dateString) {
      // 日期选择
      this.queryParam.beginDocDate = dateString[0]
      this.queryParam.endDocDate = dateString[1]
    },
    handleBack () {
      this.pageIndex = true
      this.pageAdd = false
      this.pageDetails = false
    },
    handleAdd() {
      // 新增出库单凭证
      this.$router.push({
        name: 'OutVoucherAppeal_Edit'
      })
      const params = {
        title: '新增出入库单凭证申诉',
        type: 'add',
        voucherStatus: '3',
        parentCom: 'OutVoucherAppeal',
        distCode: this.$store.state.user.info.distCode
      }
      window.localStorage.setItem('outVDetail', JSON.stringify(params))
    },
    viewDetail(record) {
      const params = {
        title: '出入库单凭证申诉详情',
        type: 'detail',
        voucherStatus: '3',
        parentCom: 'OutVoucherAppeal',
        distCode: this.$store.state.user.info.distCode,
        id: record.id
      }
      window.localStorage.setItem('outVDetail', JSON.stringify(params))
      this.$router.push({
        name: 'OutVoucherAppeal_Edit'
      })
    },
    tableSearch () {
      // 表格搜索
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    resetCondition () {
      // 重置查询条件
      this.queryParam = {
        ...this.queryParam,
        page: 1,
        size: 10,
        distCode: undefined,
        docNo: '',
        cusName: '',
        beginDocDate: '',
        endDocDate: '',
        status: '1,3',
      }
      this.statusTable = [1, 3]
      this.dateSelected = null
    },
    handleSearch () {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose () {
      // 关闭搜索
      this.isShowSearch = false
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'OutVoucherAppeal') {
        this.$nextTick(() => {
          this.$refs.table.refresh(true)
        })
      }
    }
  },
  destroyed () {
    this.loadingSpin = false
  }
}
</script>

<style lang="less">
.ant-card-bordered {
  border: none !important;
}
.ant-upload {
  width: 100%;
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
            .ant-calendar-picker {
              line-height: 36px;
            }
          }
          .ant-calendar-range-picker-separator {
            vertical-align: inherit;
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
            .ant-select-selection--multiple {
              .ant-select-selection__rendered {
                ul {
                  li {
                    margin-top: 10px;
                  }
                }
              }
            }

            .ant-select-selection {
              background: #fff !important;
              border: 1px solid #ececec !important;
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
</style>
