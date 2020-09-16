<template>
  <a-modal
    title="选择弹框"
    :width="800"
    :visible="visibleData"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <!-- <div class="table-page-search-wrapper search-border">
        <a-form layout="inline">
          <a-row>
            <a-col :md="12" :sm="24">
              <a-input v-model="queryParam.id" placeholder="输入名称" style="width: 260px">
                <a-icon slot="prefix" type="search" />
                <i slot="prefix" class="iconfont icon-search"/>
              </a-input>
            </a-col>
            <a-col :md="12" :sm="24">
            <span class="table-page-search-submitButtons" style="text-align: right">
              <a-button type="primary" @click="$refs.table.refresh(true)" size="small">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>-->
      <!--<s-table-->
      <!--ref="table"-->
      <!--size="default"-->
      <!--rowKey="key"-->
      <!--:columns="columns"-->
      <!--:data="loadData"-->
      <!--:alert="options.alert"-->
      <!--:rowSelection="options.rowSelection"-->
      <!--&gt;-->
      <!--<span slot="serial" slot-scope="text, record, index">-->
      <!--{{ index + 1 }}-->
      <!--</span>-->
      <!--<span slot="status" slot-scope="text">-->
      <!--<a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>-->
      <!--</span>-->

      <!--<span slot="action" slot-scope="text, record">-->
      <!--<template>-->
      <!--<div class="align-right">-->
      <!--<a-button v-if=" record.status !== '1' " size="small" type="primary" @click="handleEdit(record)">审核</a-button>-->
      <!--<a-button size="small" type="default" @click="$refs.createModal.add()">查看</a-button>-->
      <!--</div>-->
      <!--</template>-->
      <!--</span>-->
      <!--</s-table>-->
      <a-input-search placeholder="请输入名称搜索" @search="onSearchName" v-model="distName">
        <a-button slot="enterButton">搜索</a-button>
      </a-input-search>
      <a-table
        ref="table"
        rowKey="id"
        :pagination="pagination"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelect: onCancleChange,
          onSelectAll:onAllSelect,
        }"
        @change="handleTableChange"
        :columns="columns"
        :dataSource="listData"
      />
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { retriveNameData } from '@/api/basicInfo/hosData'
import { DataFilter } from '@/utils/storage'
export default {
  props: ['visibleData', 'modalData'],
  components: {
    STable
  },
  mounted() {
    console.log(this.modalData)
    this.getOrgList()
  },
  data() {
    console.log(this.modalData)
    return {
      selectedDist: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      distName: null,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      queryParam: {
        page: 1,
        size: 10
      },
      form: this.$form.createForm(this),
      listData: [],
      columns: [
        {
          title: '经销商名称',
          dataIndex: 'distName',
          align: 'left'
        },
        {
          title: '经销商代码',
          dataIndex: 'distCode',
          align: 'left'
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      saveDistRowKey: [],
      saveDistRow: []
    }
  },
  methods: {
    onSearchName() {
      this.queryParam = {
        page: 1,
        size: 10,
        distName: this.distName
      }
      this.getOrgList()
    },

    // 分页
    handleTableChange(pagination) {
      this.confirmLoading = true
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getOrgList()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.saveDistRowKey = this.selectedRowKeys
          this.saveDistRow = this.selectedRows
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', this.selectedDist)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.selectedRows = []
      this.selectedRowKeys = []
      this.selectedRows = this.saveDistRow
      this.selectedRowKeys = this.saveDistRow.map((item, index) => {
        return item.id
      })
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1,
        size: 10
      }
      this.$emit('cancel', this.selectedDist)
    },
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
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
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onCancleChange(record, selected, selectedRows, nativeEvent) {
      this.selectedRows = selectedRows
      if (selected) {
        for (let i = 0; i < selectedRows.length; i++) {
          const index = this.selectedDist.findIndex((value, index) => {
            return selectedRows[i].id == value.id
          })
          if (index < 0) {
            this.selectedDist.push(selectedRows[i])
          }
        }
      } else {
        const index = this.selectedDist.findIndex((value, index) => {
          return record.id == value.id
        })
        if (index >= 0) {
          console.log(index)
          this.selectedDist.splice(index, 1)
        }
      }
    },
    onAllSelect(selected, selectedRows, changeRows) {
      if (selected) {
        for (let i = 0; i < selectedRows.length; i++) {
          const index = this.selectedDist.findIndex((value, index) => {
            return selectedRows[i].id == value.id
          })
          if (index < 0) {
            this.selectedDist.push(selectedRows[i])
          }
        }
      } else {
        for (let i = 0; i < changeRows.length; i++) {
          const index = this.selectedDist.findIndex((value, index) => {
            return changeRows[i].id == value.id
          })
          if (index >= 0) {
            console.log(index)
            this.selectedDist.splice(index, 1)
          }
        }
      }
    },
    getOrgList() {
      retriveNameData(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.confirmLoading = false
          const pagination = { ...this.pagination }
          this.pagination = pagination
          pagination.total = res.data.total
          this.listData = res.data.list.map((item, index) => {
            return {
              key: item.distCode,
              ...item
            }
          })
        }
      })
      if (this.$refs.table) {
        document.getElementsByClassName('ant-modal-body')[0].scrollTop = 0
      }
    }
  },
  watch: {
    modalData: {
      handler(newValue, oldValue) {
        this.saveDistRow = newValue
        if (Array.isArray(newValue) && newValue.length > 0) {
          this.selectedRowKeys = newValue.map(item => {
            return item.id
          })
          this.selectedDist = JSON.parse(JSON.stringify(newValue))
        } else if (newValue.length == 0) {
          this.selectedRowKeys = []
          this.selectedDist = []
        }
        // console.info('this.selectedRowKeys====',this.selectedRowKeys)
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
</style>
