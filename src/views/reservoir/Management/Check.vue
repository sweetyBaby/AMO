<template>
  <a-card v-if="!detailsShow" :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存核查</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
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
              <label for>选择经销商</label>
              <a-select
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="queryParam.distCode"
                showSearch
                :filterOption="filterOption">
                <a-select-option
                  v-for="item in distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList" style="width: 100%;">
              <label>快照生成日期</label>
              <a-date-picker v-model="queryParam.timeFilter" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetCondition" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        :locale="{emptyText:emptyText}"
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
              <a-popover placement="bottomRight">
                <template slot="content">
                  <p @click="handleDetail(record)">
                    <i class="iconfont icon-detail" />详情
                  </p>
                </template>
                <i class="iconfont icon-tableMore" />
              </a-popover>
            </div>
          </template>
        </span>
      </s-table>
    </div>
  </a-card>
  <check-details v-else :detailTitleData="detailTitleData" @checkDetailsData="handleDetailBack()" />
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import CheckDetails from './modules/CheckDetails'
import { CheckList } from '@/api/depot/depot'
import { userDistRange } from '@/api/depot/wareHouse'
import moment from 'moment'
const columns = [
  {
    title: '经销商代码',
    dataIndex: 'distCode',
    key: 'distCode'
  },
  {
    title: '经销商名称',
    dataIndex: 'distName',
    key: 'distName'
  },
  {
    title: '快照生成日期',
    dataIndex: 'stockDate',
    key: 'stockDate',
    customRender: text => {
      // return moment(text).format('YYYY-MM-DD HH:mm:ss')
      return moment(text).format('YYYY-MM-DD')
    }
  },
  {
    title: '上报数量',
    key: 'uploadCount',
    dataIndex: 'uploadCount'
  },
  {
    title: '快照数量',
    key: 'sysCount',
    dataIndex: 'sysCount'
  },
  {
    title: '差异数量',
    key: 'diffCount',
    dataIndex: 'diffCount'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'Check',
  components: {
    CheckDetails,
    STable,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty />,
      isEmpty: false,
      isShowSearch: false,
      detailsShow: false,
      detailTitleData: {
        uploadCount: '',
        sysCount: '',
        diffCount: '',
        rate: '',
        distCode: '',
        timeFilter: null
      },
      data: [],
      distList: [],
      columns,
      queryParam: {
        page: 1,
        size: 10,
        distCode: undefined,
        timeFilter: null
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return CheckList(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.queryParam.size = res.data.pageSize
            const CheckList = DataFilter(res, 'ware')
            return CheckList
          }
        )
      }
    }
  },
  created() {
    this.getFirstLogin()
  },
  mounted() {},
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    tableSearch() {
      // 表格搜索
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    resetCondition() {
      // 重置搜索条件
      this.queryParam = {
        ...this.queryParam,
        timeFilter: null,
        distCode: undefined
      }
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    handleDetail(record) {
      const _that = this
      const callback = function() {
        _that.detailsShow = false
        // console.log("销毁")
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/reservoir/Management/Check#detail')
      window.addEventListener('popstate', callback)
      this.detailTitleData = {
        uploadCount: record.uploadCount,
        sysCount: record.sysCount,
        diffCount: record.diffCount,
        rate: record.rate * 100 + '%',
        distCode: record.distCode,
        timeFilter: moment(record.stockDate).format('YYYY-MM-DD')
      }
      this.detailsShow = true
    },
    handleDetailBack() {
      this.detailsShow = false
    },
    getFirstLogin() {
      userDistRange().then(res => {
        // console.info('res-date---',res)
        this.distList = res.data
      })
    }
  }
}
</script>

<style lang="less">
.ant-card-bordered {
  border: none !important;
}
/*.ant-table {*/
/*  .iconfont {*/
/*    font-size: 28px;*/
/*    line-height: 32px;*/
/*    color: #c4c4c4;*/
/*  }*/
/*  .iconfont:hover {*/
/*    color: #3e4da8;*/
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
        position: relative;
        top: 2px;
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
            line-height: 44px;
            .ant-calendar-picker {
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
            .ant-form-item {
              width: 100%;
              margin-right: 0;
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
