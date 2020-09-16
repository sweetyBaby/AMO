<template>
  <a-modal
    title="选择配送商"
    :visible="visible"
    @ok="handleOk"
    width="800px"
    :maskClosable="false"
    @cancel="handleCancel">
    <template>
      <a-row>
        <a-col :span="16">
          <span v-show="cusNameEmpty" class="cusNameEmpty">还未选择任何数据！</span>
        </a-col>
        <a-col :span="8">
          <a-input-search placeholder="请输入配送商名称" @search="onSearch()" v-model="queryParam.cusName" :style="{ 'margin-bottom': '16px' }">
            <!-- <a-button slot="enterButton">搜索</a-button>-->
          </a-input-search>
        </a-col>
      </a-row>

      <a-table
        ref="table"
        :columns="columns"
        :dataSource="tableDatas"
        :pagination="pagination"
        :loading="loading"
        :rowSelection="{
          type: 'radio',
          onChange: onSelectChange,
          selectedRowKeys: selectedRowKeys,
        }"
        @change="handleTableChange"
        rowKey="cusCode"
        :destroyOnClose="true"
        :customRow="handleCheck"></a-table>
    </template>
  </a-modal>
</template>

<script>
import { getDistributionCusListForOptions } from '@/api/depot/wareHouse'
export default {
  name: 'SelectDistributor',
  props: ['visible', 'distCode'],
  created() {
    this.getFirst()
  },
  data() {
    return {
      loading: true,
      columns: [{
        title: '配送商代码',
        dataIndex: 'cusCode',
        align: 'left',
      },
      {
        title: '配送商名称',
        dataIndex: 'cusName',
        align: 'left',
      },
      ],
      tableDatas: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共有 ${total} 条数据`,
      },
      queryParam: {
        page: 1,
        size: 10,
        // distCode: this.distCode,
        cusName: '',
        cusCode: '',
        province: '',
        city: '',
      },
      selectedRowKeys: [],
      selectCus: null,
      selectedRows: [],
      cusNameEmpty: false,
    }
  },
  methods: {
    handleOk() {
      if (this.selectedRowKeys.length === 0) {
        this.cusNameEmpty = true
      } else {
        this.$emit('selectCus', this.selectCus)
        this.selectCus = []
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    },
    handleCancel() {
      this.$emit('selectCancle')
    },
    onSearch() {
      this.getFirst()
    },
    handleCheck(record, index) {
      return {
        on: {
          click: () => {
            this.selectedRowKeys = [record.cusCode]
            this.selectedRows = [record]
            this.selectCus = {
              cusCode: record.cusCode,
              cusName: record.cusName,
            }
          },
        },
      }
    },
    getFirst() {
      const _this = this
      getDistributionCusListForOptions(this.queryParam).then((res) => {
        _this.tableDatas = res.data
        _this.pagination.total = res.data.length
        _this.loading = false
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.selectCus = {
        cusCode: selectedRows[0].cusCode,
        cusName: selectedRows[0].cusName,
      }
    },

    // 分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam = {
        ...this.queryParam,
        page: pagination.current,
        size: pagination.pageSize,
      }
      this.getFirst()
    },
  },
}
</script>

<style scoped>
.cusNameEmpty {
    color: red;
    font-size: 14px;
}
</style>
