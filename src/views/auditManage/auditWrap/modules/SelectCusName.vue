<template>
  <a-modal
    title="选择客户名称"
    :visible="visible"
    @ok="handleOk"
    width="800px"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <template>
      <a-row>
        <a-col :span="16">
          <span v-show="cusNameEmpty" class="cusNameEmpty">客户名称不能为空！</span>
        </a-col>
        <a-col :span="8">
          <a-input-search
            placeholder="请输入客户名称"
            @search="onSearch()"
            v-model="queryParam.hosName"
            :style="{'margin-bottom':'16px'}"
          >
            <!--        <a-button slot="enterButton">搜索</a-button>-->
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
          type:'radio',
          onChange: onSelectChange,
          selectedRowKeys: selectedRowKeys
        }"
        @change="handleTableChange"
        rowKey="hosCode"
        :destroyOnClose="true"
        :customRow="handleCheck"
      ></a-table>
    </template>
  </a-modal>
</template>

<script>
import { unAuthHosList } from '@/api/depot/wareHouse'
import { retriveHosData } from '@/api/basicInfo/hosData'
export default {
  name: 'SelectCusName',
  props: ['visible', 'cusData'],
  created () {
    this.getFirst()
  },
  data () {
    return {
      loading: true,
      columns: [
        {
          title: '客户代码',
          dataIndex: 'hosCode',
          align: 'left'
        },
        {
          title: '客户名称',
          dataIndex: 'hosName',
          align: 'left'
        }
      ],
      tableDatas: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      queryParam: {
        page: 1,
        size: 10,
        distCode: this.cusData.distCode,
        hosName: ''
      },
      selectedRowKeys: [],
      selectCus: {},
      selectedRows: [],
      cusNameEmpty: false
    }
  },
  methods: {
    handleOk () {
      // console.info('this.selectCus====', this.selectCus)
      if (this.selectedRowKeys.length === 0) {
        this.cusNameEmpty = true
      } else {
        this.$emit('selectCus', this.selectCus)
        this.selectCus = {}
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    },
    handleCancel () {
      this.$emit('selectCancle')
      this.selectCus = {}
    },
    onSearch () {
      this.getFirst()
    },
    handleCheck (record, index) {
      return {
        on: {
          click: () => {
            // console.info('this.selectedRowKeys----',this.selectedRowKeys,'record---',record);
            this.selectedRowKeys = [record.hosCode]
            this.cusNameEmpty = false
            this.selectedRows = [record]
            this.selectCus = {
              cusCode: record.hosCode,
              cusName: record.hosName,
              needInvoice: record.needInvoice,
              cusKey: this.cusData.cusKey
            }
          }
        }
      }
    },
    getFirst () {
      // console.info('this.cusData', this.cusData)
      if (this.cusData.cusCode) {
        this.selectedRowKeys = [this.cusData.cusCode]
        this.selectCus = this.cusData
      }
      if (this.cusData.type && this.cusData.type === 'all') {
        retriveHosData(this.queryParam).then(res => {
          // console.info('unAuthHosList====',res)
          this.tableDatas = res.data.list
          this.pagination = {
            ...this.pagination,
            total: res.data.total
          }
          this.loading = false
        })
      } else {
        unAuthHosList(this.queryParam).then(res => {
          // console.info('unAuthHosList====',res)
          this.tableDatas = res.data.list
          this.pagination = {
            ...this.pagination,
            total: res.data.total
          }
          this.loading = false
        })
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.info('-----',selectedRows);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.selectCus = {
        cusCode: selectedRows[0].hosCode,
        cusName: selectedRows[0].hosName,
        needInvoice: selectedRows[0].needInvoice,
        cusKey: this.cusData.cusKey
      }
    },
    // 分页
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam = {
        ...this.queryParam,
        page: pagination.current,
        size: pagination.pageSize
      }
      this.getFirst()
    }
  }
}
</script>

<style scoped>
.cusNameEmpty{
  color: red;
  font-size: 14px;
}
</style>
