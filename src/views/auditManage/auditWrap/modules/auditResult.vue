<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>审计结果</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-checkOut"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>查看报告</span>
                </template>
                <i class="iconfont icon-date02"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search"/>
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
        width="340">
        <a-form layout="inline">
          <div class="searchWrap">
            <div class="searchList">
              <label for="">发票号码</label>
              <a-input v-model="queryParam.number" placeholder="请输入发票号码" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for="">审计结果</label>
              <a-form-item has-feedback>
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    placeholder="请选择审计结果"
                    style="width: 100%"
                    v-model="queryParam.result"
                  >
                    <a-select-option
                      v-for="item in selectData"
                      :value="item.value"
                      :key="item.value"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
            </div>
            <div class="searchList">
              <label for="">审计说明</label>
              <a-form-item has-feedback>
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    placeholder="请选择审计说明"
                    style="width: 100%"
                    v-model="queryParam.desc"
                  >
                    <a-select-option
                      v-for="item in selectData"
                      :value="item.value"
                      :key="item.value"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
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
        rowKey="key"
        :rowSelection="{selectedRowKeys: selectedRowKeys,onchange:onSelectedChange}"
        ref="table"
        size="default">

      </s-table>
    </div>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import { ReportingList, retriveNameData } from '@/api/depot/depot'
import moment from 'moment'
const columns = [{
  title: '文件编号',
  key: 'id',
  dataIndex: 'id',
  align: 'center'
}, {
  title: '文件名称',
  key: 'fileName',
  dataIndex: 'fileName',
  align: 'center'
}, {
  title: '上报经销商',
  key: 'distName',
  dataIndex: 'distName',
  align: 'center'
}, {
  title: '上报人',
  key: 'createBy',
  dataIndex: 'createBy',
  align: 'center'
}, {
  title: '上报日期',
  key: 'createTime',
  dataIndex: 'createTime',
  align: 'center',
  customRender: (text) => {
    if (text !== null) {
      return moment(text).format('YYYY-MM-DD')
    }
  }
}, {
  title: '处理结果',
  key: 'status',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: { customRender: 'status' },
}]

export default {
  name: 'AuditResult',
  components: {
    STable,
  },
  data() {
    return {
      isShowSearch: false,
      selectedRowKeys: [],
      columns,
      queryParam: {
        'page': 1,
        'size': 10,
        'number': '',
        'result': null,
        'desc': '',
      },
      selectData: [
        { 'value': '', 'text': '全部' },
        { 'value': 'on', 'text': '处理中' },
        { 'value': 'success', 'text': '处理成功' },
        { 'value': 'error', 'text': '处理失败' }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return ReportingList(Object.assign(this.queryParam, parameter)).then(res => {
          const ReportingList = DataFilter(res, 'report')
          return ReportingList
        })
      },
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    onSelectedChange(selectedRowKeys, selectedRows) { // 选择checkbox
      this.selectedRowKeys = selectedRowKeys
    },
    tableSearch() { // 表格搜索
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    resetCondition() { // 重置查询条件
      this.queryParam.timeFilter = null
      this.queryParam.status = undefined
      this.queryParam.distCode = ''
      this.selectedRows = {}
    },
    handleSearch() { // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() { // 关闭搜索
      this.isShowSearch = false
    },
  }
}
</script>

<style lang="less">
  .ant-card-bordered{
    border: none !important;
  }

  /* 搜索样式 */
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
            .ant-calendar-picker{
              width: 100%;
              max-width: none;
            }
            label{
              color: rgba(147, 147, 147, 1);
              font-size: 14px;
              line-height: 20px;
              margin: 0 0 8px 0;
              width: 100%;
              display: block;
            }
            .ant-input{
              border:1px solid rgba(233,233,233,1);
              border-radius: 4px;
              background: white;
              height: 44px;
              line-height: 44px;
              .ant-calendar-picker{
                line-height: 36px;
              }
            }
          }
          .ant-form{
            height:  100%;
            padding: 0 0 60px 0;
            .searchWrap{
              height:  100%;
              overflow-y: auto;
              .ant-form-item{
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

              .ant-select-dropdown-menu-item-active{
                background-color: #e6f7ff !important;
              }

              .adInput-input {
                .begin_date {
                  .anticon-calendar {
                    color: #3E4DA8;
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
</style>
