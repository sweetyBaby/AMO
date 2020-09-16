<template>
  <a-card :bordered="false">
    <div class="page_Title">
      <div class="flex_left">
        <h3>盘库异常 178789</h3>
      </div>
      <div>
        <ul class="toolbar">
          <i class="iconfont icon-back"></i>
          <i class="iconfont icon-up"></i>
          <i class="iconfont icon-empty"></i>
          <i class="iconfont icon-down"></i>
          <i class="iconfont icon-save"></i>
        </ul>
      </div>
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
            <a-range-picker
              :format="dateFormat"
              @change="onDateChange"
              :value="chnageTime"
            />
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="{textAlign: 'right'}">
              <a-button type="primary" size="small">确定</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="content">
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
        <!-- <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span> -->

        <span slot="action" slot-scope="text, record" width="100px">
          <template>
            <div class="align-left">
              <a-button size="small" type="primary" @click="deleteRow(record)">删除</a-button>
              <a-button size="small" type="default" @click="remove(record)">移动到正常</a-button>
            </div>
          </template>
        </span>
      </s-table>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getAuditList } from '@/api/manage'
export default {
  name: 'LibraryException',
  components: {
    STable
  },
  data() {
    return {
      // 搜索条件
      queryParam: {},
      columns: [
        {
          title: '产品码',
          dataIndex: 'inCode'
        },
        {
          title: '产品名称',
          dataIndex: 'updateTime'
        },
        {
          title: '型号',
          dataIndex: 'inType',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '失效日期',
          dataIndex: 'basicCode'
        },
        {
          title: '产品批次',
          dataIndex: 'deliverOrg'
        },
        {
          title: '操作',
          width: '180px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getAuditList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
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
  created() {},
  methods: {
    // 删除
    deleteRow() {},
    // 移动到正常
    remove() {}
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
</style>
