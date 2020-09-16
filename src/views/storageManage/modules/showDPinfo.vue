<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <p>备注：该明细描述同一产品代码下，不同生产日期、失效日期、批次号、注册证号等单品数量</p>
    <a-table :columns="columns" :dataSource="tableData" bordered>
      <template v-for="col in ['name', 'age', 'address']" :slot="col" slot-scope="text, record, index">
        <div :key="col">
          <a-input
            :disabled="!record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => editDp(record.key)">编辑</a>
          </span>
        </div>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
const columns = [{
  title: 'name',
  dataIndex: 'name',
  width: '25%',
  scopedSlots: { customRender: 'name' },
}, {
  title: 'age',
  dataIndex: 'age',
  width: '15%',
  scopedSlots: { customRender: 'age' },
}, {
  title: 'address',
  dataIndex: 'address',
  width: '40%',
  scopedSlots: { customRender: 'address' },
}, {
  title: 'operation',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
}]
export default {
  name: 'ShowDpinfo',
  data () {
    return {
      columns,
      tableData: [{
        name: '1',
        age: '2',
        address: '3'
      }, {
        name: '11',
        age: '22',
        address: '33'
      }],
      visible: false,
      confirmLoading: false,
      form: {}
    }
  },
  props: [
    'type'
  ],
  computed: {
    title() {
      if (this.type == 'add') {
        return '新增'
      } else if (this.type == 'edit') {
        return '编辑'
      }
    }
  },
  methods: {
    handleCancel () {
      // clear form & currentStep
      this.visible = false
    },
    show() {
      this.visible = true
    },
    // 表格中input框改变
    handleChange (value, key, column) {
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.tableData = newData
      }
    },
    // 编辑单品
    editDp(key) {
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.tableData = newData
      }
    },
    // 保存单品
    saveDp() {

    }
  }
}
</script>
<style lang="less" scoped>
.show_header{
  display: flex;
  // justify-content: space-between;
  border-bottom: 1px solid#E5F0FF;
  padding-bottom: 20px;
  margin: 0 10px;
  p{
    margin: 0;
  }
  .flex_box{
    width:50%;
  }
  .label{
    color: #9FACC3;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    height:19px;
    line-height:19px
  }
  .title{
    height:24px;
    font-size:18px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    line-height:24px;
    color:#2F3C5D;
  }
}
</style>
