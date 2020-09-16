<template>
  <div>
    <div class="adInput-input agentSearch" style=" cursor: pointer;">
      <a-form-item has-feedback>
        <!--<a-input
            placeholder="请输入经销商名称"
            style="width: 100%"
            v-model="queryModalParam.distName"
            class="selectDistName"
        >-->
        <a-input-search placeholder="请输入经销商名称" size="large" @search="agentSearch" v-model="queryModalParam.distName" class="selectDistName">
          <a-button slot="enterButton">搜索</a-button>
        </a-input-search>
      </a-form-item>
    </div>
    <a-table
      :columns="columnsDist"
      :dataSource="ModalData"
      :destroyOnClose="true"
      :loading="loading"
      rowKey="distCode"
      :pagination="pagination"
      :rowSelection="{type:'radio',selectedRowKeys:selectedRowKeys,onChange:onSelectChange}"
      @change="tableChange"
    ></a-table>
  </div>
</template>

<script>
import { retriveNameData } from '@/api/depot/depot'
const columnsDist = [
  {
    title: '经销商名称',
    dataIndex: 'distName'
  },
  {
    title: '经销商代码',
    dataIndex: 'distCode'
  }
]
export default {
  name: 'AgentTable',
  props: ['selectedRows'],
  data() {
    return {
      columnsDist,
      ModalData: [], // 经销商数据
      selectedRowKeys: [],
      selectedData: {},
      loading: true,
      pagination: {
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        total: 0
      },
      queryModalParam: {
        'page': 1,
        'size': 10,
        'distName': ''
      },
    }
  },
  watch: {
    selectedRows() {
      if (this.selectedRows.distName === undefined) {
        this.selectedRowKeys = []
        this.queryModalParam.distName = ''
        this.getModalData()
      }
    }
  },
  created() {
    this.getModalData()
  },
  methods: {
    agentSearch() { // 查询经销商
      this.getModalData()
    },
    tableChange(page, pageSize) { // 切换页码
      this.queryModalParam.page = page.current
      this.queryModalParam.size = page.pageSize
      this.getModalData()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = {
        distName: selectedRows[0].distName,
        distCode: selectedRows[0].distCode
      }
      this.$emit('selectedData', this.selectedData)
    },
    getModalData() { // 获取modal数据
      this.loading = true
      retriveNameData(this.queryModalParam).then(res => {
        this.ModalData = res.data.list
        this.loading = false
        const pagination = { ...this.pagination }
        pagination.total = res.data.total
        this.pagination = pagination
        this.pagination.pageSize = res.data.pageSize
      })
    },
  }
}
</script>

<style lang="less">
.agentSearch{
  .agentSearch{
    border: 1px solid #e3e3e3;
    height: 32px;
    margin-left: 0;
  }
  .ant-row{
    width: 385px;
    display: inline-block;
    input{
      height: 32px;
      border: 1px solid #e3e3e7;
      background: #fcfcfc;
    }
    .ant-input-search-button{
      height: 32px;
      border: 1px solid #e9e9e9;
    }
  }
  .ant-btn-primary{
    background: #3e4da8 !important;
    color: white;
  }
  .ant-btn-default{
    background: #f6f6f6 !important;
    color: #939393;
  }
  .table-page-search-submitButtons{
    float: right;
    button{
      width: 130px;
      height: 44px;
    }
  }
}
</style>
