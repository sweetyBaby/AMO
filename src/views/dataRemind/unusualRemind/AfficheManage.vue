<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>公告管理</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加公告</span>
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
              <label for>公告标题</label>
              <a-input placeholder="输入公告标题" style="width: 100%" v-model="queryParam.noticeTitle" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable()">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="() => queryParam = {}">重置</a-button>
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
        :locale="{emptyText:emptyText}">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <template slot="noticeContent" slot-scope="noticeContent">
          <a-tooltip placement="top" :title="noticeContent.replace(/<br\/>/g, '\n')">
            <span class="serialWrap" v-html="noticeContent"></span>
          </a-tooltip>
        </template>
        <span slot="action" slot-scope="text, record">
          <a-popover
            placement="bottomRight"
            overlayClassName="tableBtn"
            v-if="record.noticeStatus=='1'"
          >
            <template slot="title">
              <!-- <a href="javascript:;" @click="deleHostData(record)">
                <i class="iconfont icon-tableEmpty" />忽略
              </a>-->
              <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-detail" />详情
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px;" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <add-affiche-manage :tabletData="tableInfo" @handleNewSN="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { retriveNameData, reserveSNTable, deleSNData } from '@/api/basicInfo/hosData'
import moment from 'moment'
import { retriveAffiche, ignoreFilingWarn } from '@/api/unusualRemind'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'

import notification from 'ant-design-vue/es/notification'
import AddAfficheManage from './modules/AddAfficheManage'
const columns = [
  {
    width: 150,
    title: '公告标题',
    dataIndex: 'noticeTitle',
    key: 'noticeTitle'
  },
  {
    width: 150,
    title: '内容',
    dataIndex: 'noticeContent',
    key: 'noticeContent',
    scopedSlots: {
      customRender: 'noticeContent'
    }
  },
  {
    width: 150,
    title: '公告时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    customRender: (text, record) => {
      return moment(text).format('YYYY-MM-DD')
    }
  },
  {
    width: 150,
    title: '状态',
    dataIndex: 'noticeStatus',
    key: 'noticeStatus',
    customRender: (text, record) => {
      switch (text) {
        case '1':
          return '未发送'
        case '2':
          return '发送中'
        case '3':
          return '已发送'
        default:
      }
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
  name: 'AfficheManage',

  // create生命周期只加载一次
  created() {},
  components: {
    STable,
    AddAfficheManage,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty/>,
      cusList: [],
      date: null,
      distList: [],
      loading: true,
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      columns,
      isAdd: false,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return retriveAffiche(Object.assign(this.queryParam, parameter)).then(
          res => {
            const tableList = DataFilter(res, 'table')
            this.queryParam.size = res.data.pageSize
            return tableList
          }
        )
      }
    }
  },
  methods: {
    moment,

    // 高级搜索的查询
    retriveTable() {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },

    handleSearch() {
      this.isShowSearch = true
    },

    onSearchClose() {
      this.isShowSearch = false
    },

    handleChange() {
      this.isAdd = false
    },

    handleAdd(val) {
      const _that = this
      const callback = function() {
        _that.isAdd = false
        console.log('销毁')
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/dataRemind/unusualRemind/AfficheManage#detail')
      window.addEventListener('popstate', callback)
      if (val) {
        this.tableInfo = val
      } else {
        this.tableInfo = []
      }
      this.isAdd = true
    }
  }
}
</script>

    <style lang="less">
/* 操作的样式 */
/* .action_btn { */
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
          .ant-calendar-picker {
            max-width: 100%;
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
.serialWrap {
  max-width: 140px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: -webkit-box;
   text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
