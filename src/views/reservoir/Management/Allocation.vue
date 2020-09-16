<template>
  <a-card v-if="!isDetail && !isAllot" :bordered="false">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>产品库位间调拨</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>下载模板</span>
                </template>
                <a
                  style="text-decoration: none;"
                  href="https://cdcs.oss-cn-shanghai.aliyuncs.com/webroot/amo/template/%E4%BA%A7%E5%93%81%E8%B0%83%E6%8B%A8%E6%A8%A1%E6%9D%BF.xlsx"
                >
                  <i class="iconfont icon-down" />
                </a>
              </a-tooltip>
            </span>
            <span class="titleBtn">
              <a-upload
                :showUploadList="showUploadList"
                action="/amo/whAllocate/importExcelProduct"
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
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top" v-model="isAddPro">
                <template slot="title">
                  <span>新增产品调拨</span>
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

    <div>
      <a-drawer
        title="搜索条件"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        width="340"
        :pageSize="queryParam.size"
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
                @change="handleDist"
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
              <label for>目标库位</label>
              <a-select
                showSearch
                style="width: 100%;"
                placeholder="选择目标库位"
                v-model="queryParam.whCodeTo"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in bankList"
                  :value="item.whCode"
                  :key="item.whCode"
                >{{ item.whName }}</a-select-option>
              </a-select>
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
            <a-button type="primary" @click="handleSearchParams()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset()" size="small">重置</a-button>
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
  </a-card>
  <pro-allot v-else-if="isAllot" @back="handleBack" :newData="allotData" />
  <pro-detail v-else-if="isDetail" :infoData="proInfoData" @back="handleBack" />
</template>

<script>
import { retriveLocation } from '@/api/information'
import DhEmpty from '@/views/comPublic/DhEmpty'
import moment from 'moment'
import { STable } from '@/components'
import AllocationDetail from './modules/AllocationDetail'
import { DataFilter, exportTable, exportTabList } from '@/utils/storage'
import { proAllotList, userDistRange } from '@/api/depot/wareHouse'
import ProAllot from '../modules/ProAllot'
import ProDetail from '../Depot/ProDetail'
const columns = [
  {
    title: '经销商名称',
    dataIndex: 'distName',
    align: 'left',
    width: 190
  },
  {
    title: '单据号码',
    dataIndex: 'docNo',
    align: 'left',
    width: 190
  },
  {
    title: '单据日期',
    dataIndex: 'docDate',
    align: 'left',
    width: 140,
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '原始库位',
    dataIndex: 'whNameFrom',
    align: 'left',
    width: 120
  },
  {
    title: '目标库位',
    dataIndex: 'whNameTo',
    align: 'left',
    width: 120
  },
  {
    title: '调拨时间',
    dataIndex: 'createTime',
    align: 'left',
    width: 180,
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  {
    title: '调出数量',
    dataIndex: 'qty',
    align: 'left',
    width: 120
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 100
  }
]

const data = [
  {
    key: 1,
    number: '1',
    date: '2001-1-20 22:22:22',
    original: 'A',
    targetHouse: 'A',
    outNum: '1'
  }
]

export default {
  name: 'Allocation',
  components: {
    STable,
    AllocationDetail,
    ProAllot,
    ProDetail,
    DhEmpty
  },
  data () {
    const getParams = this.$route.params
    return {
      bankList: [],
      emptyText: <dh-empty />,
      isShowSearch: false,
      loadingSpin: false,
      viewAllocation: false, // 查看详情
      queryParam: {
        page: getParams.page ? getParams.page : 1,
        size: getParams.size ? getParams.size : 10,
        whCodeTo: undefined,
        docDateStart: getParams.docDateStart ? getParams.docDateStart : moment().startOf('day').subtract(3, 'month').format('YYYY-MM-DD'),
        docDateEnd: getParams.docDateEnd ? getParams.docDateEnd : moment().startOf('day').format('YYYY-MM-DD')
      },
      columns,
      data,
      isAllot: false,
      isDocData: true,
      dateFormat: 'YYYY-MM-DD',
      allotData: {
        type: 'proAllot',
        title: '产品调拨新增',
        typeCode: '20'
      },
      showUploadList: false,
      fileList: [],
      distList: [],
      percent: 0,
      uploading: false,
      proInfoData: {},
      isDetail: false,
      tableList: [],
      isAddPro: false,
      loadData: parameter => {
        return proAllotList(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.queryParam.size = res.data.pageSize
            const wareList = DataFilter(res, 'ware')
            this.tableList = wareList
            return wareList
          }
        )
      }
    }
  },
  created () {
    this.getAllocationList()
  },
  computed: {
    headerUpload () {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
  },
  methods: {
    moment,
    handleDist (value) {
      // console.log(value)
      this.queryParam.distCode = value
      this.bankList = []
      this.queryParam.whCodeTo = undefined
      this.getBankList()
    },
    getBankList () {
      const params = {
        page: 1,
        size: 10000
      }
      if (this.queryParam.distCode !== undefined) {
        params.distCode = this.queryParam.distCode
      } else {
        params.distCode = this.$store.state.user.info.distCode
      }
      retriveLocation(params).then(res => {
        // console.log(res);
        res.data.list.map(item => {
          if (item.type !== '4' && item.type !== '2') {
            this.bankList.push(item)
          }
        })
      })
      // console.log(this.bankList)
    },
    getAllocationList () {
      const params = this.$route.params
      if (params.docId) {
        this.allotData = {
          ...params,
          title: '新增产品调拨',
          type: 'stainedOut',
          docId: params.docId,
          docType: params.docType,
          typeCode: '20'
        }
        this.isAllot = true
      } else if (params.fileId) {
        this.allotData = {
          ...params,
          title: '新增产品调拨',
          type: 'stainedOut',
          fileId: params.fileId,
          fileType: params.fileType,
          typeCode: '20'
        }
        this.isAllot = true
      }
      userDistRange().then(res => {
        // console.info('res-date---',res)
        this.distList = res.data
      })
      this.getBankList()
    },
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
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
          '/amo/whAllocate/excelProduct/export',
          '产品调拨表'
        ).then(res => {
          this.loadingSpin = false
        })
      }
    },
    filterOption (input, option) {
      // console.log(input);
      if (input) {}
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleSearchParams () {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    handleReset () {
      this.bankList = []
      this.isDocData = false
      this.queryParam = {
        ...this.queryParam,
        distCode: undefined,
        docData: [],
        distNo: '',
        whCodeTo: undefined,
        docDate: null,
        docDateStart: null,
        docDateEnd: null
      }
      // console.log(this.queryParam.size)
    },
    handlePicker (date, dateString) {
      // console.info(date)
      if (date.length === 0) {
        this.value = null
        this.isDocData = false
        this.queryParam.docDateStart = null
        this.queryParam.docDateEnd = null
      } else {
        this.value = date
        this.queryParam.docData = date
        this.isDocData = true
        this.queryParam.docDateStart = moment(date[0]).format('YYYY-MM-DD')
        this.queryParam.docDateEnd = moment(date[1]).format('YYYY-MM-DD')
      }
    },
    handleDetail () {
      this.viewAllocation = true
    },
    handleBack () {
      this.isDetail = false
      this.isAllot = false
      this.allotData = {
        type: 'proAllot',
        title: '产品调拨新增',
        typeCode: '20'
      }
    },
    onMudleDown () {},
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
    handleAdd () {
      this.$router.push({
        name: 'Allocation_Edit',
        params: {
          parentCom: 'Allocation',
          pageTitle: '新增产品调拨',
          proType: 'proAllot',
          docType: '20'
        }
      })
      this.isAddPro = false
    },
    handleInfo (val) {
      const parmas = {
        parentCom: 'Allocation',
        proType: 'proAllot',
        pageTitle: '产品调拨详情',
        proInfo: val,
        docType: '20',
        page: this.queryParam.page,
        size: this.queryParam.size
      }
      this.$router.push({
        name: 'Allocation_Detail',
        params: parmas
      })
    }
  },
  destroyed () {
    this.loadingSpin = false
  }
}
</script>

<style lang="less">
.ant-card-bordered {
  border: none !important;
}
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
          .ant-select-selection--single {
            height: 44px;
            .ant-select-selection__rendered {
              height: 44px;
              line-height: 44px;
            }
          }
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
            &.ant-calendar-picker-input {
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
</style>
