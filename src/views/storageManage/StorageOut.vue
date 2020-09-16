<template>
  <a-card :bordered="false" v-if="isAdd === false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>出库单管理</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAddOut">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>创建出库单</span>
                </template>
                <i class="iconfont icon-plus"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导入</span>
                </template>
                <i class="iconfont icon-down"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-up"></i>
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="table-page-search-wrapper search-border">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="4" :sm="24" :span="6">
            <a-input v-model="queryParam.id" placeholder="输入单据编号" style="width: 100%" >
              <i class="iconfont icon-search" slot="prefix" />
            </a-input>
          </a-col>
          <a-col :md="4" :sm="24" :span="6">
            <a-select
              style="max-width: 268px; width: 100%;"
              placeholder="选择出库状态"
              @change="handleChange"
              v-model="queryParam.status"
            >
              <a-select-option v-for="item in Settlement" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" :sm="24" :span="6">
            <a-select
              style="max-width: 268px; width: 100%;"
              placeholder="选择出库类型"
              @change="handleChange"
              v-model="queryParam.status"
            >
              <a-select-option v-for="item in Settlement" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" :sm="24" :span="6">
            <a-range-picker
              :format="dateFormat"
              @change="onDateChange"
              :value="chnageTime"
            />
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="{textAlign: 'right'}">
              <a-button type="primary" @click="handleTable" size="small">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <!--<a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>-->
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <!--<template>-->
    <!--<div class="table-tag">-->
    <!--<a @click="handleData(item)" v-for="item in tableTab" :class="{'selected':item.selected === true}">{{item.name}}</a>-->
    <!--</div>-->
    <!--</template>-->
    <table-tags @handleCheck="tagChange"/>
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="status" slot-scope="text">
        <status-badage :status="text" :status-map="statusMap"/>
      </span>
      <span slot="status1" slot-scope="text">
        <status-badage :status="text" :status-map="statusMap1"/>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <div class="align-right">
            <a-button size="small" type="primary" @click="$refs.storageInfo.add()">详情</a-button>
            <a-button size="small" type="primary" @click="$refs.createModal.add()">打印</a-button>
            <a-dropdown v-if=" record.inStatus !== '1' ">
              <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item key="1"><a-icon type="user" />编辑</a-menu-item>
                <a-menu-item key="2"><a-icon type="user" />取消</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                更多 <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </div>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>
    <infor-modal ref="storageInfo" @ok="handleOk" />
  </a-card>
  <a-card v-else>
    <add-new-out @handleNewPro="handleBack" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, StatusBadage, TableTags } from '@/components'
import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import { storageOut } from '@/api/storage'
import AddNewOut from './AddNewOut'
import InforModal from './modules/InforModal'
import { DataFilter } from '@/utils/storage'

const statusMap = {
  1: {
    status: 'success',
    text: '调拨出库'
  },
  2: {
    status: 'processing',
    text: '发货出库'
  },
  3: {
    status: 'error',
    text: '其他出库'
  },
}
const statusMap1 = {
  1: {
    status: 'success',
    text: '已出库'
  },
  2: {
    status: 'processing',
    text: '待出库'
  },
}

const distData = [
  {
    id: 'dist01',
    name: '强生'
  },
  {
    id: 'dist02',
    name: '强生1'
  }
]

const Settlement = [
  {
    id: 'settle01',
    name: '已付款'
  },
  {
    id: 'settle02',
    name: '部分付款'
  },
  {
    id: 'settle03',
    name: '未付款'
  }
]

const tableTab = [
  {
    code: 'all',
    name: '全部',
    selected: true
  },
  {
    code: 'lastMonth',
    name: '上月',
    selected: false
  },
  {
    code: 'lastWeek',
    name: '上周',
    selected: false
  },
  {
    code: 'lastDay',
    name: '昨天',
    selected: false
  },
  {
    code: 'today',
    name: '今天',
    selected: false
  },
  {
    code: 'week',
    name: '本周',
    selected: false
  },
  {
    code: 'month',
    name: '本月',
    selected: false
  },
  {
    code: 'threeMonth',
    name: '近三个月',
    selected: false
  },
  {
    code: 'quarter',
    name: '本季度',
    selected: false
  },
  {
    code: 'year',
    name: '今年',
    selected: false
  }
]

export default {
  name: 'StorageOut',
  components: {
    TableTags,
    STable,
    CreateForm,
    StepByStepModal,
    StatusBadage,
    AddNewOut,
    InforModal
  },
  data () {
    const { meta } = this.$route
    return {
      mdl: {},
      distData,
      Settlement,
      dateFormat: 'YYYY/MM/DD',
      tableTab,
      startTime: '2019/05/01',
      endTime: '2019/05/08',
      isAdd: false,
      // 高级搜索 展开/关闭
      advanced: false,
      chnageTime: [moment('2019/05/01', 'YYYY/MM/DD'), moment('2019/05/08', 'YYYY/MM/DD')],
      // 查询参数
      queryParam: {
        'page': 1,
        'size': 5,
      },
      TitleSelect: meta.title,
      statusMap: statusMap,
      statusMap1: statusMap1,
      columns: [
        {
          title: '出库单编号',
          dataIndex: 'inCode'
        },
        {
          title: '出库日期',
          dataIndex: 'updateTime'
        },
        {
          title: '出库类型',
          dataIndex: 'inType',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '出库依据',
          dataIndex: 'basicCode'
        },
        {
          title: '客户名称',
          dataIndex: 'deliverOrg'
        },
        {
          title: '联系人',
          dataIndex: 'deliverName',
        },
        {
          title: '联系电话',
          dataIndex: 'deliverPhone',
        },
        {
          title: '状态',
          dataIndex: 'inStatus',
          scopedSlots: { customRender: 'status1' }
        },
        {
          title: '制单人',
          dataIndex: 'createBy',
        },
        {
          title: '制单时间',
          dataIndex: 'createTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('loadData.parameter', this.queryParam)
        return storageOut(Object.assign(parameter, this.queryParam))
          .then(res => {
            const storageList = DataFilter(res, 'storage')
            return storageList
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  created () {
    this.tableOption()
    // getRoleList({ t: new Date() })
  },
  watch: {
    tagChange(val) {
      this.startTime = val.start
      this.endTime = val.end
      console.info('val----', this.startTime, this.endTime)
    }
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },

    handleEdit (record) {
      console.log(record)
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.info(selectedRowKeys,selectedRows);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handleTable() {
      console.info('---字段', this.queryParam)
      this.$refs.table.refresh(true)
    },
    callback (key) {
      console.info(key)
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleData(val) {
      this.tableTab.map(item => {
        item.selected = false
      })
      val.selected = !val.selected
      // console.info('选择了---',val)
    },
    onDateChange(date, dateString) {
      console.log(date, dateString)
    },
    handleMenuClick(e) {
      console.log('click', e)
    },
    handleAddOut() {
      this.isAdd = true
    },
    handleBack() {
      this.isAdd = false
    },
    tagChange(val) {
      this.startTime = val.start
      this.endTime = val.end
      // this.queryParam.dataChange()
      this.chnageTime = [moment(val.start, this.dateFormat), moment(val.end, this.dateFormat)]
      this.queryParam.startDate = this.startTime
      this.queryParam.endDate = this.endTime
      console.info('val----', this.queryParam)
      this.$refs.table.refresh(true)
    },
    moment,
  }
}
</script>
<style lang="less">
  .align-right{
    text-align: right;
    button{
      margin: 0 0 0 8px;
    }
  }
  .ant-calendar-picker{
    .ant-input{
      background: rgba(247, 250, 255, 1);
      border: 1px solid rgba(205, 223, 252, 1);
      border-radius: 4px;
    }
    .anticon-calendar{
      color: rgba(66, 151, 255, 1);
    }
  }

</style>
