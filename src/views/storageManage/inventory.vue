<template>
  <a-card :bordered="false">
    <div class="page_Title">
      <h3>库存清单</h3>
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
            <a-select style="max-width: 268px; width: 100%;" placeholder="选择厂家" @change="selectFounder" v-model="queryParam.founder">
              <a-select-option v-for="item in distData" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" :sm="24" :span="6">
            <a-select style="max-width: 268px; width: 100%;" placeholder="选择库存状态" @change="selectApproval" v-model="queryParam.status">
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
    <s-table ref="table" size="default" rowKey="key" :columns="columns" :data="loadData" >

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
    </s-table>
    <!-- <create-form ref="createModal" @ok="handleOk" /> -->
    <!-- <step-by-step-modal ref="modal" @ok="handleOk"/> -->
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getAuditList } from '@/api/manage'

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
  name: 'Purchase',
  components: {
    STable,
  },
  data() {
    return {
      tableTab,
      distData,
      Settlement,

      mdl: {},
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '图片',
          dataIndex: 'id'
        },
        {
          title: '商品名称',
          dataIndex: 'auditName'
        },
        {
          title: '货号',
          dataIndex: 'auditAdress'
        },
        {
          title: '单位',
          dataIndex: 'concat'
        },
        {
          title: '厂商',
          dataIndex: 'tel'
        },
        {
          title: '库存数量',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '销售库存',
          dataIndex: 'lastAudit'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('loadData.parameter', parameter)
        return getAuditList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
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
    // 选择库存状态
    selectApproval() {},
    // 选择厂家
    selectFounder() {},
    // 不可选择的日期
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
  }
}
</script>
<style lang="less">
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
