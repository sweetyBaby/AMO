<template>
  <div>
    <a-card :bordered="false" v-if="currentState== 'default'">
      <div class="page_Title">
        <h3>仓库调拨</h3>
        <div>
          <ul class="toolbar">
            <i class="iconfont icon-plus" @click="addNew('add')"></i>
            <i class="iconfont icon-use"></i>
            <i class="iconfont icon-unuse"></i>
            <i class="iconfont icon-empty"></i>
          </ul>
        </div>
      </div>
      <div class="table-page-search-wrapper search-border">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="4" :sm="24" :span="6">
              <a-input v-model="queryParam.id" placeholder="请输入" style="width: 100%">
                <i class="iconfont icon-search" slot="prefix" />
              </a-input>
            </a-col>
            <a-col :md="4" :sm="24" :span="6">
              <a-select style="max-width: 268px; width: 100%;" placeholder="选择调入仓库" @change="selectFounder" v-model="queryParam.founder">
                <a-select-option v-for="item in distData" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="4" :sm="24" :span="6">
              <a-select style="max-width: 268px; width: 100%;" placeholder="选择状态" @change="selectApproval" v-model="queryParam.status">
                <a-select-option v-for="item in Settlement" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="4" :sm="24" :span="6">
              <a-range-picker class="datePicker" :placeholder="['起始日期', '截止日期']" :disabledDate="disabledDate" format="YYYY-MM-DD" v-model="queryParam.rangeTime">
                <i class="iconfont icon-date" style="color:#4283ff" slot="suffixIcon" />
              </a-range-picker>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="{textAlign: 'right'} ">
                <a-button type="primary" @click="this.$refs.table.refresh()" size="small">确定</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <table-tags @handleCheck="handleTag" />
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection">
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-left">
              <a-button v-if=" record.status !== '1' " size="small" type="primary" @click="handleEdit(record)">编辑</a-button>
              <a-button size="small" type="default" @click="printCopy">打印</a-button>
            </div>
          </template>
        </span>
      </s-table>
    </a-card>
  <!-- <trans-feradd v-else-if="currentState== 'add'"></trans-feradd> -->
  </div>

</template>

<script>
import moment from 'moment'
import { STable, TableTags } from '@/components'
import { getAuditList } from '@/api/manage'
// import TransFeradd from './modules/warehouseTransferAdd'
const statusMap = {
  1: {
    status: 'success',
    text: '已审核'
  },
  2: {
    status: 'error',
    text: '未审核'
  }
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

export default {
  name: 'Purchase',
  components: {
    TableTags,
    STable,
    // TransFeradd
  },
  data() {
    return {
      distData,
      Settlement,
      // 当前状态
      currentState: 'default',
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '状态',
          dataIndex: 'id'
        },
        {
          title: '调拨编号',
          dataIndex: 'auditName'
        },
        {
          title: '调拨日期',
          dataIndex: 'auditAdress'
        },
        {
          title: '调拨出库',
          dataIndex: 'concat'
        },
        {
          title: '调拨入库',
          dataIndex: 'tel'
        },
        {
          title: '制单人',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '制单时间',
          dataIndex: 'lastAudit'
        },
        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('loadData.parameter', parameter)
        return getAuditList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    }
  },
  filters: {
    // 状态选择
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {},
  methods: {
    // 新增调拨单
    addNew() {
      this.currentState = 'add'
    },
    // 选择状态
    selectApproval() {},
    // 选择调入仓库
    selectFounder() {},
    // 切换tag
    handleTag(data) {
      console.log(data)
    },
    // 不可选择的日期
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    // 审核
    handleEdit() {
    },
    // 打印
    printCopy() {}
  }
}
</script>
<style lang="less" scoped>
.align-left {
  text-align: left;
  button {
    margin: 0 0 0 8px;
    border: none;
    background: #f4f7fc;
    border-radius: 4px;
    color: #8baede;
  }
}
.datePicker {
  width: 260px !important;
  > span.ant-calendar-picker-input {
    background: #f4f7fc !important;
    border: 1px solid #cddffc !important;
  }
}
</style>
