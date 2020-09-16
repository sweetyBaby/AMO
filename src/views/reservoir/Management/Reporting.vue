<template>
  <a-card :bordered="false" v-if="!errorShow">
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress" />
    </a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存上报</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>下载模板</span>
                </template>
                <a @click="onMudleDown">
                  <i class="iconfont icon-down" />
                </a>
              </a-tooltip>
            </span>
            <span class="titleBtn">
              <a-upload
                :showUploadList="showUploadList"
                action="/amo/dist/stock/upload/import"
                :beforeUpload="beforeUpload"
                :headers="headerUpload"
                @change="handleChange"
              >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>上传模板</span>
                  </template>
                  <i class="iconfont icon-up" />
                </a-tooltip>
              </a-upload>
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
                :filterOption="filterOption"
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="queryParam.distCode"
              >
                <a-select-option
                  v-for="item in distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}</a-select-option>
              </a-select>
              <!--              <div class="adInput-input" @click="retriveCode()" style=" cursor: pointer;">-->
              <!--                <a-form-item style="width: 100%">-->
              <!--                  <a-input-->
              <!--                    placeholder="请选择经销商名称"-->
              <!--                    style="width: 100%"-->
              <!--                    v-model="selectedRows.distName"-->
              <!--                    :disabled="true"-->
              <!--                    class="selectDistName"-->
              <!--                  />-->
              <!--                  <i class="iconfont icon-more" />-->
              <!--                </a-form-item>-->
              <!--              </div>-->
            </div>
            <div class="searchList" style="width: 100%;">
              <label for>上报日期</label>
              <a-date-picker v-model="queryParam.timeFilter" placeholder="请选择上报日期" />
            </div>
            <div class="searchList">
              <label for>处理结果</label>
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
            <a-modal
              title="经销商名称查询"
              v-model="disCodevisible"
              @ok="handleOk"
              width="800px"
              :maskClosable="false"
              @cancel="handleCancel"
            >
              <template>
                <AgentTable :selectedRows="selectedRows" @selectedData="getSelectData"></AgentTable>
              </template>
            </a-modal>
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
        ref="table"
        size="default"
        :pageSize="queryParam.size"
        :locale="{emptyText:emptyText}"
      >
        <span slot="fileName" slot-scope="text, record">
          <span class="downloadFile" @click="downloadFile(record)">{{ text }}</span>
        </span>
        <span slot="status" slot-scope="text, record">
          <span v-if="text==='success'">处理成功</span>
          <span v-else-if="text==='on'">处理中</span>
          <a v-else @click="errorTip(record)">处理失败</a>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card :bordered="false" v-else>
    <ErrorMsg :errorData="errorData" @errorBack="errorBack"></ErrorMsg>
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import ErrorMsg from './modules/errorMsg'
import AgentTable from './modules/agentTable'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import { userDistRange } from '@/api/depot/wareHouse'
import {
  ReportingList,
  retriveNameData,
  fetchTemplate
} from '@/api/depot/depot'
import moment from 'moment'
const columns = [
  {
    title: '文件编号',
    key: 'id',
    dataIndex: 'id'
  },
  {
    title: '文件名称',
    key: 'fileName',
    dataIndex: 'fileName',
    scopedSlots: { customRender: 'fileName' }
  },
  {
    title: '上报经销商',
    key: 'distName',
    dataIndex: 'distName'
  },
  {
    title: '上报人',
    key: 'createBy',
    dataIndex: 'createBy'
  },
  {
    title: '上报日期',
    key: 'createTime',
    dataIndex: 'createTime',
    customRender: text => {
      if (text !== null) {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
        // return moment(text).format('YYYY-MM-DD')
      }
      // return moment(text).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '处理结果',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  }
]

export default {
  name: 'Reporting',
  components: {
    STable,
    ErrorMsg,
    AgentTable,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty />,
      fileList: [],
      percent: 0,
      uploading: false,
      distList: [],
      selectedRows: {
        distName: '',
        distCode: ''
      },
      selectedRowsNow: {},
      showUploadList: false,
      errorShow: false,
      isShowSearch: false,
      disCodevisible: false,
      timer: null,
      columns,
      queryParam: {
        page: 1,
        size: 10,
        distCode: undefined,
        timeFilter: null,
        status: undefined
      },
      reportUserData: [],
      errorData: {
        id: '',
        fileName: ''
      },
      selectData: [
        { value: '', text: '全部' },
        { value: 'on', text: '处理中' },
        { value: 'success', text: '处理成功' },
        { value: 'error', text: '处理失败' }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return ReportingList(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.queryParam.size = res.data.pageSize
            const ReportingList = DataFilter(res, 'report')
            this.queryParam.size = res.data.pageSize
            return ReportingList
          }
        )
      }
    }
  },
  computed: {
    headerUpload() {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
  },
  created() {
    this.getFirstLogin()
  },
  mounted() {
    window.clearInterval(this.timer)
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    beforeUpload(file) {
      // 上传前回掉
      const size = file.size / 1024 / 1024
      if (size > 5) {
        this.$notification['error']({
          message: '上传失败',
          description: '文件大小不能超过5M！',
          duration: 4
        })
        return false
      }
    },
    downloadFile(record) {
      // 下载文件
      window.location.href = record.filePath
    },
    getSelectData(data) {
      this.selectedRowsNow = data
    },
    handleOk() {
      // 关闭经销商选择
      this.queryParam.distName = this.selectedRowsNow.distName
      this.selectedRows = this.selectedRowsNow
      this.disCodevisible = false
    },
    // 弹框的取消按钮
    handleCancel() {},
    // 点击输入框弹出弹框
    retriveCode() {
      this.disCodevisible = true
    },
    tableSearch() {
      // 表格搜索
      this.$refs.table.refresh(false)
      this.isShowSearch = false
    },
    errorBack() {
      this.errorShow = false
    },
    errorTip(record) {
      const _that = this
      const callback = function() {
        _that.errorShow = false
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/reservoir/Management/Reporting#detail')
      window.addEventListener('popstate', callback)
      // 错误信息详情
      this.errorData.id = record.id
      this.errorData.fileName = record.fileName
      this.errorShow = true
    },
    resetCondition() {
      // 重置查询条件
      this.queryParam = {
        ...this.queryParam,
        timeFilter: null,
        status: undefined,
        distCode: undefined
      }
      // this.selectedRows = {};
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    onMudleDown() {
      // 下载
      const downloadParam = 'model=stock&type=excel'
      fetchTemplate(downloadParam).then(res => {
        window.location.href = res.data
      })
    },
    handleChange(info) {
      // 上传结果
      const size = info.file.size / 1024 / 1024
      if (size < 5) {
        this.uploading = true
        window.clearInterval(this.timer)
        this.timer = window.setInterval(() => {
          this.percent = parseInt(this.percent) + 1
        }, 5000)
      }
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.percent = 100
        window.clearInterval(this.timer)
        this.uploading = false
        this.percent = 0
        this.$notification['success']({
          message: '提示',
          description: '上传成功！',
          duration: 4
        })
        this.$router.push({ name: 'FileManagement' })
        // this.$refs.table.refresh(true);
      } else if (info.file.status === 'error') {
        this.uploading = false
        window.clearInterval(this.timer)
        this.$notification['error']({
          message: '上传失败',
          description: '上传失败！',
          duration: 4
        })
      }
    },
    getFirstLogin() {
      userDistRange().then(res => {
        // console.info('res-date---',res)
        this.distList = res.data
      })
    }
  },
  destroyed() {
    window.clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.progress {
  width: 500px;
  margin: 0 auto;
  margin-top: 250px;
  display: block;
  .ant-progress-text {
    color: #fff;
  }
}
.ant-spin-blur {
  opacity: 1;
}
.ant-spin-blur:after {
  opacity: 0.5;
}
//上传中
.uploading {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.65);
  z-index: 99;
  left: 0;
  top: 0;
  .ant-spin-text {
    color: #fff;
    position: relative;
    top: 250px;
  }
  .ant-spin-dot {
    top: 250px;
    i {
      background-color: #fff;
    }
  }
}

.ant-card-bordered {
  border: none !important;
}
.downloadFile:hover {
  color: #3e4da8;
  cursor: pointer;
}
.ant-upload {
  width: 100%;
}
.addInput {
  .addInput-title {
    padding: 0 0 8px 0;
    font-size: 14px;
  }
}
.ant-modal {
  .ant-table-thead {
    td {
      background: none;
    }
  }
}

.ant-popover-inner-content a {
  display: block;
  height: 38px;
  line-height: 38px;
  padding-left: 31px;
  color: #939393;
}
.ant-popover-inner-content a:hover {
  color: #153aaf;
  background: #f6f6f8;
}
/* 搜索样式 */
.searchWrap {
  .ant-select-selection__placeholder {
    color: #bfbfbf;
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
              .ant-form-item,
              .ant-form-item-control-wrapper,
              .ant-form-item-control {
                width: 100%;
                .ant-form-item-children {
                  .selectDistName {
                    cursor: pointer;
                    color: rgba(0, 0, 0, 0.65);
                  }
                  .icon-more {
                    position: absolute;
                    right: 10px;
                    top: -8px;
                    color: #bfbfbf;
                  }
                }
              }

              .ant-input {
                width: 100%;
                height: 44px;
                background: #fff;
                opacity: 1;
                border-radius: 4px;
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
