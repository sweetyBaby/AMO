<template>
  <a-card :bordered="false" v-if="!isDetail">
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress" />
    </a-spin>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>异常数据</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
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
            <div class="searchList" style="width: 100%;">
              <label for>单据号</label>
              <a-input v-model="queryParam.docNo" placeholder="请输入单据号" />
            </div>
            <div class="searchList" style="width: 100%;">
              <label for>单据日期</label>
              <a-date-picker
                placeholder="请选择单据日期"
                @change="handleChangeDate"
                v-model="docDate"
              ></a-date-picker>
            </div>
            <div class="searchList">
              <label for>单据类型</label>
              <a-form-item has-feedback>
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    showSearch
                    placeholder="选择单据类型"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    v-model="queryParam.docType"
                  >
                    <a-select-option
                      v-for="(item,index) in statusMap"
                      :value="item.type"
                      :key="index"
                    >{{ item.text }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetTable" size="small">重置</a-button>
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
        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-left">
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
        <span slot="status" slot-scope="text">
          {{ statusFilter(text) }}
        </span>
      </s-table>
    </div>
  </a-card>
<!--  <div v-else >-->
<!--    <abnormal-detail :data="abNormal" @back="handleBack" />-->
<!--  </div>-->
</template>

<script>
import DhEmpty from '@/views/comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter, exportTable, exportTabList } from '@/utils/storage'
import { getDocumentErrorList, userDistRange } from '@/api/depot/wareHouse'
import moment from 'moment'

const statusMap = [
  {
    type: '01',
    text: '进货入库',
    isDistribution: 0
  },
  {
    type: '02',
    text: '退货入库',
    isDistribution: 0
  },
  {
    type: '02',
    text: '配送商退货入库',
    isDistribution: 1
  },
  {
    type: '03',
    text: '换货入库',
    isDistribution: 0
  },
  {
    type: '11',
    text: '销售出库',
    isDistribution: 0
  },
  {
    type: '11',
    text: '配送商销售出库',
    isDistribution: 1
  },
  {
    type: '12',
    text: '退货出库',
    isDistribution: 0
  },
  {
    type: '13',
    text: '换货出库',
    isDistribution: 0
  },
  {
    type: '15',
    text: '污损出库',
    isDistribution: 0
  }
  // {
  //   type:'20',
  //   text:'产品调拨'
  // },
  // {
  //   type:'21',
  //   text:'污损调拨'
  // }
]

export default {
  name: 'FileManagement',
  components: {
    STable,
    DhEmpty
  },
  data () {
    const getParams = this.$route.params
    // console.info('getParams====',getParams)
    return {
      emptyText: <dh-empty/>,
      id: null,
      loadingSpin: false,
      distList: [],
      fileList: [],
      percent: 0,
      uploading: false,
      isShowSearch: false,
      docDate: getParams.docDate ? getParams.docDate : undefined,
      statusMap,
      tableList: {},
      columns: [
        {
          width: '20%',
          title: '经销商名称',
          key: 'distName',
          dataIndex: 'distName'
        },
        {
          width: '20%',
          title: '单据号码',
          key: 'docNo',
          dataIndex: 'docNo'
        },
        {
          width: '10%',
          title: '单据日期',
          key: 'docDate',
          dataIndex: 'docDate',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          width: '10%',
          title: '单据类型',
          key: 'docType',
          dataIndex: 'docType',
          customRender: (text, record) => {
            return statusMap.map(item => {
              if (item.type === text.toString() && item.isDistribution === record.isDistribution) {
                return item.text
              }
            })
          }
        },
        {
          width: '15%',
          title: '最后操作时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          width: '10%',
          title: '最后操作人',
          key: 'createBy',
          dataIndex: 'createBy'
        },
        {
          width: '8%',
          title: '异常条数',
          key: 'errorNum',
          dataIndex: 'errorNum'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 100
        }
      ],
      queryParam: {
        page: getParams.page ? getParams.page : 1,
        size: getParams.size ? getParams.size : 10,
        distCode: getParams.distCode ? getParams.distCode : undefined,
        docNo: getParams.docNo ? getParams.docNo : null,
        docType: getParams.docType ? getParams.docType : undefined
      },
      abNormal: {},
      isDetail: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDocumentErrorList(Object.assign(this.queryParam, parameter)).then(
          res => {
            // console.info('this.queryParam---',this.queryParam)
            const abnormalList = DataFilter(res, 'abnormal')
            this.queryParam.size = res.data.pageSize
            this.tableList = abnormalList
            return abnormalList
          }
        )
      }
    }
  },
  // beforeCreate(){
  //   const getParams = this.$route.params
  //   if(getParams.query){
  //     this.queryParam = {
  //       ...this.queryParam,
  //       page: getParams.query.page,
  //       size: getParams.query.size
  //     }
  //   }
  //   console.info('this.queryParam+++++++',this.queryParam)
  // },
  created () {
    this.getDistList()
  },
  methods: {
    moment,
    statusFilter (type) {
      statusMap.map(item => {
        if (item.type === type.toString()) {
          // console.info(item.text)
          return item.text
        }
      })
    },
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
    handleChangeDate (date, dateString) {
      // console.info('dateString---',dateString)
      if (date !== null) {
        this.queryParam.docDate = dateString
      } else {
        this.queryParam.docDate = null
      }
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
    tableSearch () {
      // 表格搜索
      this.$refs.table.refresh(false)
      this.isShowSearch = false
    },
    resetTable () {
      // 重置查询条件
      this.docDate = null
      this.queryParam = {
        ...this.queryParam,
        distCode: undefined,
        docNo: '',
        docDate: null,
        docType: undefined
      }
    },
    // 跳转详情页
    handleInfo (record) {
      this.$router.push({
        name: 'AbnormalData_Detail',
        params: {
          item: record,
          ...this.queryParam
        }
      })
    },
    // 导出数据
    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/document/errorList/export',
          '异常数据表'
        ).then(res => {
          this.loadingSpin = false
        })
      }
    },
    // 返回列表页
    handleBack () {
      this.isDetail = false
      this.abNormal = {}
    },
    handleSearch () {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose () {
      // 关闭搜索
      this.isShowSearch = false
    }
    // onMudleDown () {
    //   // 下载
    //   const downloadParam = 'model=stock&type=excel'
    //   fetchTemplate(downloadParam).then(res => {
    //     window.location.href = res.data
    //   })
    // }
  },
  destroyed () {
    window.clearInterval(this.timer)
    this.loadingSpin = false
  }
}
</script>

<style lang="less">
  .tabBtn{
    .iconfont{
      font-size: 28px;
      color: rgba(196, 196, 196, 1);
    }
    &:hover{
      .iconfont{
        color: rgba(62, 77, 168, 1)!important
      }
    }
  }
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
  &:hover{
    color: #153aaf;
    background: #f6f6f8;
  }
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
