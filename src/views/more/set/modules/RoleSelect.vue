<template>
  <a-modal
    title="选择弹框"
    :width="800"
    :visible="visibleData"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
    class="roleSelect"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-input-search placeholder="请输入名称搜索" @search="onSearchName" v-model="roleName">
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
        :dataSource="RoleList"
        :pagination="pagination"
      />
    </a-spin>
  </a-modal>
</template>

<script>
import { userGetRole } from '@/api/auth'
import { DataFilter } from '@/utils/storage'
export default {
  props: ['visibleData', 'modalData'],
  mounted() {
    this.getRoleList()
  },
  data() {
    return {
      saveRoleRowKey: [],
      saveRoleRow: [],
      selectedDist: [],
      roleName: null,
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
      RoleList: [],
      columns: [
        {
          title: '角色名称',
          dataIndex: 'roleName',
          align: 'center'
        },
        {
          title: '角色ID',
          dataIndex: 'id',
          align: 'center'
        }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    // handleCheck(record, index) {
    //   return {
    //     on: {
    //       click: () => {
    //         const checkIndex = this.selectedRowKeys.indexOf(record.id);
    //         if (checkIndex === -1) {
    //           this.selectedRowKeys.push(record.id);
    //           this.selectedRows.push(record);
    //         } else {
    //           this.selectedRowKeys.splice(checkIndex, 1);
    //           this.selectedRows.splice(checkIndex, 1);
    //         }
    //       }
    //     }
    //   };
    // },
    onSearchName() {
      this.queryParam = {
        page: 1,
        size: 10,
        code: this.roleName
      }
      this.getRoleList()
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
      this.getRoleList()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.saveRoleRowKey = this.selectedRowKeys
          this.saveRoleRow = this.selectedRows
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
      this.selectedRows = this.saveRoleRow
      this.selectedRowKeys = this.saveRoleRow.map((item, index) => {
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
      console.log(selectedRowKeys, selectedRows)
      //   this.selectedDist = [];
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      //   selectedRows.map(item => {
      //     this.selectedDist.push({
      //       key: item.id,
      //       id: item.id,
      //       roleName: item.roleName
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
    getRoleList() {
      userGetRole(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
          this.RoleList = res.data.list.map((item, index) => {
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
        console.log(newValue, oldValue)
        this.saveRoleRow = newValue
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
<style lang="less">
//弹框中的搜索框
.roleSelect{
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
