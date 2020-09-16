<template>
  <a-modal
    :title="fromData.title"
    :width="900"
    :visible="fromData.visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-form layout="inline" class="preSearch">
        <a-row :gutter="16">
          <a-col :md="4" :sm="24" v-if="fromData.type === 'fromPro'">
            <a-input v-model="queryParam.docNo" placeholder="输入单据号" style="width: 100%;max-width:240px;" />
          </a-col>
          <a-col :md="3" :sm="24" >
            <a-input v-model="queryParam.serialNumber" placeholder="输入SN" style="width: 100%;max-width:240px;" />
          </a-col>
          <a-col :md="4" :sm="24">
            <a-input v-model="queryParam.productModel" placeholder="输入产品型号" style="width: 100%;max-width:240px;" />
          </a-col>
          <a-col :md="4" :sm="24">
            <a-input v-model="queryParam.degree" placeholder="输入产品度数" style="width: 100%;max-width:240px;" />
          </a-col>
          <a-col :md="4" :sm="24">
            <a-select
              style="max-width: 240px; width: 100%;"
              placeholder="是否华润寄售"
              v-model="queryParam.consignMark"
              @change="handleConsign"
            >
              <a-select-option
                v-for="item in markList"
                :key="item.markCode"
                :value="item.markkey"
              >
                {{ item.markName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" :sm="24" v-if="fromData.type === 'fromProIn'">
            <a-select
              style="max-width: 240px; width: 100%;"
              placeholder="全部库位"
              v-model="queryParam.whCode"
              @change="handleOpt"
              showSearch
              optionFilterProp="children"
            >
              <a-select-option
                v-for="item in whFromList"
                :key="item.whCode"
                :value="item.whCode"
                :title="item.whName"
              >
                <!--                <a-tooltip placement="topLeft">-->
                <!--                  <template slot="title">-->
                <!--                    <span>{{ item.whName }}</span>-->
                <!--                  </template>-->
                <!--                  {{ item.whName }}-->
                <!--                </a-tooltip>-->
                {{ item.whName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons" :style="{float: 'right'} ">
              <a-button type="primary" @click="handleReload" size="small">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelect: handleSelect
        }"
        :columns="columns"
        :dataSource="storeList"
        :scroll="proScroll"
        :pagination="pagination"
        @change="handleTableChange"
        :loading="loading"
        :customRow="handleCheck"
      >
        <template slot="name" slot-scope="name">
          <a-tooltip placement="top" :title="name">
            <span class="serialWrap">{{ name }}</span>
          </a-tooltip>
        </template>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { preStorage, getFromProIn } from '@/api/depot/wareHouse'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
const columns = [
  {
    title: '单据号码',
    dataIndex: 'docNo',
    align: 'left',
    width: 120,
    scopedSlots: {
      customRender: 'name'
    }
  }, {
    title: '产品型号',
    dataIndex: 'productModel',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }, {
    title: '产品名称',
    dataIndex: 'productNameCn',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }, {
    title: '度数',
    dataIndex: 'degree',
    align: 'left',
    width: 140,
    customRender: (text) => {
      return text === '1000.0' ? '未知度数' : text
    }
  }, {
    title: '数量',
    dataIndex: 'qty',
    align: 'left',
    width: 80
  }, {
    title: '产品SN',
    dataIndex: 'serialNumber',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }, {
    title: '单位',
    dataIndex: 'uom',
    align: 'left',
    width: 60
  }, {
    title: '是否华润寄售',
    dataIndex: 'consignMark',
    align: 'left',
    width: 140,
    customRender: (text) => {
      return text === '1' ? '是' : '否'
    }
  }, {
    title: '生产日期',
    dataIndex: 'effectiveDateBegin',
    align: 'left',
    customRender: (text) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 130
  }, {
    title: '失效日期',
    dataIndex: 'effectiveDateEnd',
    align: 'left',
    customRender: (text) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 130
  }, {
    title: '注册证编号',
    dataIndex: 'registration',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }, {
    title: '上游机构',
    dataIndex: 'cusName',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }]

const columnsIn = [
  {
    title: '产品型号',
    dataIndex: 'productModel',
    align: 'left',
    width: 120
  }, {
    title: '产品名称',
    dataIndex: 'productName',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }, {
    title: '产品批号',
    dataIndex: 'batchNumber',
    align: 'left',
    width: 120
  }, {
    title: '度数',
    dataIndex: 'degree',
    align: 'left',
    width: 140,
    customRender: (text) => {
      return text === '1000.0' ? '未知度数' : text
    }
  }, {
    title: '数量',
    dataIndex: 'qty',
    align: 'left',
    width: 80
  }, {
    title: '库位名称',
    dataIndex: 'whName',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }, {
    title: '单位',
    dataIndex: 'uom',
    align: 'left',
    width: 60
  }, {
    title: '产品SN',
    dataIndex: 'serialNumber',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 120
  }, {
    title: '是否华润寄售',
    dataIndex: 'consignMark',
    align: 'left',
    width: 140,
    customRender: (text) => {
      return text === '1' ? '是' : '否'
    }
  }, {
    title: '生产日期',
    dataIndex: 'effectiveDateBegin',
    align: 'left',
    customRender: (text) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 140
  }, {
    title: '失效日期',
    dataIndex: 'effectiveDateEnd',
    align: 'left',
    customRender: (text) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 140
  }, {
    title: '注册证编号',
    dataIndex: 'registration',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    }
  }]
const markList = [
  {
    markCode: 'markAll',
    markName: '全部',
    markkey: 'markAll'
  }, {
    markCode: '1',
    markName: '是',
    markkey: '1'
  }, {
    markCode: '0',
    markName: '否',
    markkey: ''
  }
]

export default {
  name: 'AddFromStorage',
  props: ['fromData'],
  components: {
    STable,
    moment
  },
  created () {
    if (this.fromData.type === 'fromPro') {
      this.getStoList()
      this.columns = columns
    } else {
      this.getStoInList()
      this.columns = columnsIn
    }
  },
  data () {
    return {
      confirmLoading: false,
      queryParam: {
        'page': 1,
        'size': 10,
        'degree': '',
        'productModel': '',
        'serialNumber': '',
        'whCode': undefined,
        'distCode': ''
      },
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      markList,
      columns: [],
      storeList: [],
      selectedRowKeys: [],
      selectedRows: [],
      proScroll: {
        x: '180%',
        y: 'calc(100vh - 500px)'
      },
      whFromList: [],
      styleTop: {
        scrollTop: 0
      }
    }
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.info(selectedRowKeys,selectedRows);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSelect (record, selected, selectedRows) {
      // console.info('selectedRows-----',selectedRows)
    },
    handleReload () {
      // console.info('this.queryParam---',this.queryParam)
      if (this.queryParam.consignMark === 'markAll' || this.queryParam.consignMark === '0') {
        this.queryParam.consignMark = undefined
      }
      if (this.fromData.type === 'fromPro') {
        this.getFromStore()
      } else {
        this.getFromIn()
      }
    },
    handleConsign (val) {
      // console.info('val---',val)
    },
    handleChange (val) {
      this.selectedRows = []
      this.selectedRowKeys = []
      if (this.fromData.type !== 'fromPro') {
        this.queryParam.whCode = val
      }
    },
    handleOpt (val, opt) {
      // console.info('opt----',opt)
      this.queryParam.whName = opt.componentOptions.children[0].text
      this.queryParam.whCode = val
    },
    handleCheck (record, index) {
      return {
        on: {
          click: () => {
            // console.info('this.selectedRowKeys----',this.selectedRowKeys,this.selectedRows);
            const checkIndex = this.selectedRowKeys.indexOf(record.id)
            if (checkIndex === -1) {
              this.selectedRowKeys.push(record.id)
              this.selectedRows.push(record)
            } else {
              this.selectedRowKeys.splice(checkIndex, 1)
              this.selectedRows.splice(checkIndex, 1)
            }
          }
        }
      }
    },
    handleReset () {
      this.queryParam = {
        ...this.queryParam,
        page: 1,
        batchNumber: '',
        serialNumber: '',
        docNo: '',
        degree: '',
        whCode: undefined,
        productModel: '',
        distCode: this.fromData.distCode,
        consignMark: undefined
      }
    },
    handleSubmit () {
      const params = {
        preStoList: this.selectedRows
      }
      // console.info('params---',params)
      this.$emit('preSubmit', params)
    },
    handleCancel () {
      this.$emit('cancel', false)
    },
    getStoList () {
      // console.info('this.fromData.docType---',this.fromData.docType)
      this.queryParam.docType = this.fromData.docType
      this.queryParam.distCode = this.fromData.distCode
      this.getFromStore()
    },
    getStoInList () {
      // console.info('this.fromData.docType---',this.fromData.docType)
      this.queryParam.docType = this.fromData.docType
      this.queryParam.distCode = this.fromData.distCode
      this.whFromList = this.fromData.whFromList
      this.whFromList = [
        {
          whCode: 'qbkw~001',
          whName: '全部库位'
        },
        ...this.whFromList
      ]
      this.getFromIn()
    },
    getFromStore () {
      this.loading = true
      preStorage(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.storeList = res.data.list
          this.pagination = {
            ...this.pagination,
            total: res.data.total
          }
          this.loading = false
        }
      })
      this.selectedRowKeys = []
      this.selectedRows = []
      if (this.$refs.table) {
        document.getElementsByClassName('ant-table-body')[0].scrollTop = 0
      }
    },

    getFromIn () {
      this.loading = true
      if (this.queryParam.whCode === 'qbkw~001') {
        this.queryParam.whCode = undefined
      }
      getFromProIn(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.storeList = res.data.list
          this.pagination = {
            ...this.pagination,
            total: res.data.total
          }
          this.loading = false
        }
      })
      this.selectedRowKeys = []
      this.selectedRows = []
      if (this.$refs.table) {
        document.getElementsByClassName('ant-table-body')[0].scrollTop = 0
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
      if (this.fromData.type === 'fromPro') {
        this.getStoList()
      } else {
        this.getStoInList()
      }
    }
  }
}
</script>

<style lang="less">
  .ant-form .ant-btn{
    height: 32px;
    line-height: 32px;
  }
  .serialWrap{
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
</style>
