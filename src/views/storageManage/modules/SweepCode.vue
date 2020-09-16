<template>
  <a-modal
    title="选择弹框"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <div class="table-page-search-wrapper search-border">
        <a-form layout="inline">
          <a-row>
            <a-col :md="12" :sm="24">
              <a-input v-model="queryParam.id" placeholder="输入产品名称/货号" style="width: 260px" >
                <!--<a-icon slot="prefix" type="search" />-->
                <i slot="prefix" class="iconfont icon-search" />
              </a-input>
            </a-col>
            <a-col :md="12" :sm="24">
              <span class="table-page-search-submitButtons" :style=" { textAlign:'right' }">
                <a-button type="primary" @click="$refs.table.refresh(true)" size="small">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
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
              <a-button v-if=" record.status !== '1' " size="small" type="primary" @click="handleEdit(record)" >审核</a-button>
              <a-button size="small" type="default" @click="$refs.createModal.add()">查看</a-button>
            </div>
          </template>
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getRoleLine } from '@/api/manage'
import { storagePro } from '@/api/storage'

export default {
  name: 'SweepCode',
  components: {
    STable
  },
  data () {
    return {
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
        'page': 1,
        'size': 5,
        'keyWords': ''
      },
      form: this.$form.createForm(this),
      selectedDist: [],
      columns: [
        {
          title: '产品代码',
          dataIndex: 'productCode'
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
        },
        {
          title: '生产厂商',
          dataIndex: 'manufactor',
        },
        {
          title: '单位',
          dataIndex: 'productModel'
        }
      ],
      loadData: parameter => {
        // console.log('loadData.parameter', parameter)
        return storagePro(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.info('res----', res)
            const storageList = res.data
            const storageData = {
              'data': storageList.list.map((item, index) => {
                return {
                  key: 'sweep' + index,
                  ...item
                }
              }),
              'pageSize': res.data.pageSize,
              'pageNo': res.data.pageNum,
              'totalCount': res.data.total,
              'totalPage': res.data.pages
            }
            console.info('data----', storageData)
            return storageData
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
    add () {
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
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
    handleCancel () {
      this.visible = false
    },
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
      this.selectedDist = []
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      selectedRows.map(item => {
        this.selectedDist.push(item)
      })
      // console.info('selectedRows----',this.selectedDist)
    }
  }
}
</script>
<style lang="less">
</style>
