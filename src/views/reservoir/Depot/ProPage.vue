<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>问题数据</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
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
              <label for="">出入库单号</label>
              <a-input v-model="queryParam.docNo" placeholder="出入库单号" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for="">处理状态</label>
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择经销商"
                @change="handleDist"
                :value="proWrap.distChange"
              >
                <a-select-option v-for="item in proWrap.statusList" :key="item.distCode" :value="item.distCode">{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for="">上报时间</label>
              <a-range-picker @change="handlePicker" v-model="queryParam.docData" />
            </div>
            <div class="searchList">
              <label for="">是否忽略</label>
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择经销商"
                @change="handleDist"
                :value="proWrap.distChange"
              >
                <a-select-option v-for="item in proWrap.missList" :key="item.distCode" :value="item.distCode">{{ item.distName }}</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="handleSearchR" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
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
            <div class="align-left">
              <div class="tabBtn">
                <a-popover placement="bottomRight" overlayClassName="tableBtn">
                  <template slot="title">
                    <a @click="handleInfo(record)">
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
</template>

<script>
import moment from 'moment'
import DepotEmpty from './DepotEmpty'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import { cooperList, delOrg, enableOrg } from '@/api/storage'
import { getServiceList } from '@/api/manage'
import AddNewWare from './modules/OldAddNewWare'
import { getWareList, addWareData } from '@/api/depot/wareHouse'
import ProDetail from './ProDetail'

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

const missList = [{
  code: 'miss01',
  name: '是'
}, {
  code: 'miss02',
  name: '否'
}]

export default {
  name: 'WareHouse',
  components: {
    AddNewWare,
    DepotEmpty,
    STable,
    ProDetail,
    moment
  },
  data () {
    return {
      isEmpty: false,
      statusMap,
      isShowSearch: false,
      isAdd: false,
      isDetail: false,
      proInfoData: {},
      docData: null,
      queryParam: {
        'page': 1,
        'size': 10,
        'docType': '01'
      },
      columns: [
        {
          title: '出入库单号',
          dataIndex: 'docNo',
          align: 'left'
        },
        {
          title: '经销商名称',
          dataIndex: 'distName',
          align: 'left'
        },
        {
          title: '客户名称',
          dataIndex: 'cusName',
          align: 'left'
        },
        {
          title: '单据日期',
          dataIndex: 'docDate',
          align: 'left',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '单据号',
          dataIndex: 'docNo',
          align: 'left',
        },
        {
          title: '单据类型',
          dataIndex: 'docType',
          align: 'left',
          customRender: (text) => {
            switch (text) {
              case '01' :
                return '进货入库'
                break
              case '02' :
                return '退货入库'
                break
              case '03' :
                return '换货入库'
            }
          }
        },
        {
          title: '数量',
          dataIndex: 'qty',
          align: 'left'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: '100'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getWareList(Object.assign(this.queryParam, parameter)).then(res => {
          const wareList = DataFilter(res, 'ware')
          return wareList
        })
      },
      wareData: {
        title: '增新产品入库',
        type: 'wareIn',
        visible: false
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
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handleSearchR() {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    handleReset() {
      this.queryParam.docNo = ''
      this.queryParam.cusName = ''
      this.queryParam.docData = null
    },
    handlePicker (date, dateString) {
      console.log(date, dateString)
      this.queryParam.docData = date
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
      this.isDetail = false
    },
    handleInfo (val) {
      console.info('val----', val)
      this.proInfoData = val
      this.proInfoData.title = '入库单据详情'
      this.isDetail = true
    },
    // 新增初始化
    getFirstData() {
      const params = {
        'distCode': 'YMD001'
      }
      addWareData(params).then(res => {
        // console.info('res-----',res)
        if (res.message === 'SUCCESS') {
          this.wareData.visible = true
          this.isAdd = true
          this.wareData.Data = res.data
        }
      })
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
      font-size: 28px;
      color: rgba(196, 196, 196, 1);
    }
    &:hover{
      .iconfont{
        color: rgba(62, 77, 168, 1)
      }
    }
  }
  .tableBtn .ant-popover-title{
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
