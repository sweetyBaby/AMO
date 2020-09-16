<template>
  <a-card :bordered="false" v-if="!isAdd">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>医院采购代理出入库</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn">
              <a-popconfirm placement="bottomRight">
                <template slot="title">
                  <a @click="onMudleDown"><i class="iconfont icon-up" />下载模板</a>
                  <a @click="onMudleUp"><i class="iconfont icon-down" />上传模板</a>
                </template>
                <i class="iconfont icon-more" />
              </a-popconfirm>
            </span>

            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加出库</span>
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
              <label for="">输入单据号</label>
              <a-input v-model="queryParam.docNo" placeholder="输入单据号" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for="">客户名称</label>
              <a-input v-model="queryParam.userName" placeholder="输入客户名称" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for="">选择日期</label>
              <a-range-picker @change="handlePicker" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="$refs.table.refresh(true)" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
          </span>

        </a-form>
      </a-drawer>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-right">
              <div class="tabBtn">
                <a-popover placement="bottomRight">
                  <template slot="title">
                    <a @click="handleInfo">
                      <i class="iconfont icon-up" />查看详情
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore" />
                </a-popover>
              </div>
            </div>
          </template>
        </span>
      </s-table>
    </div>
    <depot-empty v-else />
  </a-card>
  <add-new-ware v-else @back="handleBack" :newData="stainedData" />
</template>

<script>
import DepotEmpty from './DepotEmpty'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import { cooperList, delOrg, enableOrg } from '@/api/storage'
import { getServiceList } from '@/api/manage'
import AddNewWare from './modules/OldAddNewWare'
import { getWareList } from '@/api/depot/wareHouse'

const statusMap = {
  0: {
    status: 'error',
    text: '禁用'
  },
  1: {
    status: 'success',
    text: '启用'
  },
}
export default {
  name: 'Delivery',
  components: {
    AddNewWare,
    DepotEmpty,
    STable
  },
  data () {
    return {
      isEmpty: false,
      statusMap,
      isShowSearch: false,
      isAdd: false,
      queryParam: {
        'page': 1,
        'size': 10,
        'docType': '01'
      },
      columns: [
        {
          title: '经销商名称',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '配送商名称',
          dataIndex: 'sendName',
          align: 'center'
        },
        {
          title: '客户名称',
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: '单据日期',
          dataIndex: 'updatedAt',
          align: 'center',
        },
        {
          title: '单据号',
          dataIndex: 'callNo',
          align: 'center'
        },
        {
          title: '单据类型',
          dataIndex: 'status',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'number',
          align: 'center'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getWareList(Object.assign(this.queryParam, parameter)).then(res => {
          const deliveryList = DataFilter(res, 'delivery')
          return deliveryList
        })
      },
      stainedData: {
        title: '医院采购代理出入库',
        type: 'hospital'
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
  watch: {
    $route(to, from) {
      if (to.path === '/reservoir/Depot/Delivery') {
        this.isAdd = false
      }
    }
  },
  methods: {
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handlePicker (date, dateString) {
      console.log(date, dateString)
    },
    onMudleDown () {

    },
    onMudleUp() {

    },
    handleAdd () {
      this.isAdd = true
    },
    handleBack() {
      this.isAdd = false
    },
    handleInfo () {

    }
  }
}
</script>

<style lang="less">
  .searchWrap{
    .ant-drawer-content-wrapper{
      background:rgba(251,251,251,1);
      box-shadow:-3px 0px 6px rgba(0,4,123,0.2);
      .ant-drawer-content{
        background:rgba(251,251,251,1);
        .ant-drawer-header{
          border: none;
          background:rgba(251,251,251,1);
          font-size: 14px;
        }
        .ant-drawer-close{
          .anticon{
            color: rgba(148, 148, 148, 1);
            &:hover{
              color: rgba(62, 77, 168, 1);
            }
          }
        }
        .ant-drawer-body{
          padding: 0 24px 24px 24px;
          height: calc(100% - 54px);
          /*overflow-y: auto;*/
          .searchList{
            padding: 0 0 40px 0;
            label{
              color: rgba(147, 147, 147, 1);
              font-size: 14px;
              line-height: 20px;
              margin: 0 0 8px 0;
              width: 100%;
              display: block;
              small{
                color: rgba(225, 120, 119, 1);
                font-size: 14px;
                padding: 0 4px 0 0;
              }
            }
            .ant-calendar-picker{
              max-width: inherit;
            }
            .ant-input{
              border:1px solid rgba(233,233,233,1);
              border-radius: 4px;
              background: white;
              height: 44px;
              line-height: 44px;
              &.ant-calendar-picker-input{
                line-height: 36px;
              }
            }
            .ant-select-selection{
              height: 44px;
              line-height: 44px;
              .ant-select-selection__rendered{
                line-height: 44px;
              }
            }
            .ant-input-number{
              height: 44px;
              line-height: 44px;
            }
          }
          .ant-form{
            height:  100%;
            padding: 0 0 60px 0;
            .searchWrap{
              height:  100%;
              overflow-y: auto;
            }
            position: relative;
            .table-page-search-submitButtons{
              text-align: center;
              width: 100%;
              position: absolute;
              bottom: 0;
              left: 0;
              .ant-btn{
                width: 130px;
                height: 44px;
              }
            }
          }
        }

      }
    }
  }
  .tabBtn{
    .iconfont{
      font-size: 24px;
      color: rgba(196, 196, 196, 1);
    }
    &:hover{
      .iconfont{
        color: rgba(62, 77, 168, 1)
      }
    }
  }
  .ant-popover-title{
    padding: 0;
    min-width:160px;
    a{
      width: 100%;
      padding: 8px 0 8px 32px;
      color: rgba(147, 147, 147, 1);
      display: inline-block;
      box-sizing: border-box;
      .iconfont{
        font-size: 19px;
        color: rgba(147, 147, 147, 1);
        padding: 0 12px 0 0;
      }
      &:hover{
        background: rgba(246, 246, 248, 1);
        color: rgba(21, 58, 175, 1);
        .iconfont{
          color: rgba(21, 58, 175, 1);
        }
      }
    }
  }
</style>
