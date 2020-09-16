<template>
  <a-card :bordered="false" v-if="pageIndex">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ redReverseData.title }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加红冲销量</span>
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
        width="340">
        <a-form layout="inline">
          <div class="searchWrap">
            <div class="searchList">
              <label for>经销商名称</label>
              <a-select showSearch placeholder="请选择经销商名称" optionFilterProp="children" :filterOption="filterOption" v-model="queryParam.distCode">
                <a-select-option :value="item.distCode" v-for="(item,index) in distList" :key="index">{{ item.distName }}</a-select-option>
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
              <label for>出库单凭证上传入口</label>
              <a-form-item style="width: 100%" has-feedback>
                <a-select
                  placeholder="选择上传入口"
                  style="width: 100%"
                  v-model="queryParam.voucherStatus"
                  optionFilterProp="children"
                  showSearch
                  :getPopupContainer="triggerNode => triggerNode.parentNode">
                  <a-select-option v-for="(item,key) in upFromList" :value="item.code" :type="item.type" :key="key">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="searchList">
              <label for>红冲销量月份</label>
              <a-input v-model="queryParam.salesMoth" placeholder="请输入红冲销量月份" style="width: 100%;" />
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
        :pageSize="queryParam.size">
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
        <span slot="voucherCom" slot-scope="text, record">
          <a-tooltip placement="top" :title="text">
            <span class="serialName">{{ text }}</span>
          </a-tooltip>
          <a-tag color="cyan" v-if="record.voucherStatus === '2'">补传</a-tag>
          <a-tag color="blue" v-if="record.voucherStatus === '3'">申诉</a-tag>
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
  <a-card :bordered="false" v-else-if="pageAdd">
    <voucherAdd @voucherDetails="handleBack" :voucherStatus="voucherStatus" @type="type"></voucherAdd>
  </a-card>
  <a-card :bordered="false" v-else-if="pageDetails">
    <voucherDetails :detailsData="detailsData" @back="handleBack" @type="type"></voucherDetails>
  </a-card>
</template>

<script>
import {
  userDistRange
} from '@/api/depot/wareHouse'
import {
  STable
} from '@/components'
import {
  DataFilter,
  exportTable,
  BtnShow,
  exportTabList
} from '@/utils/storage'
import {
  outVoucherList,
  outVoucherUpdate
} from '@/api/auditManage/outVoucher'
import voucherAdd from './modules/voucherAdd'
import voucherDetails from './modules/voucherDetails'
import moment from 'moment'

const typeData = [{
  code: '01',
  name: '进货入库'
},
{
  code: '02',
  name: '退货入库'
},
{
  code: '03',
  name: '换货入库'
},
{
  code: '04',
  name: '调拨入库'
},
{
  code: '11',
  name: '销售出库'
},
{
  code: '12',
  name: '退货出库'
},
{
  code: '13',
  name: '换货出库'
},
{
  code: '15',
  name: '污损出库'
},
{
  code: '16',
  name: '调拨出库'
},
{
  code: '20',
  name: '库位调拨'
},
{
  code: '30',
  name: '库存上报'
}
]

export default {
  name: 'RedReverseWrap',
  props: ['redReverseData'],
  components: {
    STable,
    voucherAdd,
    voucherDetails
  },
  data() {
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
      columns: [],
      columnsAll: [{
        title: '经销商名称',
        key: 'distName',
        dataIndex: 'distName',
        width: '120px',
        scopedSlots: {
          customRender: 'name'
        }
      },
      {
        title: '客户名称',
        key: 'cusName',
        dataIndex: 'cusName',
        width: '120px',
        scopedSlots: {
          customRender: 'name'
        }
      },
      {
        title: '配送商名称',
        key: 'distName0',
        dataIndex: 'distName0',
        width: '120px',
        scopedSlots: {
          customRender: 'name'
        }
      },

      {
        title: '出入库单号码',
        key: 'docNo',
        dataIndex: 'docNo',
        width: '180px',
        scopedSlots: {
          customRender: 'voucherCom'
        }
      },
      {
        title: '原单号',
        key: 'originOrderNum',
        dataIndex: 'originOrderNum',
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
        title: '红冲销量月份',
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
            return moment(text).format('YYYY-MM-DD HH:mm')
          }
        }
      },
      {
        title: '操作人',
        dataIndex: 'updateBy',
        align: 'left',
        width: 80
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'left',
        width: 80
      },

      ],
      statusTable: [1, 3],
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
        name: '关账'
      }
      ],
      detailsShow: false,
      queryParam: {
        page: 1,
        size: 10,
        docNo: undefined,
        cusName: undefined,
        voucherStatus: undefined,
        beginDocDate: moment().startOf('day').subtract(3, 'month').format('YYYY-MM-DD'),
        endDocDate: moment().startOf('day').format('YYYY-MM-DD'),
        status: '1,3',
        type: this.redReverseData.type
      },
      voucherStatus: {
        voucherStatus: '1'
      },
      upFromList: [{
        code: '1',
        type: '正常',
        name: '正常'
      },
      {
        code: '2',
        type: '补传',
        name: '补传'
      },
      {
        code: '3',
        type: '申诉',
        name: '申诉'
      }
      ],
      tableList: [
        moment()
          .startOf('day')
          .subtract(3, 'month')
          .format('YYYY-MM-DD'),
        moment()
          .startOf('day')
          .format('YYYY-MM-DD')
      ],
      typeData,
      dateSelected: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.type = this.redReverseData.type
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
  created() {
    this.getFirstLoad()
    this.getDistList()
  },
  mounted () {
    if (this.redReverseData.type === 'audit') {
      this.columns = this.columnsAll.filter(item => item.title !== '配送商名称')
    }
  },
  methods: {
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad() {
      this.columns = this.columnsAll.slice(0, 6)
      //   const currentRoute = this.$route.meta.permission[0];
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      // console.log(currentRoute);
      this.btnPermission = BtnShow(currentRoute)
      // console.info('---', BtnShow(currentRoute))
      const _that = this
      if (this.hasPermission('add')) {
        this.columns = this.columns.filter(item => item.title !== '操作')
        if (this.columns.length === 7) {
          // console.info('---', this.columns, columns1)
          this.columns.push({
            title: (
              <div class="ant-table-more">
                <span>操作</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>点击显示全部列</span>
                  </template>
                  <a onClick={_that.handleMore} class="columnMore">
                    <i class="iconfont icon-plus"></i>
                  </a>
                </a-tooltip>
              </div>
            ),
            align: 'center',
            width: '100px',
            scopedSlots: { customRender: 'action' }
          })
        } else {
          // console.info('---', this.columns, columns1)
          this.columns[this.columns.length - 1] = {
            title: (
              <div class="ant-table-more">
                <span>操作</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>点击显示全部列</span>
                  </template>
                  <a onClick={_that.handleMore} class="columnMore">
                    <i class="iconfont icon-plus"></i>
                  </a>
                </a-tooltip>
              </div>
            ),
            align: 'center',
            width: '100px',
            scopedSlots: { customRender: 'action' }
          }
        }
      }
    },
    handleMore () {
      const _that = this
      this.columns = this.columnsAll
      this.columns = this.columns.filter(item => item.title !== '操作')
      if (this.columns.length === this.columnsAll.length) {
        this.columns.push({
          title: (
            <div class="ant-table-more">
              <span>操作</span>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>点击显示简洁列</span>
                </template>
                <a onClick={_that.handleMin} class="columnMore">
                  <i class="iconfont icon-back"></i>
                </a>
              </a-tooltip>
            </div>
          ),
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        })
      } else {
        this.columns[this.columns.length - 1] = {
          title: (
            <div class="ant-table-more">
              <span>操作</span>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>点击显示简洁列</span>
                </template>
                <a onClick={_that.handleMin} class="columnMore">
                  <i class="iconfont icon-back"></i>
                </a>
              </a-tooltip>
            </div>
          ),
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      }
    },
    handleMin () {
      const _that = this
      this.columns = this.columnsAll.slice(0, 6)
      this.columns[this.columns.length - 1] = {
        title: (
          <div class="ant-table-more">
            <span>操作</span>
            <a-tooltip placement="top">
              <template slot="title">
                <span>点击显示全部列</span>
              </template>
              <a onClick={_that.handleMore} class="columnMore">
                <i class="iconfont icon-plus"></i>
              </a>
            </a-tooltip>
          </div>
        ),
        align: 'center',
        width: '100px',
        scopedSlots: { customRender: 'action' }
      }
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 单据类型
    docType(text) {
      let docName = ''
      this.typeData.forEach(item => {
        if (item.code === text) {
          docName = item.name
        }
      })
      return docName
    },
    getDistList() {
      const params = {
        distCode: this.$store.state.user.info.distCode
      }
      userDistRange(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.distList = res.data
        }
      })
    },
    handleExport() {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined,
          type: this.redReverseData.type
        }
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/document/voucher/export',
          '红冲销量导出列表'
        ).then(doc => {
          this.loadingSpin = false
        })
      }
    },
    handleChangeStatus(value) {
      // 更改状态
      this.queryParam.status = value.join()
    },
    showConfirm (record) {
      if (record.reportOrgName === 'system') {
        this.$notification['info']({
          message: '提示',
          description: '系统自动生成的出入库单凭证，经销商不允许作废!',
          duration: 4
        })
        return
      }
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
    toVoid(record) {
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
            description: res.message,
            duration: 4
          })
        }
      })
    },
    handlePicker(date, dateString) {
      // 日期选择
      this.queryParam.beginDocDate = dateString[0]
      this.queryParam.endDocDate = dateString[1]
    },
    handleBack() {
      this.pageIndex = true
      this.pageAdd = false
      this.pageDetails = false
      this.$refs.table.refresh(false)
    },
    handleAdd() {
      // 新增红冲销量
      this.$router.push({
        name: 'RedReverse_Edit'
      })
      const params = {
        title: `新增${this.redReverseData.title}`,
        type: 'add',
        voucherStatus: '1',
        parentCom: 'RedReverse',
        distCode: this.$store.state.user.info.distCode,
        redReverseData: this.redReverseData
      }
      window.localStorage.setItem('redReverseDetail', JSON.stringify(params))
    },
    viewDetail(record) {
      const params = {
        title: `${this.redReverseData.title}详情`,
        type: 'detail',
        voucherStatus: '1',
        parentCom: 'RedReverse',
        distCode: this.$store.state.user.info.distCode,
        id: record.id,
        status: record.status,
        docType: record.docType,
        redReverseData: this.redReverseData
      }
      window.localStorage.setItem('redReverseDetail', JSON.stringify(params))
      this.$router.push({
        name: 'RedReverse_Edit'
      })
    },
    tableSearch() {
      // 表格搜索
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    resetCondition() {
      // 重置查询条件
      this.queryParam = {
        page: 1,
        size: 10,
        docNo: '',
        cusName: '',
        beginDocDate: '',
        endDocDate: '',
        status: '1,3',
        voucherStatus: undefined,
        type: this.redReverseData.type
      }
      this.statusTable = [1, 3]
      this.dateSelected = null
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'OutVoucher') {
        this.$nextTick(() => {
          this.$refs.table.refresh(true)
        })
      }
    }
  },
  destroyed() {
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

.serialName {
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
}
</style>
