<template>
  <a-card :bordered="false">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div v-if="!isAdd">
      <div class="pageTitle">
        <a-row :gutter="48">
          <a-col :md="16" :sm="24">
            <h3>{{ title }}</h3>
          </a-col>
          <a-col :md="8" :sm="24">
            <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handleExport()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>导出</span>
                  </template>
                  <i class="iconfont icon-exeptOut" />
                </a-tooltip>
              </span>
              <span
                class="titleBtn"
                @click="handelApproval('','0')"
                v-if="hasPermission('allPass')"
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>批量审批通过</span>
                  </template>
                  <i class="iconfont icon-allPass" />
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>新增拒收申请</span>
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
      <div v-if="!isEmpty">
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
                  placeholder="请选择经销商名称"
                  style="width: 100%"
                  v-model="queryParam.distCode"
                  :filterOption="filterOption"
                  showSearch
                >
                  <a-select-option
                    v-for=" (item,index) in distList"
                    :value="item.distCode"
                    :key="index"
                  >{{ item.distName }}</a-select-option>
                </a-select>
              </div>
              <div class="searchList">
                <label for>输入单据号</label>
                <a-input v-model="queryParam.docNo" placeholder="输入单据号" style="width: 100%;" />
              </div>
              <!-- <div class="searchList">
                <label for>产品型号</label>
                <a-input
                  v-model="queryParam.productModel"
                  placeholder="输入产品型号"
                  style="width: 100%;"
                />
              </div>-->
              <div class="searchList">
                <label for>产品型号</label>
                <a-select
                  showSearch
                  placeholder="请选择产品型号"
                  optionFilterProp="children"
                  :filterOption="filterOption"
                  v-model="queryParam.productModel"
                >
                  <a-select-option
                    :value="item.productModel"
                    v-for="(item,index) in modelList"
                    :key="index"
                  >{{ item.productModel }}</a-select-option>
                </a-select>
              </div>
              <div class="searchList">
                <label for>产品SN</label>
                <a-input
                  v-model="queryParam.serialNumber"
                  placeholder="输入产品SN"
                  style="width: 100%;"
                />
              </div>
              <div class="searchList">
                <label for>申请状态</label>
                <a-select
                  v-decorator="['uom', { rules: [{ required: true, message: '请选择申请状态！', whitespace: true }]}]"
                  placeholder="请选择申请状态"
                  style="width: 100%"
                  v-model="queryParam.applyResult"
                >
                  <a-select-option
                    v-for=" (item,index) in statusList"
                    :value="item.code "
                    :key="index"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </div>

            </div>
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="this.retriveTable" size="small">查询</a-button>
              <a-button style="margin-left: 8px" @click="retriveBtn" size="small">重置</a-button>
            </span>
          </a-form>
        </a-drawer>
        <s-table
          :pageNum="queryParam.page"
          :customRow="handleCheck"
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :pageSize="queryParam.size"
          :locale="{emptyText:emptyText}"
          :rowSelection=" hasPermission('allPass') === true ? {onChange: onSelectChange,selectedRowKeys,getCheckboxProps:getCheckboxProps} : null"
        >
          <span slot="action" slot-scope="text, record">
            <div class="tabBtn" v-if="record.applyResult==='申请中'">
              <a-popover placement="bottomRight" overlayClassName="tableBtn">
                <template slot="title">
                  <a
                    href="javascript:;"
                    @click="handelApproval(record,'0')"
                    v-if="hasPermission('pass')"
                  >
                    <i class="iconfont icon-allApproval" />审批通过
                  </a>
                  <a
                    href="javascript:;"
                    @click="handelApproval(record,'1')"
                    v-if="hasPermission('unpass')"
                  >
                    <i class="iconfont icon-unApproval" />审批拒绝
                  </a>
                </template>
                <span>
                  <i class="iconfont icon-tableMore" style="font-size:28px" />
                </span>
              </a-popover>
            </div>
          </span>
          <!-- <span slot="status" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
            <status-badage :status="text"  :status-map="statusMap" />
          </span>-->

          <template slot="name" slot-scope="name">
            <a-tooltip placement="top" :title="name">
              <span class="serialWrap">{{ name }}</span>
            </a-tooltip>
          </template>
          <template slot="reason" slot-scope="reason">
            <a-tooltip placement="top" :title="reason">
              <span class="serialWrap">{{ reason }}</span>
            </a-tooltip>
          </template>
        </s-table>
      </div>
    </div>
    <add-new-apply
      v-if="isAdd"
      @back="handleBack"
      @handleSubmit="handleSubmit"
      type="refuseAccept"
    />
  </a-card>
</template>

<script>
import DhEmpty from '@/views/comPublic/DhEmpty'
import moment from 'moment'
import { STable, StatusBadage } from '@/components'
import { DataFilter, BtnShow, exportTable, exportTabList } from '@/utils/storage'
import {
  getWareList,
  applySave,
  rejection,
  userDistRange,
  verifyApply
} from '@/api/depot/wareHouse'
import AddNewApply from './modules/AddNewApply'

import { findProductMo } from '@/api/basicInfo/hosData'

const statusMap = {
  0: {
    status: 'error',
    text: '审批中'
  },
  1: {
    status: 'success',
    text: '审批成功'
  }
}

const statusList = [
  {
    code: '0',
    name: '通过'
  },
  {
    code: '1',
    name: '拒绝'
  },
  {
    code: '2',
    name: '申请中'
  }
]

export default {
  name: 'PreApply',
  components: {
    STable,
    AddNewApply,
    StatusBadage,
    DhEmpty,
    BtnShow
  },
  created () {
    // console.log(this.$route.meta.title);
    this.reserveProductMo()
    this.getFirstLoad()
    const params = {
      distCode: this.$store.state.user.info.distCode
    }
    userDistRange(params).then(res => {
      // console.info('====',res)
      this.distList = res.data
    })
  },
  data () {
    return {
      modelList: [],
      title: this.$route.meta.title,
      emptyText: <dh-empty />,
      distList: [],
      isEmpty: false,
      loadingSpin: false,
      statusMap,
      statusList,
      isShowSearch: false,
      isAdd: false,
      isAllot: false,
      queryParam: {
        applyType: 0,
        page: 1,
        size: 10,
      },
      isDocData: true,
      dateFormat: 'YYYY-MM-DD',
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: '经销商名称',
          dataIndex: 'distName',
          align: 'left',
          width: 113
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          align: 'left',
          width: 94
        },
        {
          title: '单据号码',
          dataIndex: 'docNo',
          align: 'left',
          width: 94
        },
        {
          title: '产品SN',
          dataIndex: 'serialNumber',
          align: 'left',
          scopedSlots: {
            customRender: 'name'
          },
          width: 94
        },
        {
          title: '产品批号',
          dataIndex: 'batchNumber',
          align: 'left',
          width: 94
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          align: 'left',
          width: 94
        },
        {
          title: '度数',
          dataIndex: 'degree',
          align: 'left',
          width: 86
        },
        {
          title: '申请状态',
          dataIndex: 'applyResult',
          align: 'left',
          width: 94
        },
        {
          title: '数量/单位',
          dataIndex: 'qty',
          align: 'left',
          customRender: (text, record) => {
            return text + '/' + record.uom
          },
          width: 94
        },

        {
          title: '申请理由',
          dataIndex: 'remark',
          width: 100,
          scopedSlots: {
            customRender: 'reason'
          }
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          width: 100,
          customRender: text => {
            return text ? moment(text).format('YYYY-MM-DD') : ''
          }
        }
      ],
      tableList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return rejection(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.selectedRows = []
            this.selectedRowKeys = []
            const proBackList = DataFilter(res, 'proChange')
            this.queryParam.size = res.data.pageSize
            this.tableList = proBackList
            return proBackList
          }
        )
      },
      stainedData: {
        title: '新增污损置换',
        type: 'stainedOut'
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },

  methods: {
    moment,
    handlePicker (date, dateString) {
      // console.log(date, dateString)
      if (date !== null) {
        this.isDocData = true
        this.queryParam.startDate = dateString[0]
        this.queryParam.endDate = dateString[1]
      }
    },
    reserveProductMo () {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.modelList = res.data
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
          '/amo/dist/product/apply/export',
          '预入库申请拒收导出列表',
          true
        ).then(res => {
          this.loadingSpin = false
        })
      }
    },
    getCheckboxProps (record) {
      return {
        props: {
          disabled: record.applyResult !== '申请中'
        }
      }
    },
    handleCheck (record, index) {
      return {
        on: {
          click: () => {
            if (record.applyResult === '申请中') {
              const checkIndex = this.selectedRowKeys.indexOf(record.id)
              if (checkIndex === -1) {
                this.selectedRowKeys.push(record.id)
                this.selectedRows.push(record)
              } else {
                this.selectedRowKeys.splice(checkIndex, 1)
                this.selectedRows.splice(checkIndex, 1)
              }
            }
          }
        }
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handelApproval (record, num) {
      let altertWindow = true
      if (record === '') {
        if (this.selectedRows.length === 0) {
          altertWindow = false
          this.$notification['error']({
            message: '错误',
            description: '请选择批量通过的信息'
          })
        }
      }

      const content = num === '1' ? '拒绝' : '通过'
      if (altertWindow) {
        this.$confirm({
          title: '审批确认',
          content: '确定审批' + content + '?',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            const params = {
              applyResult: num,
              list: record ? [record] : this.selectedRows
            }
            verifyApply(params).then(res => {
              // console.log(res);
              if (res.message === 'SUCCESS') {
                this.selectedRowKeys = []
                this.selectedRows = []
                this.$refs.table.refresh(true)
              } else {
                this.$notification['error']({
                  message: '错误',
                  description: res.message
                })
              }
            })
          }
        })
      }
    },
    retriveBtn () {
      this.queryParam = {
        ...this.queryParam,
        distCode: undefined,
        docNo: '',
        productModel: undefined,
        serialNumber: '',
        applyResult: undefined
      }
    },
    hasPermission (val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad () {
      //   const currentRoute = this.$route.meta.permission[0];
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      this.btnPermission = BtnShow(currentRoute)
      // console.info("---", this.$route.meta.permission[0]);
      // console.log(this.hasPermission("allPass"));
      if (this.hasPermission('pass') || this.hasPermission('unpass')) {
        this.columns.push({
          width: 100,
          align: 'center',
          title: '操作',
          scopedSlots: {
            customRender: 'action'
          }
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
    retriveTable () {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handlePicker (date, dateString) {
      // console.log(date, dateString);
    },
    onMudleDown () {},
    onMudleUp () {},
    handleAdd () {
      const _that = this
      const callback = function () {
        _that.isAdd = false
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/reservoir/apply/PreApply#detail')
      window.addEventListener('popstate', callback)
      this.isAdd = true
    },
    handleBack () {
      this.isAdd = false
    },
    handleInfo () {},
    handleSubmit () {
      this.isAdd = false
      //   console.info("submit---", values);
      //   applySave(values).then(res => {
      //     console.info("applySave", res);
      //   });
    }
  },
  watch: {
    $route (to, from) {
      // console.log(to, from);
      if (to.name === 'PreApply') {
        this.getFirstLoad()
      }
    }
  },
  destroyed () {
    this.loadingSpin = false
  }
}
</script>

<style lang="less">
.tabBtn {
  .iconfont {
    font-size: 28px;
    color: rgba(196, 196, 196, 1);
  }
  &:hover {
    .iconfont {
      color: rgba(62, 77, 168, 1) !important;
    }
  }
}
.tableBtn .ant-popover-title {
  padding: 0;
  min-width: 160px;
  a {
    width: 100%;
    padding: 8px 0 8px 32px;
    color: rgba(147, 147, 147, 1);
    display: inline-block;
    box-sizing: border-box;
    .iconfont {
      font-size: 19px;
      color: rgba(147, 147, 147, 1);
      padding: 0 12px 0 0;
    }
    &:hover {
      background: rgba(246, 246, 248, 1);
      color: rgba(21, 58, 175, 1);
      .iconfont {
        color: rgba(21, 58, 175, 1) !important;
      }
    }
  }
}
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
          label {
            color: rgba(147, 147, 147, 1);
            font-size: 14px;
            line-height: 20px;
            margin: 0 0 8px 0;
            width: 100%;
            display: block;
            small {
              color: rgba(225, 120, 119, 1);
              font-size: 14px;
              padding: 0 4px 0 0;
            }
          }
          .ant-calendar-picker {
            max-width: inherit;
          }
          .ant-input {
            border: 1px solid rgba(233, 233, 233, 1);
            border-radius: 4px;
            background: white;
            height: 44px;
            line-height: 44px;
            &.ant-calendar-picker-input {
              line-height: 36px;
            }
          }
          .ant-select-selection {
            height: 44px;
            line-height: 44px;
            .ant-select-selection__rendered {
              line-height: 44px;
            }
          }
          .ant-input-number {
            height: 44px;
            line-height: 44px;
          }
        }
        .ant-form {
          height: 100%;
          padding: 0 0 60px 0;
          .searchWrap {
            height: 100%;
            overflow-y: auto;
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
.serialWrap {
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
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
</style>
