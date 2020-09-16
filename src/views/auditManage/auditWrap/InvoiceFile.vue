<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>发票文件管理</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <!-- <span class="titleBtn">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>下载模板</span>
                </template>
                <i class="iconfont icon-down" />
              </a-tooltip>
            </span>-->
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
              <label for>文件编号</label>
              <a-input v-model="queryParam.fileId" placeholder="请输入文件编号" />
            </div>
            <div class="searchList" style="width: 100%;">
              <label for>上报时间</label>
              <a-date-picker v-model="queryParam.timeFilter" placeholder="请选择上报日期" />
            </div>
            <div class="searchList">
              <label for>处理状态</label>
              <a-form-item has-feedback>
                <a-form-item style="width: 100%" has-feedback>
                  <a-select placeholder="请选择处理结果" style="width: 100%" v-model="queryParam.status">
                    <a-select-option
                      v-for="item in selectData"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.text }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="retriveTable" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :pageNum="queryParam.page"
        :pageSize="queryParam.size"
        :columns="columns"
        :data="loadData"
      >
        <span slot="status" slot-scope="text, record">
          <span v-if="text === 'success'">处理成功</span>
          <span v-else-if="text === 'on'">处理中</span>
          <a-tooltip
            placement="top"
            title="点击查看错误信息"
            v-else
            :overlayClassName="showTool?'toolStyle':null"
          >
            <a @click="errorTip(record)">处理失败</a>
          </a-tooltip>
        </span>
        <span slot="fileName" slot-scope="text, record">
          <a-tooltip placement="top" title="点击下载" v-if="record.fileType === 'BS-EXCEL'">
            <a class="downloadFile" @click="downloadFile(record)">{{ text }}</a>
          </a-tooltip>
          <!-- <a-tooltip
            placement="top"
            title="点击进入编辑页面"
            v-else-if="record.fileType === 'BS-AUTO' && record.status === 'error'"
          >
            <a @click="handlePathTo(record)">{{ text }}</a>
          </a-tooltip>-->
          <a-tooltip
            placement="top"
            title="点击进入详情页面"
            v-else-if="record.fileType === 'BS-AUTO' && record.status === 'success'"
          >
            <span class="fileCursor" @click="handlePathTo(record)">{{ text }}</span>
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </span>
      </s-table>
    </div>
  </a-card>
</template>
<script>
import { userDistRange } from '@/api/depot/wareHouse'
import { retriveFile } from '@/api/information'
import moment from 'moment'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
export default {
  name: 'AuditManage',
  components: {
    STable
  },
  data () {
    return {
      showTool: false,
      distList: [],
      selectData: [
        { value: '', text: '全部' },
        { value: 'on', text: '处理中' },
        { value: 'success', text: '处理成功' },
        { value: 'error', text: '处理失败' }
      ],
      isShowSearch: false,
      columns: [
        {
          width: 100,
          title: '文件编号',
          key: 'id',
          dataIndex: 'id'
        },
        {
          width: 150,
          title: '文件名称',
          key: 'fileName',
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          width: 160,
          title: '上报经销商',
          key: 'distName',
          dataIndex: 'distName'
        },
        {
          width: 100,
          title: '上报人',
          key: 'createBy',
          dataIndex: 'createBy'
        },
        {
          width: 160,
          title: '上报时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => {
            if (text) {
              return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        },
        {
          width: 100,
          title: '上报来源',
          key: 'fileType',
          dataIndex: 'fileType'
        },
        {
          width: 100,
          title: '业务类型',
          key: 'inoutTypeName',
          dataIndex: 'inoutTypeName'
        },
        {
          width: 150,
          title: '处理时长（s）',
          key: 'costTime',
          dataIndex: 'costTime'
        },
        {
          width: 100,
          title: '处理结果',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      queryParam: {
        page: 1,
        size: 10,
        businessCategory: 'INVOICE'
      },
      loadData: parameter => {
        // Object.assign的方法是将parameter，复制到this.queryParam中这样做的原因是防止this.queryParam的值为空时，parameter中有默认的值{page：10，size：1}
        return retriveFile(Object.assign(this.queryParam, parameter)).then(
          res => {
            const tableList = DataFilter(res, 'table')
            return tableList
          }
        )
      }
    }
  },
  computed: {},

  created () {
    this.showTool = false
    this.getDistList()
  },
  methods: {
    downloadFile (record) {
      // 下载文件
      window.location.href = record.filePath
    },
    errorTip (record) {
      this.showTool = true
      // 错误信息详情
      const params = {
        pageTitle: '错误详情',
        id: record.id,
        parentCom: 'InvoiceFile',
        fileName: record.fileName,
        page: this.queryParam.page,
        size: this.queryParam.size
      }
      this.$router.push({
        name: 'InvoiceFile_Detail',
        params: params
      })
    },
    getDistList () {
      //   console.log(this.$route.params);
      //   const getParams = this.$route.params;
      //   if (getParams) {
      //     this.queryParam.page = getParams.page;
      //     this.queryParam.size = getParams.size;
      //   }
      const params = {
        distCode: this.$store.state.user.info.distCode
      }

      userDistRange(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.distList = res.data
        }
      })
    },
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    tableSearch () {
      this.$refs.table.refresh(false)
      this.isShowSearch = false
    },
    retriveTable () {
      this.queryParam = {
        ...this.queryParam,
        distCode: undefined,
        timeFilter: undefined,
        status: undefined,
        fileId: null
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  watch: {
    $route (to, from) {
      this.showTool = false
    }
  }
}
</script>
<style  lang="less">
/* 搜索样式 */
.toolStyle {
  display: none;
}
.searchWrap {
  .selectDistName {
    input {
      cursor: pointer;
    }
  }
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
            background: #fff;
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
                background: #fff;
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
