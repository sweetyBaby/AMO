<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>失效预警</h3>
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
              <label for>失效日期</label>
              <a-range-picker @change="onChangeDate" format="YYYY-MM-DD" v-model="date" />
              <!-- <a-date-picker format="YYYY-MM-DD" @change="onChangeDate" v-model="date" /> -->
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="clearBtn()">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :locale="{emptyText:emptyText}"
        :rowClassName="rowClassName"
        @change="handleTableChange"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <!-- <a href="javascript:;" @click="deleHostData(record)">
                <i class="iconfont icon-tableEmpty" />删除
              </a>-->
              <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-card-edit" />详情
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <add-failure-warn :details="details" @handleNew="handleChange()" />
  </a-card>
</template>

<script>
import { exportTable, DataFilter, exportTabList } from '@/utils/storage'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { userDistRange } from '@/api/depot/wareHouse'
import moment from 'moment'
import { findProductMo, retriveNameData } from '@/api/basicInfo/hosData'
import { STable } from '@/components'

import { failureWarnLis } from '@/api/unusualRemind'
import notification from 'ant-design-vue/es/notification'
import AddFailureWarn from './modules/AddFailureWarn'
const DateSort = (a, b) => {
  return (moment(a.effectiveDateEnd) - moment(b.effectiveDateEnd))
}
const columns = [
  {
    width: 174,
    title: '经销商名称',
    dataIndex: 'distName',
    key: 'distName'
  },
  {
    width: 162,
    title: '产品型号',
    dataIndex: 'productModel',
    key: 'productModel'
  },
  {
    width: 162,
    title: '批号',
    dataIndex: 'batchNumber',
    key: 'batchNumber'
  },
  {
    width: 162,
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    width: 162,
    title: '失效日期',
    dataIndex: 'effectiveDateEnd',
    key: 'effectiveDateEnd',
    sorter: (a, b) => DateSort(a, b, 'effectiveDateEnd')
  },
  {
    width: 150,
    title: '剩余失效天数',
    dataIndex: 'effectiveNotifyDay',
    key: 'effectiveNotifyDay',
    customRender: (text, record) => {
      return text > 0 ? text : '已过期'
    },
    sorter: (a, b) => {
      return parseInt(a.effectiveNotifyDay) - parseInt(b.effectiveNotifyDay)
    }
  },
  {
    width: 100,
    align: 'center',
    title: '操作',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default {
  name: 'FailureWarn',
  // create生命周期只加载一次
  created () {
    this.reserveProductMo()
    this.getDistList()
  },
  components: {
    STable,
    DhEmpty,
    AddFailureWarn
  },
  data () {
    return {
      details: {},
      modelList: [],
      emptyText: <dh-empty />,
      date: null,
      dateFormat: 'YYYY-MM-DD',
      distList: [],
      loading: true,
      isShowSearch: false,
      loadingSpin: false,
      isEmpty: false,
      tableDatas: [],
      columns: [
        {
          width: 174,
          title: '经销商名称',
          dataIndex: 'distName',
          key: 'distName'
        },
        {
          width: 162,
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel'
        },
        {
          width: 162,
          title: '批号',
          dataIndex: 'batchNumber',
          key: 'batchNumber'
        },
        {
          width: 162,
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName'
        },
        {
          width: 162,
          title: '失效日期',
          dataIndex: 'effectiveDateEnd',
          key: 'effectiveDateEnd',
          sorter: true
        },
        {
          width: 150,
          title: '剩余失效天数',
          dataIndex: 'effectiveNotifyDay',
          key: 'effectiveNotifyDay',
          customRender: (text, record) => {
            return text > 0 ? text : '已过期'
          },
          sorter: true
        },
        {
          width: 100,
          align: 'center',
          title: '操作',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      isAdd: false,
      sortAscend: true,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10
      },
      tableList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return failureWarnLis(Object.assign(this.queryParam, parameter)).then(
          res => {
            const inventoryList = DataFilter(res, 'table')
            this.queryParam.size = res.data.pageSize
            this.tableList = inventoryList
            return inventoryList
          }
        )
      }
    }
  },
  methods: {
    moment,
    handleTableChange (page, filter, sorter) {
      console.info('sorter', sorter)
    },
    DateSort (a, b, columnsKey) {
      // 调接口 传参 sortAscend  columnsKey
      this.queryParam.columnsKey = columnsKey
      this.queryParam.sortAscend = this.sortAscend
      // console.info('this.queryParam----',this.queryParam)
      this.$refs.table.refresh(true)
      this.sortAscend = !this.sortAscend
    },
    rowClassName (record, index) {
      const className = 'light-row'
      if (record.effectiveNotifyDay <= 0) {
        return className
      }
    },
    // 编辑变法
    handleAdd (val) {
      const _that = this
      const callback = function () {
        _that.isAdd = false
        window.removeEventListener('popstate', callback)
      }
      history.pushState(
        null,
        null,
        '/dataRemind/unusualRemind/FailureWarn#detail'
      )
      window.addEventListener('popstate', callback)
      if (val) {
        this.details = val
      } else {
        this.details = []
      }
      this.isAdd = true
    },

    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        // console.log(this.tableList.data)
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/warn/failureWarnList/export',
          '产品失效预警导出列表'
        ).then(doc => {
          this.loadingSpin = false
        })
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
    clearBtn () {
      this.date = null
      this.queryParam = {
        page: 1,
        size: 10
      }
    },
    onChangeDate (date, dateString) {
      console.log(dateString)
      this.queryParam.effectiveDateStart = dateString[0]
	  this.queryParam.effectiveDateEnd = dateString[1]
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    getDistList () {
      const params = {
        distCode: this.$store.state.user.info.distCode
      }
      userDistRange(params).then(res => {
        // console.info('====',res)
        this.distList = res.data
      })
    },
    // 高级搜索的查询
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

    handleChange (val) {
      this.isAdd = val
    }

    // deleSNdata(record) {
    //   this.$confirm({
    //     title: "删除确认",
    //     content: "是否确定删除【" + record.productName + "】医院主数据？",
    //     okText: "确定",
    //     cancelText: "取消",
    //     onOk: () => {
    //       const params = {
    //         id: record.id
    //       };
    //       deleSNData(params).then(res => {
    //         if (res.message === "SUCCESS") {
    //           this.$refs.table.refresh(true);
    //         } else {
    //           notification.error({
    //             message: "错误",
    //             description: "删除失败！"
    //           });
    //         }
    //       });
    //     }
    //   });
    // }
  }
}
</script>

    <style lang="less">
    .light-row{
        td{
            color:red!important
        }
    }
// 表格操作样式
.ant-table-tbody {
  .icon-tableMore {
    color: #939393;
    font-size: 28px;
  }
}
.tabBtn {
  .iconfont {
    font-size: 28px;
    color: rgba(196, 196, 196, 1);
  }
  &:hover {
    .iconfont {
      color: rgba(62, 77, 168, 1);
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
        color: rgba(21, 58, 175, 1);
      }
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

          label {
            color: rgba(147, 147, 147, 1);
            font-size: 14px;
            line-height: 20px;
            margin: 0 0 8px 0;
            width: 100%;
            display: block;
          }
          .ant-calendar-picker {
            max-width: 100%;
          }
          .ant-select {
            height: 44px;
            .ant-select-selection--single {
              height: 44px;
            }
            .ant-select-selection__rendered {
              height: 44px;
              line-height: 44px;
            }
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
</style>
