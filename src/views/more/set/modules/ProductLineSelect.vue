<template>
  <a-modal
    title="选择弹框"
    :width="800"
    :visible="visibleData"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
    class="selectWrap"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-input-search placeholder="请输入名称搜索" @search="onSearchName" v-model="lineName">
        <a-button slot="enterButton">搜索</a-button>
      </a-input-search>
      <a-table
        ref="table"
        rowKey="id"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelect: onCancleChange,
          onSelectAll:onAllSelect,
        }"
        @change="handleTableChange"
        :columns="columns"
        :dataSource="LineList"
        :pagination="pagination"
      />
    </a-spin>
  </a-modal>
</template>

<script>
import { userGetRole, permissionsLine } from '@/api/auth'
// import { DataFilter } from "@/utils/storage";
export default {
  props: ['visibleData', 'modalData'],
  mounted() {
    this.getLineList()
  },
  data() {
    return {
      selectedDist: [],
      lineName: null,
      visible: false,
      confirmLoading: false,
      queryParam: {
        page: 1,
        size: 10
      },
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      form: this.$form.createForm(this),
      LineList: [],
      columns: [
        {
          title: '产品线代码',
          dataIndex: 'lineCode',
          align: 'center'
        },
        {
          title: '产品线名称',
          dataIndex: 'lineName',
          align: 'center'
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      saveCusRowKey: [],
      saveCusRow: []
    }
  },
  methods: {
    onSearchName() {
      this.queryParam = {
        page: 1,
        size: 10,
        code: this.lineName
      }
      this.getLineList()
    },
    // 分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      //   this.queryParam = {
      //     page: pagination.current,
      //     size: pagination.pageSize
      //   };
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getLineList()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.saveCusRowKey = this.selectedRowKeys
          this.saveCusRow = this.selectedRows
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
      this.selectedRows = this.saveCusRow
      this.selectedRowKeys = this.saveCusRow.map((item, index) => {
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
      //   this.selectedDist = [];
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      //   selectedRows.map(item => {
      //     this.selectedDist.push({
      //       key: item.id,
      //       id: item.id,
      //       lineName: item.lineName
      //     });
      //   });
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
    getLineList() {
      permissionsLine(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
          this.LineList = res.data.list.map((item, index) => {
            return {
              key: item.id,
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
        this.saveCusRow = newValue
        if (Array.isArray(newValue) && newValue.length > 0) {
          this.selectedRowKeys = newValue.map(item => {
            return item.id
          })
          this.selectedDist = JSON.parse(JSON.stringify(newValue))
        } else if (newValue.length == 0) {
          this.selectedRowKeys = []
          this.selectedDist = []
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
//弹框中的搜索框
.selectWrap{
  .ant-modal-content {
    .ant-input-affix-wrapper {
      margin-bottom: 20px;
      width: 328px;
      height: 32px;
    }
    .ant-input-suffix {
      .ant-btn {
        background-color: #e9e9e9;
        border-color: #e9e9e9;
      }
    }
  }
}
</style>
