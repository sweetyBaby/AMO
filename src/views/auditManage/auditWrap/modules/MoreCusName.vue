<template>
  <a-modal
    :title="cusData.title"
    :visible="visible"
    @ok="handleOk"
    width="800px"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <template>
      <a-row>
        <a-col :span="16">
          <span v-show="cusNameEmpty" class="cusNameEmpty">还未选择任何数据！</span>
        </a-col>
        <a-col :span="8" v-if="cusData.type === 'cus'">
          <a-input-search
            placeholder="请输入客户名称"
            @search="onSearch()"
            v-model="queryParam.hosName"
            :style="{'margin-bottom':'16px'}"
          >
            <!--        <a-button slot="enterButton">搜索</a-button>-->
          </a-input-search>
        </a-col>
        <a-col :span="8" v-else>
          <a-input-search
            placeholder="请输入经销商名称"
            @search="onSearch()"
            v-model="queryParam.distName"
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
          selectedRowKeys: selectedRowKeys,
          onSelect: onSelectCall,
          onSelectAll: onSelectAll
        }"
        @change="handleTableChange"
        rowKey="id"
        :destroyOnClose="true"
        :customRow="handleCheck"
      ></a-table>
    </template>
  </a-modal>
</template>

<script>
import { unAuthHosList, userDistRange } from '@/api/depot/wareHouse'
import { retriveHosData, retriveDealersData } from '@/api/basicInfo/hosData'
const columns1 = [
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
]
const columnsDist = [
  {
    title: '经销商代码',
    dataIndex: 'distCode',
    align: 'left'
  },
  {
    title: '经销商名称',
    dataIndex: 'distName',
    align: 'left'
  }
]
export default {
  name: 'SelectCusName',
  props: ['visible', 'cusData'],
  created () {
    this.getFirst()
    if (this.cusData.type === 'dist') {
      this.AllSelectedList = this.cusData.distCode ? JSON.parse(JSON.stringify(this.cusData.distCode)) : []
    } else {
      this.AllSelectedList = this.cusData.cusCode ? JSON.parse(JSON.stringify(this.cusData.cusCode)) : []
    }
  },
  data () {
    return {
      loading: true,
      columns: columns1,
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
        distName: '',
        hosName: ''
      },
      selectedRowKeys: [],
      selectCus: [],
      selectedRows: [],
      cusNameEmpty: false,
      distList: [],
      selectedList: [],
      AllSelectedList: []
    }
  },
  methods: {
    handleOk () {
      // console.info('this.AllSelectedList', this.AllSelectedList)
      if (this.selectedRowKeys.length === 0) {
        this.cusNameEmpty = true
      } else {
        // console.info('this.selectCus====', this.AllSelectedList)
        this.$emit('selectCus', this.AllSelectedList)
        this.selectCus = []
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    },
    handleCancel () {
      this.$emit('selectCancle')
      this.selectCus = []
    },
    onSearch () {
      this.getFirst()
    },
    handleCheck (record, index) {
      return {
        on: {
          click: () => {
            // console.info('record=====', record, this.AllSelectedList)
            const selKey = this.selectedRowKeys.findIndex(selKey => selKey === record.id)
            const checkIndex = this.selectedRows.findIndex(check => check.id === record.id)
            const selectId = this.AllSelectedList.findIndex(sel => sel.id === record.id)
            if (checkIndex === -1) {
              this.selectedRowKeys.push(record.id)
              this.selectedRows.push(record)
              this.AllSelectedList.push(record)
            } else {
              this.selectedRowKeys.splice(selKey, 1)
              this.selectedRows.splice(checkIndex, 1)
              this.AllSelectedList.splice(selectId, 1)
            }
          }
        }
      }
    },
    getFirst (val) {
      // console.info('this.AllSelectedList===', this.AllSelectedList)
      this.loading = true
      if (!val) {
        this.selectCus = this.cusData
      }
      if (this.cusData.type === 'cus') {
        if (!val) {
          this.columns = columns1
          this.selectedRowKeys = this.cusData.cusCode ? this.cusData.cusCode.map(item => item.id) : []
        }
        retriveHosData(this.queryParam).then(res => {
          if (res.message === 'SUCCESS') {
            this.loading = false
            this.tableDatas = res.data.list
            this.pagination = {
              ...this.pagination,
              total: res.data.total
            }
            if (this.cusData.cusCode) {
              this.cusData.cusCode.map(item => {
                res.data.list.forEach(list => {
                  if (list.id === item.id) {
                    this.selectedRows.push(list)
                  }
                })
              })
            }
          }
        })
      } else {
        if (!val) {
          this.columns = columnsDist
          this.selectedRowKeys = this.cusData.distCode ? this.cusData.distCode.map(item => item.id) : []
        }
        retriveDealersData(this.queryParam).then(res => {
          if (res.message === 'SUCCESS') {
            this.loading = false
            this.tableDatas = res.data.list
            this.pagination = {
              ...this.pagination,
              total: res.data.total
            }
            if (this.cusData.distCode) {
              this.cusData.distCode.map(item => {
                res.data.list.forEach(list => {
                  if (list.id === item.id) {
                    this.selectedRows.push(list)
                  }
                })
              })
            }
          }
        })
      }
      if (this.AllSelectedList.length > 0) {
        this.AllSelectedList.map(item => {
          if (this.selectedRowKeys.findIndex(key => key === item.id) === -1) {
            this.selectedRowKeys.push(item.id)
          }
          if (this.selectedRows.findIndex(row => row.id === item.id) === -1) {
            this.selectedRows.push(item)
          }
        })
      }
      this.$nextTick(() => {
        document.getElementsByClassName('ant-modal-body')[0].scrollTop = 0
      })
    },
    onSelectCall (record, selected, selectedRows) {
      // console.info('record====', record)
      const checkIndex = this.selectedRows.findIndex(check => check.id === record.id)
      const selKey = this.selectedRowKeys.findIndex(selKey => selKey === record.id)
      const selectId = this.AllSelectedList.findIndex(sel => sel.id === record.id)
      if (checkIndex === -1 && selected) {
        this.selectedRowKeys.push(record.id)
        this.selectedRows.push(record)
      } else {
        this.selectedRowKeys.splice(selKey, 1)
        this.selectedRows.splice(checkIndex, 1)
      }
      if (selectId === -1) {
        this.AllSelectedList.push(record)
      } else {
        this.AllSelectedList.splice(selectId, 1)
      }
    },
    onSelectAll (selected, selectedRows, changeRows) {
      // console.info('selected===', selected, changeRows)
      changeRows.map(item => {
        const checkIndex = this.selectedRowKeys.indexOf(item.id)
        const selId = this.AllSelectedList.findIndex(sel => sel.id === item.id)
        const selKey = this.selectedRowKeys.findIndex(selKey => selKey === item.id)
        // console.info('checkIndex', checkIndex, 'selId===', selId)
        if (selId < 0 && selected) {
          this.selectedRowKeys.push(item.id)
          this.AllSelectedList.push(item)
          this.selectedRows.push(item)
        } else if (selId > -1 && !selected) {
          // console.info('6666')
          this.selectedRowKeys.splice(selKey, 1)
          this.selectedRows.splice(checkIndex, 1)
          this.AllSelectedList.splice(selId, 1)
        }
      })
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
      this.getFirst('page')
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
