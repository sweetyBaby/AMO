<template>
  <a-card :bordered="false">
    <div class="page_Title">
      <h3>仓库信息</h3>
      <div>
        <ul class="toolbar">
          <i class="iconfont icon-plus"></i>
          <i class="iconfont icon-use"></i>
          <i class="iconfont icon-unuse"></i>
          <i class="iconfont icon-empty"></i>
        </ul>
      </div>
    </div>
    <!-- <div class="table-page-search-wrapper search-border"> -->
    <div class="searchHeader search-border">
      <a-input :value="searchValue" placeholder="输入" style="width: 170px">
        <i class="iconfont icon-search" slot="prefix" />
      </a-input>
      <div>
        <a-button type="primary" size="small">确定</a-button>
        <a-button style="margin-left: 8px" @click="() => searchValue = {}" size="small">重置</a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :locale="{emptyText: '暂无数据'}"
    >
      <template slot="name" slot-scope="text">
        <div class="textTruncate" style="width:200px">{{ text }}</div>
      </template>
      <template slot="action" slot-scope="text">
        <div class="common_action_btns">
          <a-button class="button" size="small" type="default">编辑</a-button>
          <a-button class="button" size="small" type="default">禁用</a-button>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
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
const data = [
  {
    key: '1',
    name: 'asrieuasrieuqwaieuasrieuqwaieuqwaieu',
    leixing: 'daima'
  }
]
const columns = [
  {
    title: '状态',
    dataIndex: 'state',
    width: 100
  },
  {
    title: '仓库名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '仓库类型',
    dataIndex: 'leixing',
  },
  {
    title: '负责人',
    dataIndex: '',
  },
  {
    title: '联系电话',
    dataIndex: '',
  },
  {
    title: '仓库地址',
    dataIndex: '',
    width: 200
  },

  {
    title: '操作',
    width: '150px',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'OrderAdd',
  components: {},
  data() {
    return {
      // 表格头部
      columns,
      // 表格数据
      data,
      // 分页
      pagination: {},
      // 搜索值
      searchValue: '',
    }
  },
  filters: {
  },
  created() {},
  methods: {

  }
}
</script>
<style lang="less" scoped>
.searchHeader{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  i{
    color:#4283FF;
  }
}
</style>
