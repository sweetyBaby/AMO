<template>
<div>
  <a-card :bordered="false" >
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress" />
    </a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>文件管理</h3>
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
              <label for>文件编号</label>
              <a-input-number  style="width: 100%;" v-model="queryParam.fileId" placeholder="请输入文件编号" />
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
            <!-- <a-modal
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
            </a-modal>-->
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="retriveTable" size="small">重置</a-button>
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
        :pageNum="queryParam.page"
        :locale="{emptyText:emptyText}"
      >
        <span slot="fileName" slot-scope="text, record">
          <a-tooltip placement="top" title="点击下载" v-if="record.fileType === 'BS-EXCEL'">
            <a class="downloadFile" @click="downloadFile(record)" >{{ text }}</a>
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="点击进入编辑页面"
            v-else-if="record.fileType === 'BS-AUTO' && record.status === 'error'"
            v-model="record.isTootip"
          >
            <a @click="handlePathTo(record)">
              {{ text }}
            </a>
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </span>
        <span slot="status" slot-scope="text, record">
         
          
          <span v-if="text === 'success'">
            
            <a @click="errorTip(record)">处理成功</a>
            </span>
            
       
          <span v-else-if="text === 'on'">处理中</span>
        
          <a-tooltip
            placement="top"
            title="点击查看错误信息"
            v-else
            v-model="record.isError"

          >
            <a @click="errorTip(record)">处理失败</a>
          </a-tooltip>
        </span>
      </s-table>
    </div>
  </a-card>

  <!-- <a-card :bordered="false" v-if-else>
    <ErrorMsg :errorData="errorData" @errorBack="errorBack"></ErrorMsg>
  </a-card> -->
  </div>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { userDistRange } from '@/api/depot/wareHouse'
import ErrorMsg from './modules/errorMsg'
import AgentTable from './modules/agentTable'
import { STable } from '@/components'
import { DataFilter, setStore } from '@/utils/storage'
import { ReportingList, retriveNameData, fetchTemplate } from '@/api/depot/depot'
import { retriveFile } from '@/api/information'
import moment from 'moment'

export default {
  name: 'FileManagement',
  components: {
    STable,
    ErrorMsg,
    AgentTable,
    DhEmpty
  },
  data () {
    const getParams = this.$route.params
    // console.info('getParams====',getParams)
    return {
      emptyText: <dh-empty/>,
      distList: [],
      fileList: [],
      percent: 0,
      uploading: false,
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
          dataIndex: 'inoutTypeName',
          customRender: (text, record) => {
            // console.info ('record====', text)
            if (record.isDistribution === 1) {
              return '配送商' + text
            } else {
               return text
            }
          }
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
        page: getParams.page ? getParams.page : 1,
        size: getParams.size ? getParams.size : 10,
        businessCategory: 'INOUT',
        distCode: getParams.distCode ? getParams.distCode : undefined,
        timeFilter: getParams.timeFilter ? getParams.timeFilter : null,
        status: getParams.status ? getParams.status : undefined,
        fileId: getParams.fileId ? getParams.fileId : null
      },
      reportUserData: [],
      errorData: {
        id: '',
        fileName: ''
      },

      trueData: {
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
        return retriveFile(Object.assign(this.queryParam, parameter)).then(
          res => {
            const ReportingList = DataFilter(res, 'report')
            this.queryParam.size = res.data.pageSize
            return ReportingList
          }
        )
      }
    }
  },
  computed: {
    headerUpload () {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
  },
  created () {
    this.getDistList()
  },
  mounted () {
    window.clearInterval(this.timer)
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    getDistList () {
      const params = {
        distCode: this.$store.state.user.info.distCode
      }
      userDistRange(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.distList = res.data
        }
      })
    },
    refreshTable () {
      this.$refs.table.refresh(false)
    },
    downloadFile (record) {
      // 下载文件
      // console.log( record.filePath);
      window.location.href = record.filePath
    },
    getSelectData (data) {
      this.selectedRowsNow = data
    },
    handleOk () {
      // 关闭经销商选择
      this.queryParam.distName = this.selectedRowsNow.distName
      this.selectedRows = this.selectedRowsNow
      this.disCodevisible = false
    },
    // 弹框的取消按钮
    handleCancel () {},
    // 点击输入框弹出弹框
    retriveCode () {
      this.disCodevisible = true
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
    tableSearch () {
      // 表格搜索
      this.$refs.table.refresh(false)
      this.isShowSearch = false
    },
    errorBack (params) {
      // console.info('params---',params)
      this.errorShow = false
      this.queryParam = params
    },

    trueBack (params) {
      // console.info('params---',params)
      this.errorShow = fslse
      this.queryParam = params
    },



    errorTip (record) {
       console.info('record====',record)
      // 错误信息详情
      const params = {
        pageTitle: '详情',
        id: record.id,
        parentCom: 'FileManagement',
        fileName: record.fileName,
        newStatus: record.status,
        ...this.queryParam
      }
      setStore('ERRORDETAIL', params)
      this.$router.push({
        name: 'FileManagement_Detail',
        params: params
      })
      record.isError = false
    },
   
   
    resetCondition () {
      // 重置查询条件
      this.queryParam.timeFilter = null
      this.queryParam.status = undefined
      this.queryParam.distName = ''
      this.selectedRows = {}
    },
    handleSearch () {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose () {
      // 关闭搜索
      this.isShowSearch = false
    },
    onMudleDown () {
      // 下载
      const downloadParam = 'model=stock&type=excel'
      fetchTemplate(downloadParam).then(res => {
        window.location.href = res.data
      })
    },
    handlePathTo (val) {
      let pathTo = ''
      let params = {}
      switch (val.inoutType) {
        case '01':
        case '03':
          if (val.status === 'error') {
            pathTo = 'WareHouse_Edit'
            params = {
              proType: 'wareIn',
              pageTitle: '编辑产品入库'
            }
          } else {
            pathTo = 'WareHouse_Detail'
            params = {
              proType: 'wareIn',
              pageTitle: '产品入库详情'
            }
          }
          break
        case '02':
          if (val.isDistribution === 1) {
            pathTo = 'EstateWare_Edit'
            params = {
              proType: 'wareIn',
              wareType: 'estate',
              pageTitle: '编辑配送商退货入库'
            }
          } else {
            pathTo = 'WareHouse_Edit'
            params = {
              proType: 'wareIn',
              pageTitle: '编辑产品入库'
            }
          }
          break
        case '11':
          if (val.isDistribution === 1) {
            pathTo = 'EstateDelivery_Edit'
            params = {
              proType: 'delivery',
              wareType: 'estate',
              pageTitle: '编辑配送商销售出库'
            }
          } else {
            pathTo = 'Delivery_Edit'
            params = {
              proType: 'delivery',
              pageTitle: '编辑产品出库'
            }
          }
          break
        case '12':
        case '13':
          if (val.status === 'error') {
            pathTo = 'Delivery_Edit'
            params = {
              proType: 'delivery',
              pageTitle: '编辑产品出库'
            }
          } else {
            pathTo = 'Delivery_Detail'
            params = {
              proType: 'delivery',
              pageTitle: '产品出库详情'
            }
          }
          break
        case '15':
        case '21':
          if (val.status === 'error') {
            pathTo = 'Stained_Edit'
            params = {
              proType: 'stainedOut',
              pageTitle: '编辑污损调拨'
            }
          } else {
            pathTo = 'Stained_Detail'
            params = {
              proType: 'stainedAllot',
              pageTitle: '污损调拨详情'
            }
          }
          break
        case '20':
          if (val.status === 'error') {
            pathTo = 'Allocation_Edit'
            params = {
              proType: 'proAllot',
              pageTitle: '编辑产品调拨'
            }
          } else {
            pathTo = 'Allocation_Detail'
            params = {
              proType: 'proAllot',
              pageTitle: '产品调拨详情'
            }
          }
          break
        default:
          break
      }
      if (val.status !== 'error') {
        params.proContain = val
      }
      this.$router.push({
        name: pathTo,
        params: {
          ...params,
          ...this.queryParam,
          parentCom: 'FileManagement',
          fileIdDoc: val.id,
          fileType: pathTo,
          typeCode: val.inoutType,
          docType: val.inoutType
        }
      })
      val.isTootip = false
      // console.info('val---',val)
    },
    handleChange (info) {
      // 上传结果
      this.uploading = true
      window.clearInterval(this.timer)
      this.timer = window.setInterval(() => {
        this.percent = parseInt(this.percent) + 1
        // console.log(this.percent);
      }, 5000)
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
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
        this.$refs.table.refresh(true)
      } else if (info.file.status === 'error') {
        this.uploading = false
        window.clearInterval(this.timer)
        this.$notification['error']({
          message: '上传失败',
          description: '上传失败！',
          duration: 4
        })
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'FileManagement') {
        this.$refs.table.refresh(false)
      }
    }
  },
  destroyed () {
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
.fileCursor{
  cursor: pointer;
}
/* 搜索样式 */
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
