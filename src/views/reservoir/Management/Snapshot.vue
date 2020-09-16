<template>
  <a-card v-if="!detailShow" :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存快照</h3>
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
            <div class="searchList" style="width: 100%;">
              <label for>快照日期</label>
              <a-date-picker v-model="queryParam.timeFilter" placeholder="请选择快照日期" />
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
        ref="table"
        size="default"
        rowKey="key"
        :pageSize="queryParam.size"
        :locale="{emptyText:emptyText}"
      >
        <span slot="operation" slot-scope="text, record">
          <template>
            <div class="tabBtn">
              <a-popover placement="bottomRight">
                <template slot="content">
                  <p @click="viewDetail(record)">
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
  <a-card :bordered="false" v-else>
    <div class="proNew">
      <snap-modal-detail :detailsData="detailsData" @viewSnapshot="handleBackSnashot()"></snap-modal-detail>
    </div>
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import SnapModalDetail from './modules/SnapModalDetail'
import { SnapshotList } from '@/api/depot/depot'
import moment from 'moment'
import { userDistRange } from '@/api/depot/wareHouse'
export default {
  name: 'Snapshot',
  components: {
    SnapModalDetail,
    STable,
    DhEmpty
  },
  data() {
    return {
      distList: [],
      emptyText: <dh-empty />,
      isEmpty: false,
      isShowSearch: false,
      detailShow: false,
      detailsData: {},
      columns: [
        {
          title: '快照日期',
          key: 'stockDailyDate',
          dataIndex: 'stockDailyDate',
          customRender: text => {
            // return moment(text).format('YYYY-MM-DD HH:mm:ss')
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '经销商代码',
          key: 'distCode',
          dataIndex: 'distCode'
        },
        {
          title: '经销商名称',
          key: 'distName',
          dataIndex: 'distName'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          wdith: '100px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      queryParam: {
        page: 0,
        size: 10,
        distCode: undefined,
        timeFilter: null
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return SnapshotList(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.queryParam.size = res.data.pageSize
            const SnapshotList = DataFilter(res, 'ware')
            return SnapshotList
          }
        )
      }
    }
  },
  created() {
    this.getDistList()
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
    getDistList() {
      const params = {
        distCode: this.$store.state.user.info.distCode
      }
      userDistRange(params).then(res => {
        // console.info('====',res)
        this.distList = res.data
      })
    },
    tableSearch() {
      // 表格搜索
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    resetCondition() {
      // 重置搜索条件
      this.queryParam.timeFilter = null
      this.queryParam.distCode = undefined
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    handleBackSnashot() {
      this.detailShow = false
    },
    viewDetail(record) {
      const _that = this
      const callback = function() {
        _that.detailShow = false
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/reservoir/Management/Snapshot#detail')
      window.addEventListener('popstate', callback)
      this.detailsData = {
        detailsTime: moment(record.stockDailyDate).format('YYYY-MM-DD'),
        distCode: record.distCode
      }
      /* this.detailsData.detailsTime = moment(record.stockDailyDate).format('YYYY-MM-DD');
        this.detailsData.distCode = record.distCode; */
      this.detailShow = true
    }
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
