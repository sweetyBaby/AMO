<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>关账设置</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新增关账设置</span>
                </template>
                <i class="iconfont icon-plus" />
              </a-tooltip>
            </span>
            <!--            <span class="titleBtn" @click="handleSearch()">-->
            <!--              <a-tooltip placement="top">-->
            <!--                <template slot="title">-->
            <!--                  <span>展开搜索</span>-->
            <!--                </template>-->
            <!--                <i class="iconfont icon-search" />-->
            <!--              </a-tooltip>-->
            <!--            </span>-->
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
              <label for>库位名称</label>
              <a-input placeholder="输入库位名称" style="width: 100%" v-model="queryParam.code" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="searchReset">重置</a-button>
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
        :locale="{ emptyText: emptyText }"
      >
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn" v-if="record.type !== 2 && isEdit(record)">
            <template slot="title">
              <a @click="handleAdd(record)">
                <i class="iconfont icon-table-edit"></i>编辑
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore"></i>
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
    <add-close
      :visible="isAddClose"
      v-if="isAddClose"
      @handleClose="handleClose"
      @handleSubmit="handleSubmit"
      :editData="editData">
    </add-close>
  </a-card>
</template>

<script>
import moment from 'moment'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { DataFilter } from '@/utils/storage'
import { STable } from '@/components'
import { closeList } from '@/api/basicInfo/hosData'
import AddClose from './modules/AddClose'
export default {
  name: 'CloseAccount',
  components: {
    DhEmpty,
    STable,
    AddClose
  },
  data () {
    return {
      columns: [
        {
          width: 150,
          title: '月份',
          dataIndex: 'month',
          key: 'month',
          customRender: (text, record) => {
            return record.year + '-' + text
          }
        },
        {
          width: 150,
          title: '关账日期',
          dataIndex: 'endTime',
          key: 'endTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          width: 100,
          title: '补传结束日期',
          dataIndex: 'delayTime',
          key: 'delayTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          width: 150,
          title: '申诉结束日期',
          dataIndex: 'appealTime',
          key: 'appealTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          width: 150,
          title: '操作人',
          dataIndex: 'updateBy',
          key: 'updateBy'
        },
        {
          width: 150,
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          width: 150,
          title: '操作',
          dataIndex: 'remark',
          key: 'remark',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return closeList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const tableList = DataFilter(res, 'account')
            this.queryParam.size = res.data.pageSize
            return tableList
          }
        )
      },
      isAdd: false,
      isEmpty: false,
      isShowSearch: false,
      queryParam: {
        page: 1,
        size: 10
      },
      emptyText: <dh-empty />,
      isAddClose: false,
      editData: {}
    }
  },
  methods: {
    moment,
    handleAdd (record) {
      this.isAddClose = true
      if (record) {
        this.editData = record
        this.editData.title = '编辑关账设置'
      } else {
        this.editData.title = '新增关账设置'
      }
    },
    isEdit (record) {
      if (
        moment(record.year + '-' + record.month).isAfter(moment().endOf('month')) ||
        (moment(record.month).isSame(moment().format('MM')) && Number(moment().format('DD')) < 16)
      ) {
        return true
      }
      return false
    },
    handleClose () {
      this.isAddClose = false
    },
    handleSubmit (val) {
      this.isAddClose = false
      this.$refs.table.refresh(true)
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handleSearch () {
      this.$refs.table.refresh(true)
      this.isShowSearch = true
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    retriveTable () {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    searchReset () {
      this.queryParam.date = null
    }
  }
}
</script>

<style lang="less" scoped>
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
