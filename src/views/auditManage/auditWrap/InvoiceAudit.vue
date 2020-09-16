<template>
  <a-card :bordered="false" v-if="pageType=='index'">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>发票审计</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新增发票审计</span>
                </template>
                <i class="iconfont icon-plus"/>
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
              <label for="">审计号</label>
              <a-input-number
                v-model="queryParam.id"
                placeholder="请输入审计号"
                style="width: 100%;"
              />
            </div>
            <div class="searchList">
              <label for="">发起人</label>
              <a-input
                v-model="queryParam.initiatorName"
                placeholder="请输入发起人"
                style="width: 100%;"/>
            </div>
            <div class="searchList" style="width: 100%;">
              <label for="">审计日期</label>
              <a-range-picker
                v-model="queryParam.timeFilter"
                @change="handleTimer"
              >
              </a-range-picker>
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
        ref="table"
        size="default"
        :pageSize="queryParam.size">
        <span slot="operation" slot-scope="text, record" >
          <template>
            <div class="align-left" v-if="getAuth(record.status,'all')">
              <div class="tabBtn" >
                <a-popover placement="bottomRight" overlayClassName="tableBtn">
                  <template slot="title">
                    <a @click="viewTruth(record)" v-if="record.status === 'audited' && hasPermission('audited')">
                      <i class="iconfont icon-table-edit"></i>审计完成
                    </a>
                    <a @click="viewDetail(record)" v-if="getAuth(record.status)">
                      <i class="iconfont icon-detail"></i>审计结果
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore"></i>
                </a-popover>
              </div>
            </div>
          </template>
        </span>
      </s-table>
      <a-drawer
        title="新增审计"
        placement="right"
        @close="handleModelCancle"
        :visible="isAdd"
        wrapClassName="searchWrap"
        width="480"
      >
        <add-new-audit
          v-if="isAdd"
          :editData="editData"
          @cancel="handleModelCancle"
          @submit="handleModleSub"
        >
        </add-new-audit>
      </a-drawer>

    </div>
  </a-card>
  <a-card :bordered="false" v-else-if="pageType === 'truth'">
    <Verify></Verify>
  </a-card>
  <a-card :bordered="false" v-else-if="pageType === 'audit'">
    <AuditResult></AuditResult>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { DataFilter, BtnShow } from '@/utils/storage'
import { ReportingList } from '@/api/depot/depot'
import { getAuditList, getAuditUpdate } from '@/api/auditManage/auditManage'
import moment from 'moment'
import Verify from './modules/verifyTruth'
import AuditResult from './modules/auditResult'
import AddNewAudit from './modules/AddNewAudit'

const columns = [
  {
    title: '审计号',
    key: 'id',
    dataIndex: 'id',
  }, {
    title: '发起人',
    key: 'initiatorName',
    dataIndex: 'initiatorName',
  }, {
    title: '审计项目',
    key: 'auditName',
    dataIndex: 'auditName',
  }, {
    title: '审计状态',
    key: 'status',
    dataIndex: 'status',
    customRender: (text) => {
      return text !== 'success' ? '审计中' : '审计完成'
    }
  }, {
    title: '发起时间',
    key: 'auditStartTime',
    dataIndex: 'auditStartTime',
    customRender: (text) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null
    }
  }, {
    title: '结束时间',
    key: 'auditEndTime',
    dataIndex: 'auditEndTime',
    customRender: (text) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null
    }
  }, {
    title: '验真条目',
    key: 'detailNum',
    dataIndex: 'detailNum'
  }, {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }]

export default {
  name: 'InvoiceAudit',
  components: {
    STable,
    Verify,
    AuditResult,
    AddNewAudit
  },
  data () {
    return {
      isShowSearch: false,
      columns,
      isAdd: false,
      isSuccess: false,
      queryParam: {
        page: 1,
        size: 10
      },
      pageType: 'index',
      editData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getAuditList(Object.assign(this.queryParam, parameter)).then(res => {
          this.queryParam.size = res.data.pageSize
          const ReportingList = DataFilter(res, 'audit')
          return ReportingList
        })
      }
    }
  },
  created () {
    this.getFirstLoad()
  },
  mounted () {

  },
  methods: {
    hasPermission(val) {
      // console.info('this.btnPermission ===', this.btnPermission )
      if (val !== 'success') {
        return this.btnPermission.indexOf('success') !== -1
      }
      // console.info('val---', val)
      return this.btnPermission.indexOf('result') !== -1
    },
    getAuth (status, type) {
      // console.info('this.hasPermission(status)====', status, this.hasPermission(status))
      if (this.btnPermission.length > 2) {
        return true
      }
      if (this.hasPermission(status)) {
        return true
      }
      return false
    },
    getFirstLoad() {
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      // console.log('currentRoutecurrentRoutecurrentRoute', currentRoute);
      this.btnPermission = BtnShow(currentRoute)
      // console.info('this.btnPermission ===', this.btnPermission )
    },
    viewTruth (record) { // 审计完成
      const params = {
        id: record.id,
        status: 'success'
      }
      getAuditUpdate(params).then(res => {
        console.info('getAuditUpdate', res)
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '提示',
            description: '审计完成！',
            duration: 4
          })
          this.$refs.table.refresh(false)
        } else {
          this.$notification['error']({
            message: '提示',
            description: '审计失败！',
            duration: 4
          })
        }
      })
    },
    viewDetail (record) { // 审计结果
      window.localStorage.setItem('AuditDetail', JSON.stringify(record))
      this.$router.push({
        name: 'InvoiceAudit_Edit',
      })
    },
    tableSearch () { // 表格搜索
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    errorTip (record) { // 错误信息详情
      this.errorData.id = record.id
      this.errorData.fileName = record.fileName
    },
    handleTimer (val) {
      this.queryParam.initDateStart = moment(val[0]).format('YYYY-MM-DD')
      this.queryParam.initDateEnd = moment(val[1]).format('YYYY-MM-DD')
      // console.info('val===', this.queryParam)
    },
    resetCondition () { // 重置查询条件
      this.queryParam = {
        ...this.queryParam,
        id: '',
        initiatorName: '',
        timeFilter: null,
        initDateStart: null,
        initDateEnd: null
      }
    },
    handleSearch () { // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose () { // 关闭搜索
      this.isShowSearch = false
    },
    handleAdd () {
      this.isAdd = true
      this.editData.visible = true
    },
    handleModelCancle () {
      console.info('======')
      this.isAdd = false
      this.editData = {
        visible: false
      }
    },
    handleModleSub (val) {
      console.info('val=====', val)
      this.isAdd = false
      this.editData = {
        visible: false
      }
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
      })
    },
    onMudleDown () { // 下载

    },
    handleChange (info) { // 上传结果
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$notification['success']({
          message: '上传成功',
          description: '上传成功！',
          duration: 4
        })
      } else if (info.file.status === 'error') {
        this.$notification['error']({
          message: '上传失败',
          description: '上传失败！',
          duration: 4
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-card-bordered {
    border: none !important;
  }

  .ant-upload {
    width: 100%;
  }

  .ant-table {
    .iconfont {
      font-size: 28px;
      line-height: 32px;
      color: #c4c4c4;
    }

    .iconfont:hover {
      color: #3E4DA8;
    }
  }

  .ant-popover-content {
    .ant-popover-inner-content {
      p {
        height: 38px;
        line-height: 38px;
        padding-left: 31px;
        color: #939393;
        margin-bottom: 0;
        cursor: pointer;

        i {
          margin-right: 12px;
        }
      }

      p:hover {
        color: #153AAF;
        background: #f6f6f8;
      }
    }
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

              .ant-select {
                width: 100% !important;
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
