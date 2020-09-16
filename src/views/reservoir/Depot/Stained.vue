<template>
  <a-card :bordered="false" v-if="!isAdd && !isAllot && !isDetail">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>污损调拨</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
          <div class="icons-list pageTitle-Btn">
            <!--            <span class="titleBtn" @click="handleExport()">-->
            <!--              <a-tooltip placement="top">-->
            <!--                <template slot="title">-->
            <!--                  <span>导出</span>-->
            <!--                </template>-->
            <!--                <i class="iconfont icon-exeptOut" />-->
            <!--              </a-tooltip>-->
            <!--            </span>-->
            <span class="titleBtn" @click="handleAllot()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>污损调拨</span>
                </template>
                <i class="iconfont icon-proChange" />
              </a-tooltip>
            </span>
            <!--            <span class="titleBtn" @click="handleAdd()">-->
            <!--              <a-tooltip placement="top">-->
            <!--                <template slot="title">-->
            <!--                  <span>添加污损置换</span>-->
            <!--                </template>-->
            <!--                <i class="iconfont icon-proAllocation" />-->
            <!--              </a-tooltip>-->
            <!--            </span>-->
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
              <label for>选择经销商</label>
              <a-select
                showSearch
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="queryParam.distCode"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>输入单据号</label>
              <a-input v-model="queryParam.docNo" placeholder="输入单据号" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for>客户名称</label>
              <a-input v-model="queryParam.cusName" placeholder="输入客户名称" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for>单据日期</label>
              <a-range-picker
                @change="handlePicker"
                :value="isDocData ? [moment(queryParam.docDateStart, dateFormat),moment(queryParam.docDateEnd,dateFormat)] : null"
                :format="dateFormat"
              />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="handleSearchParam" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        :locale="{emptyText:emptyText}"
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :pageNum="queryParam.page"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-right">
              <div class="tabBtn">
                <a-popover placement="bottomRight" overlayClassName="tableBtn">
                  <template slot="title">
                    <a @click="handleInfo(record)">
                      <i class="iconfont icon-detail" />查看详情
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
  <add-new-ware v-else-if="isAdd" @back="handleBack" :newData="stainedData" />
  <pro-allot v-else-if="isAllot" @back="handleBack" :newData="allotData" />
  <pro-detail v-else-if="isDetail" :infoData="proInfoData" @back="handleBack" />
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import moment from 'moment'
import DepotEmpty from './DepotEmpty'
import { STable } from '@/components'
import { DataFilter, exportTable } from '@/utils/storage'
import AddNewWare from './modules/OldAddNewWare'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'
import ProAllot from '../modules/ProAllot'
import ProDetail from './ProDetail'

const statusMap = {
  0: {
    status: 'error',
    text: '禁用'
  },
  1: {
    status: 'success',
    text: '启用'
  }
}
export default {
  name: 'Stained',
  components: {
    AddNewWare,
    DepotEmpty,
    STable,
    ProAllot,
    ProDetail,
    DhEmpty
  },
  created () {
    this.getParams()
  },
  data () {
    const getParams = this.$route.params
    return {
      emptyText: <dh-empty/>,
      isEmpty: false,
      statusMap,
      isShowSearch: false,
      isAdd: false,
      isAllot: false,
      isDetail: false,
      isDocData: false,
      dateFormat: 'YYYY-MM-DD',
      proInfoData: {},
      queryParam: {
        page: getParams.page ? getParams.page : 1,
        size: getParams.size ? getParams.size : 10,
        docType: '03',
        docDateStart: null,
        docDateEnd: null
      },
      distList: [],
      columns: [
        {
          title: '经销商名称',
          dataIndex: 'distName',
          align: 'left',
          width: 147
        },
        {
          title: '客户名称',
          dataIndex: 'cusName',
          align: 'left',
          width: 147
        },
        {
          title: '单据日期',
          dataIndex: 'docDate',
          align: 'left',
          customRender: text => {
            return moment(text).format('YYYY-MM-DD')
          },
          width: 140
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          },
          width: 147
        },
        {
          title: '单据号',
          dataIndex: 'docNo',
          align: 'left',
          width: 147
        },
        {
          title: '单据类型',
          dataIndex: 'docType',
          align: 'left',
          customRender: text => {
            switch (text) {
              case '15':
                return '污损出库'
                break
              case '20':
                return '污损调拨'
                break
              default:
                break
            }
          },
          width: 120
        },
        {
          title: '数量',
          dataIndex: 'qty',
          align: 'left',
          width: 80
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 100
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getWareList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const wareList = DataFilter(res, 'stained')
            this.queryParam.size = res.data.pageSize
            return wareList
          }
        )
      },
      stainedData: {
        title: '新增污损置换',
        type: 'stainedOut'
      },
      allotData: {
        title: '新增污损调拨',
        type: 'proAllot'
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
    moment,
    handleSearch () {
      this.isShowSearch = true
    },
    handleSearchParam () {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handlePicker (date, dateString) {
      // console.info(date)
      this.queryParam.docData = date
      this.isDocData = true
      this.queryParam.docDateStart = moment(date[0]).format('YYYY-MM-DD')
      this.queryParam.docDateEnd = moment(date[1]).format('YYYY-MM-DD')
    },
    handleReset () {
      this.isDocData = false
      this.queryParam = {
        ...this.queryParam,
        docNo: '',
        cusName: '',
        docDateStart: null,
        docDateEnd: null,
        distCode: undefined
      }
    },
    handleAdd () {
      const _that = this
      const callback = function () {
        _that.isAdd = false
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/reservoir/Depot/Stained#newAdd')
      window.addEventListener('popstate', callback)
      this.isAdd = true
      this.stainedData.typeCode = '15'
    },
    handleBack () {
      this.isAdd = false
      this.isDetail = false
      this.isAllot = false
      this.stainedData = {
        title: '新增污损置换',
        type: 'stainedOut'
      }
    },
    handleExport () {
      this.queryParam = {
        ...this.queryParam,
        page: undefined,
        size: undefined
      }
      exportTable(
        this.tableList.data,
        this.queryParam,
        '/amo/inventory/exportDetail',
        '产品置换表'
      )
    },
    filterOption (input, option) {
      // console.log(input);
      if (input) {}
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleInfo (val) {
      // console.info("val----", val)
      let pageTitle = ''
      if (val.docType === '21') {
        pageTitle = '污损调拨详情'
      } else {
        pageTitle = '污损出库详情'
      }
      const parmas = {
        parentCom: 'Stained',
        proType: 'stained',
        docType: '21',
        pageTitle: pageTitle,
        proInfo: val,
        page: this.queryParam.page,
        size: this.queryParam.size
      }
      this.$router.push({
        name: 'Stained_Detail',
        params: parmas
      })
    },
    handleAllot () {
      // let _that = this
      // let callback = function() {
      //   _that.isAllot = false
      //   window.removeEventListener("popstate", callback)
      // }
      // history.pushState(null, null, "/reservoir/Depot/Stained#allot")
      // window.addEventListener("popstate", callback)
      // this.isAllot = true
      // this.allotData = {
      //   title: "新增污损调拨",
      //   type: "stainedAllot",
      //   typeCode: "21"
      // };
      this.$router.push({
        name: 'Stained_Edit',
        params: {
          parentCom: 'Stained',
          pageTitle: '新增污损调拨',
          proType: 'proAllot',
          docType: '21'
        }
      })
    },
    getParams () {
      const params = this.$route.params
      // console.info('this.$route.params---',this.$route.params)
      if (params.docId && params.docType === '15') {
        this.stainedData = {
          ...params,
          title: '新增污损出库',
          type: 'stainedOut',
          docId: params.docId,
          docType: params.docType
        }
        this.isAdd = true
      } else if (params.docId && params.docType === '21') {
        this.allotData = {
          ...params,
          title: '新增污损调拨',
          type: 'stainedOut',
          docId: params.docId,
          docType: params.docType,
          typeCode: '21'
        }
        this.isAllot = true
      } else if (params.fileId && params.fileType === '15') {
        this.stainedData = {
          ...params,
          title: '新增污损出库',
          type: 'stainedOut',
          fileId: params.fileId,
          fileType: params.fileType
        }
        this.isAdd = true
      } else if (params.fileId && params.fileType === 'Stained') {
        this.allotData = {
          ...params,
          title: '新增污损调拨',
          type: 'stainedOut',
          fileId: params.fileId,
          fileType: params.fileType,
          typeCode: '21'
        }
        this.isAllot = true
      }
      userDistRange().then(res => {
        // console.info('res-date---',res)
        this.distList = res.data
      })
    }
  }
}
</script>

<style lang="less">
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
            small {
              color: rgba(225, 120, 119, 1);
              font-size: 14px;
              padding: 0 4px 0 0;
            }
          }
          .ant-calendar-picker {
            max-width: inherit;
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
          .ant-select-selection {
            height: 44px;
            line-height: 44px;
            .ant-select-selection__rendered {
              line-height: 44px;
            }
          }
          .ant-input-number {
            height: 44px;
            line-height: 44px;
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
.tabBtn {
  .iconfont {
    font-size: 24px;
    color: rgba(196, 196, 196, 1);
  }
  &:hover {
    .iconfont {
      color: rgba(62, 77, 168, 1)!important;
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
</style>
