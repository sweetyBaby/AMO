<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>产品明细</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-table :columns="columns" :dataSource="data">
        <span slot="action" slot-scope="text, record">
          <a-divider type="vertical" />
          <a href="javascript:;">Delete</a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { STable } from '@/components'
// import { DataFilter } from '@/utils/storage'
// import { allocationDetails } from '@/api/storage'

const columns = [{
  dataIndex: 'name',
  key: 'name',
  slots: { title: 'customTitle' },
  align: 'center',
  scopedSlots: { customRender: 'name' },
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
  align: 'center'
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
  align: 'center'
}, {
  title: 'Tags',
  key: 'tags',
  dataIndex: 'tags',
  scopedSlots: { customRender: 'tags' },
  align: 'center'
}, {
  title: 'Action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  align: 'center'
}]

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}]

export default {
  name: 'AllocationDetail',
  components: {
    STable
  },
  // props:{detailsData},
  data() {
    return {
      data,
      columns,
    }
  },
  created() {

  },
  methods: {
    // 返回主页面
    handleBack() {
      this.$emit('viewAllocation', false)
    }
  }
}
</script>

<style lang="less">
  .ant-card-bordered{
    border: none !important;
  }
</style>
