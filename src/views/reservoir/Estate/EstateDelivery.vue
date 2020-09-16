<template>
  <a-card :bordered="false" v-if="!isAdd && !isDetail">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>配送商销售出库</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
              </a-tooltip>
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
              <label for>配送商名称</label>
              <a-input v-model="queryParam.distribution" placeholder="输入配送商名称" style="width: 100%;" />
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
            <a-button type="primary" @click="handleSearchR" size="small">查询</a-button>
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
        <span slot="cusName" slot-scope="text, record" class="cusName-Icon">
          <a-tooltip placement="top" v-show="record.docType === '11'">
            <template slot="title">
              <span v-show="record.hosAuthFlag !== '2'">已授权</span>
              <span v-show="record.hosAuthFlag === '2'">未授权</span>
            </template>
            <i class="iconfont icon-allauthorized" v-show="record.hosAuthFlag !== '2'"/>
            <i class="iconfont icon-unauthorized" v-show="record.hosAuthFlag === '2'"/>
          </a-tooltip>
          <span class="cusNameTab" v-show="record.docType !== '11'"></span>
          {{ text }}
        </span>
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
      </s-table>
    </div>
    <depot-empty v-else />
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress" />
    </a-spin>
  </a-card>
</template>

<script>
import DhEmpty from '@/views/comPublic/DhEmpty'
import moment from 'moment'
import DepotEmpty from '../Depot/DepotEmpty'
import { STable } from '@/components'
import { DataFilter, exportTable, exportTabList } from '@/utils/storage'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'

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
  name: 'EstateDelivery',
  components: {
    DepotEmpty,
    STable,
    moment,
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
      loadingSpin: false,
      isShowSearch: false,
      isAdd: false,
      isDetail: false,
      proInfoData: {},
      showUploadList: false,
      uploadType: {
        docType: 'out'
      }, // 上传数据
      fileList: [],
      distList: [],
      percent: 0,
      uploading: false,
      dateFormat: 'YYYY-MM-DD',
      isDocData: true,
      tableList: [], // 表格数据
      queryParam: {
        page: getParams.page ? getParams.page : 1,
        size: getParams.size ? getParams.size : 10,
        docType: '11',
        distCode: getParams.distCode ? getParams.distCode : undefined,
        docDateStart: getParams.docDateStart ? getParams.docDateStart : moment().startOf('day').subtract(3, 'month').format('YYYY-MM-DD'),
        docDateEnd: getParams.docDateEnd ? getParams.docDateEnd : moment().startOf('day').format('YYYY-MM-DD'),
        docNo: getParams.docNo ? getParams.docNo : null,
        isDistribution: 1,
        cusName: getParams.cusName ? getParams.cusName : null
      },
      columns: [
        {
          title: '经销商名称',
          dataIndex: 'distName',
          align: 'left'
        },
        {
          title: '配送商名称',
          dataIndex: 'distribution',
          align: 'left'
        },
        {
          title: '单据日期',
          dataIndex: 'docDate',
          align: 'left',
          customRender: text => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '出库时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: '单据号',
          dataIndex: 'docNo',
          align: 'left'
        },
        {
          title: '单据类型',
          dataIndex: 'docType',
          align: 'left',
          customRender: text => {
            return '配送商销售出库'
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
        return getWareList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const wareList = DataFilter(res, 'delivery')
            this.tableList = wareList
            this.queryParam.size = res.data.pageSize
            return wareList
          }
        )
      },
      stainedData: {
        title: '新增产品出库',
        type: 'delivery'
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
    onSearchClose () {
      this.isShowSearch = false
    },
    handlePicker (date, dateString) {
      if (date.length === 0) {
        this.isDocData = false
        this.queryParam.docDateStart = null
        this.queryParam.docDateEnd = null
      } else {
        this.queryParam.docData = date
        this.isDocData = true
        this.queryParam.docDateStart = moment(date[0]).format('YYYY-MM-DD')
        this.queryParam.docDateEnd = moment(date[1]).format('YYYY-MM-DD')
      }
    },
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
          '/amo/document/export',
          '出库表'
        ).then(res => {
          this.loadingSpin = false
        })
      }
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
    handleChange (info) {
      // 上传结果
      this.uploading = true
      window.clearInterval(this.timer)
      this.timer = window.setInterval(() => {
        this.percent = parseInt(this.percent) + 1
      }, 1000)

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
        // this.$refs.table.refresh(true)
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
    handleSearchR () {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    handleReset () {
      this.isDocData = false
      this.queryParam = {
        ...this.queryParam,
        docNo: '',
        cusName: '',
        docDateStart: null,
        docDateEnd: null,
        distCode: undefined,
        distribution: ''
      }
    },
    handleAdd () {
      const parmas = {
        parentCom: 'EstateDelivery',
        proType: 'delivery',
        wareType: 'estate',
        pageTitle: '新增销售出库'
      }
      this.$router.push({
        name: 'EstateDelivery_Edit',
        params: parmas
      })
    },
    handleBack () {
      this.isAdd = false
      this.isDetail = false
      this.stainedData = {
        title: '新增产品出库',
        type: 'delivery'
      }
    },
    handleInfo (val) {
      const parmas = {
        parentCom: 'EstateDelivery',
        proType: 'delivery',
        pageTitle: '出库单据详情',
        proInfo: val,
        ...this.queryParam
      }
      this.$router.push({
        name: 'EstateDelivery_Detail',
        params: parmas
      })
    },
    getParams () {
      const params = this.$route.params
      if (params.docId) {
        this.stainedData = {
          ...params,
          title: '编辑销售出库',
          type: 'delivery',
          docId: params.docId,
          docType: params.docType
        }
        this.isAdd = true
      } else if (params.fileId) {
        this.stainedData = {
          ...params,
          title: '编辑销售出库',
          type: 'delivery',
          fileId: params.fileId,
          fileType: params.fileType
        }
        this.isAdd = true
      }
      userDistRange().then(res => {
        // console.info('res-date---',res)
        this.distList = res.data
      })
    }
  },
  destroyed () {
    this.loadingSpin = false
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
    font-size: 28px;
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
.cusName-Icon{
  .iconfont{
    cursor: pointer;
    font-size: 18px;
    color: #CFCFCF;
    margin: 0 4px 0 0;
    display: inline-block;
    &.icon-allauthorized{
      color: rgba(96, 198, 151, 1);
    }
  }
}
/*.cusNameTab{*/
/*  display: block;*/
/*  width: 24px;*/
/*  height: 20px;*/
/*}*/
</style>
