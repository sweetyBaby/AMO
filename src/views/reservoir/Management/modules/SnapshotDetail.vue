<template>
  <div>
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
              <label for>度数</label>
              <a-input placeholder="输入度数" style="width: 100%" v-model="queryParam.degree" />
            </div>
            <div class="searchList">
              <label for>产品型号</label>
              <a-select
                showSearch
                placeholder="全部"
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
              <label for>产品状态</label>
              <a-select
                showSearch
                placeholder="请选择产品状态"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.whType"
              >
                <a-select-option
                  :value="item.whTypeCode"
                  v-for="(item,index) in whList"
                  :key="index"
                >{{ item.whTypeDes }}</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="clearBtn()">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table :columns="columns" :data="loadData" :locale="{emptyText:emptyText}" ref="table" :pageSize="queryParam.size"></s-table>
    </div>
  </div>
</template>

<script>
import { userDistRange } from '@/api/depot/wareHouse'
import { retriveLocation } from '@/api/information'
import { findProductMo } from '@/api/basicInfo/hosData'
import DhEmpty from '../../../comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import {
  querySnapshotDailyDetailByCondition,
  fetchWhInfo
} from '@/api/depot/depot'
import moment from 'moment'

export default {
  name: 'SnapshotDetail',
  components: {
    STable,
    DhEmpty
  },
  props: {
    detailsData: {
      type: Object
    }
  },
  data() {
    return {
      whList: [],
      distList: [],
      modelList: [],
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
          key: 'productModel',
          dataIndex: 'productModel'
        },
        {
          title: '批号',
          key: 'batchNumber',
          dataIndex: 'batchNumber'
        },
        {
          title: '度数',
          key: 'degree',
          dataIndex: 'degree',
          customRender: (text) => {
            return text === '1000.0' ? '未知度数' : text
          },
        },
        {
          title: '产品名称',
          key: 'productName',
          dataIndex: 'productName'
        },
        {
          title: '产品状态',
          key: 'whType',
          dataIndex: 'whType'
        },
        {
          title: '产品数量',
          key: 'qty',
          dataIndex: 'qty'
        },
        {
          title: '销售单位',
          key: 'uom',
          dataIndex: 'uom'
        }
      ],
      queryParam: {
        page: 1,
        size: 10,
        distCode: this.detailsData.distCode,
        timeFilter: this.detailsData.detailsTime,
        productType: this.detailsData.productType,
        whType: undefined,
        degree: null
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return querySnapshotDailyDetailByCondition(
          Object.assign(this.queryParam, parameter)
        ).then(res => {
          const SnapshotListDetails = DataFilter(res, 'ware')
          return SnapshotListDetails
        })
      }
    }
  },

  created() {
    // console.log(this.detailsData.productType);
    // this.queryParam.timeFilter = this.detailsData.detailsTime;
    // this.queryParam.distCode = this.detailsData.distCode;
    this.reserveProductMo()
    this.getDistList()
    this.productStates()
  },
  methods: {
    productStates() {
      fetchWhInfo({}).then(res => {
        if (res.message === 'SUCCESS') {
          // console.log(res.data);
          this.whList = res.data.list
        }
      })
    },
    clearBtn() {
      this.queryParam.distCode = undefined
      this.queryParam.degree = null
      this.queryParam.productModel = undefined
      this.queryParam.whType = undefined
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 高级搜索的查询
    retriveTable() {
      if (this.queryParam.productModel === '全部') {
        this.queryParam.productModel = undefined
      }
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleSearch() {
      this.isShowSearch = true
    },
    onSearchClose() {
      this.isShowSearch = false
    },
    reserveProductMo() {
      const params = {
        productType: this.detailsData.productType
      }
      findProductMo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.modelList = res.data
          this.modelList.unshift({
            productModel: '全部'
          })
        }
      })
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
