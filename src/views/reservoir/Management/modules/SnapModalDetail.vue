<template>
  <div v-if="detailTable">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存快照</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
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
                placeholder="全部"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.productType"
              >
                <a-select-option
                  :value="item.productType"
                  v-for="(item,index) in modelList"
                  :key="index"
                >{{ item.productType }}</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetCondition" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :locale="{emptyText:emptyText}"
        ref="table"
        :pageSize="queryParam.size"
      >
        <!-- <span slot="action" slot-scope="text, record">
          <a href="javascript:;">Invite 一 {{record.name}}</a>
          <a-divider type="vertical" />
          <a href="javascript:;">Delete</a>
          <a-divider type="vertical" />
          <a href="javascript:;" class="ant-dropdown-link">
            More actions
            <a-icon type="down" />
          </a>
        </span>-->
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
  </div>
  <div v-else>
    <snapshot-detail :detailsData="detailsObject" @viewSnapshot="handleBackSnashot()" />
  </div>
</template>

<script>
import { getProductType } from '@/api/basicInfo/hosData'
import { userDistRange } from '@/api/depot/wareHouse'
import DhEmpty from '../../../comPublic/DhEmpty'
import { STable } from '@/components'
import SnapshotDetail from './SnapshotDetail'
import { DataFilter } from '@/utils/storage'
import { querySnapshotWithProType } from '@/api/depot/depot'
import moment from 'moment'

export default {
  name: 'SnapModalDetail',
  components: {
    STable,
    SnapshotDetail,
    DhEmpty
  },
  props: {
    detailsData: {
      type: Object
    }
  },
  data() {
    return {
      detailsObject: {},
      modelList: [],
      distList: [],
      isShowSearch: false,
      detailTable: true,
      emptyText: <dh-empty />,
      isEmpty: false,
      isShowSearch: false,
      search: {
        date: '',
        result: ''
      },
      columns: [
        {
          title: '快照日期',
          key: 'stockDate',
          dataIndex: 'stockDate',
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
          title: '产品型号',
          key: 'productType',
          dataIndex: 'productType'
        },
        // {
        //   title: "批号",
        //   key: "batchNumber",
        //   dataIndex: "batchNumber"
        // },
        // {
        //   title: "度数",
        //   key: "degree",
        //   dataIndex: "degree"
        // },
        {
          title: '产品名称',
          key: 'productName',
          dataIndex: 'productName'
        },
        // {
        //   title: "产品状态",
        //   key: "whType",
        //   dataIndex: "whType"
        // },
        {
          title: '产品数量',
          key: 'qty',
          dataIndex: 'qty'
        },
        {
          title: '销售单位',
          key: 'uom',
          dataIndex: 'uom'
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
        distCode: this.detailsData.distCode,
        timeFilter: this.detailsData.detailsTime,
        productType: undefined
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return querySnapshotWithProType(
          Object.assign(this.queryParam, parameter)
        ).then(res => {
          const SnapshotListDetails = DataFilter(res, 'table')
          return SnapshotListDetails
        })
      }
    }
  },
  created() {
    this.reserveProductMo()
    this.getDistList()
    // this.queryParam.timeFilter = this.detailsData.detailsTime;
    // this.queryParam.distCode = this.detailsData.distCode;
  },
  methods: {
    reserveProductMo() {
      const params = {}
      getProductType(params).then(res => {
        if (res.message === 'SUCCESS') {
          // console.log(res.data);
          this.modelList = res.data
          this.modelList.unshift({
            productType: '全部'
          })
        }
      })
    },
    tableSearch() {
      // 表格搜索
      if (this.queryParam.productType === '全部') {
        this.queryParam.productType = undefined
      }
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    resetCondition() {
      // 重置搜索条件
      this.queryParam.distCode = undefined
      this.queryParam.productType = undefined
    },
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
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    handleBackSnashot() {
      this.detailTable = true
    },
    viewDetail(record) {
      // console.log(record);
      const _that = this
      const callback = function() {
        _that.detailTable = true
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(
        null,
        null,
        '/reservoir/Management/Snapshot#detailModal'
      )
      window.addEventListener('popstate', callback)
      this.detailsObject = {
        detailsTime: moment(record.stockDate).format('YYYY-MM-DD'),
        distCode: record.distCode,
        productType: record.productType
      }
      this.detailTable = false
    },
    handleBack() {
      this.$emit('viewSnapshot', false)
    }
  }
}
</script>

<style lang="less">
/* 搜索样式 */

.ant-card-bordered {
  border: none !important;
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

      .ant-drawer-body {
        padding: 0 24px 24px 24px;
        height: calc(100% - 54px);
        /*overflow-y: auto;*/
        .searchList {
          padding: 0 0 40px 0;
          .ant-calendar-picker {
            width: 100%;
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
