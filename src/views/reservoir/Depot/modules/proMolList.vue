<template>
  <a-modal
    title="选择产品型号"
    :width="800"
    :visible="typeData.visible"
    :confirmLoading="confirmLoading"
    &ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="12" :sm="24">
            <a-input v-model="queryParam.code" placeholder="输入代码/名称" style="width: 100%;max-width:240px;" >
              <i slot="prefix" class="iconfont icon-search" />
            </a-input>
          </a-col>
          <a-col :md="12" :sm="24">
            <span class="table-page-search-submitButtons" :style="{textAlign: 'right'} ">
              <a-button type="primary" @click="$refs.table.refresh(true)" size="small">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-right">
              <div class="tabBtn">
                <a-popover placement="bottomRight">
                  <template slot="title">
                    <a @click="handleInfo">
                      <i class="iconfont icon-up" />查看详情
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore" />
                </a-popover>
              </div>
            </div>
          </template>
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { findProductMo } from '@/api/basicInfo/hosData'
import { STable } from '@/components'
export default {
  name: 'ProMolList',
  props: ['typeData'],
  components: {
    STable
  },
  data() {
    return {
      confirmLoading: false,
      queryParam: {
        'productModel': '',
        page: 1,
        size: 10
      },
      columns: [
        {
          title: '产品型号',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '产品名称',
          dataIndex: 'description',
          align: 'center'
        }
      ],
      loadData: parameter => {
        return findProductMo(parameter).then(res => {
          console.info(res)
          const proList = res.data
          return proList
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
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
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.info(selectedRowKeys,selectedRows);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handleSubmit() {

    },
    handleCancel() {
      this.$emit('cancel', false)
    }
  }
}
</script>

<style lang="less">

</style>
