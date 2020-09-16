<template>
  <a-card :bordered="false" v-if="currentState == 'default'">
    <template v-if="isData">
      <div class="page_Title">
        <h3>仓库盘点</h3>
        <ul class="toolbar">
          <i class="iconfont icon-plus" @click="addNew()"></i>
        </ul>
      </div>
      <div class="table-page-search-wrapper search-border">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="4" :sm="24" :span="6">
              <a-input v-model="queryParam.id" placeholder="请输入单据号" style="width: 100%">
                <i class="iconfont icon-search" slot="prefix" />
              </a-input>
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
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection">
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-left">
              <a-button v-if=" record.status !== '1' " size="small" type="primary" @click="handleStart(record)">审核</a-button>
              <a-button size="small" type="default">查看</a-button>
            </div>
          </template>
        </span>
      </s-table>
    </template>

    <div v-else class="nodata">
      <p>盘点操作步骤</p>
      <ul class="flex_box">
        <li>
          <p>第一步</p>
          <p>点击新建盘库开始盘库</p>
        </li>
        <li>
          <p>第二步</p>
          <p>点击邀请成员加入盘库</p>
        </li>
        <li>
          <p>第三步</p>
          <p>盘完后点击保存后下载</p>
        </li>
      </ul>
    </div>
  </a-card>
  <library-already v-else-if="currentState == 'already'" >
  </library-already>
  <library-exception v-else-if="currentState == 'exception'"></library-exception>
  <library-member v-else-if="currentState == 'member'"></library-member>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getAuditList } from '@/api/manage'
import libraryAlready from './modules/libraryAlready'
import libraryException from './modules/libraryException'
import libraryMember from './modules/libraryMember'
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
    libraryAlready,
    libraryException,
    libraryMember
  },
  data() {
    return {
      tableTab,
      Settlement,
      // 当前页面状态
      currentState: 'member',
      // 当前是否有数据
      isData: false,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '单据编号',
          dataIndex: 'id'
        },
        {
          title: '合作商名称',
          dataIndex: 'auditName'
        },
        {
          title: '合作商地址',
          dataIndex: 'auditAdress'
        },
        {
          title: '联系人',
          dataIndex: 'concat'
        },
        {
          title: '联系电话',
          dataIndex: 'tel'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '最后一次审核人',
          dataIndex: 'lastAudit'
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime'
        },
        {
          title: '审核总次数',
          dataIndex: 'auditCounts'
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
    // 新增盘点单
    addNew() {},
    // 不可选择的日期
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    // 开始
    handleStart() {
    }
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
.nodata{
  text-align: center;
  .flex_box{
    width: 60%;
    margin:auto;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    li{
      padding:0 20px;
      flex:1;
    }
  }
}
</style>
