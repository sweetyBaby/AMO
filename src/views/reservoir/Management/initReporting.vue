<template>
  <a-card>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>初始库存上报</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <!-- <span class="titleBtn">
              <a-popconfirm placement="bottomRight">
                <template slot="title">
                  <a @click="onMudleDown"><i class="iconfont icon-up"/>下载模板</a>
                  <a @click="onMudleUp"><i class="iconfont icon-down"/>上传模板</a>
                </template>
                <i class="iconfont icon-more"/>
              </a-popconfirm>
            </span>-->
            <span class="titleBtn" @click="onMudleDown">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>下载模板</span>
                </template>
                <i class="iconfont icon-down" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="onMudleUp">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>上传模板</span>
                </template>
                <i class="iconfont icon-up" />
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
            <div class="searchList" style="width: 100%;">
              <label for>上报日期</label>
              <a-date-picker @change="handlePicker" />
            </div>
            <div class="searchList">
              <label for>处理结果</label>
              <a-form-item has-feedback>
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    v-decorator="['result', { rules: [{ required: true, message: '请选择处理结果', whitespace: true }]}]"
                    placeholder="请选择处理结果"
                    style="width: 100%"
                  >
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">处理成功</a-select-option>
                    <a-select-option value="2">处理失败</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="getTableList()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <a-table :columns="columns" :dataSource="data" :locale="{emptyText:emptyText}">
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;">Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a href="javascript:;">Delete</a>
          <a-divider type="vertical" />
          <a href="javascript:;" class="ant-dropdown-link">
            More actions
            <a-icon type="down" />
          </a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { ReportingList } from '@/api/depot/depot'
const columns = [
  {
    title: '文件编号',
    key: 'fileNumber',
    dataIndex: 'fileNumber'
  },
  {
    title: '文件名称',
    key: 'fileName',
    dataIndex: 'fileName'
  },
  {
    title: '上报经销商',
    key: 'reporting',
    dataIndex: 'reporting'
  },
  {
    title: '上报人',
    key: 'reportingPerson',
    dataIndex: 'reportingPerson'
  },
  {
    title: '上报日期',
    key: 'date',
    dataIndex: 'date'
  },
  {
    title: '处理结果',
    key: 'result',
    dataIndex: 'result'
  },
  {
    title: '错误提示',
    key: 'errorTip',
    dataIndex: 'errorTip'
  }
]

export default {
  name: 'InitReporting',
  data() {
    return {
      emptyText: <dh-empty/>,
      isEmpty: false,
      isShowSearch: false,
      search: {
        date: '',
        result: ''
      },
      data: [],
      columns,
      queryParam: {
        page: 0,
        size: 10
      },
      selectData: [
        { value: '0', text: '全部' },
        { value: '1', text: '处理失败' },
        { value: '2', text: '处理成功' }
      ]
    }
  },
  created() {
    this.getReporting()
  },
  components: {
    DhEmpty
  },
  mounted() {},
  methods: {
    getReporting() {
      ReportingList(this.queryParam).then(res => {
        this.data = res.result
      })
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    onMudleDown() {},
    onMudleUp() {},
    handlePicker(date, dateString) {
      console.log(date, dateString)
    },
    selectChange() {
      // 搜索条件选择
    }
  }
}
</script>

<style lang="less">
.ant-card-bordered {
  border: none !important;
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
