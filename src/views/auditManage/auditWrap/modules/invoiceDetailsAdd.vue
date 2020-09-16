<template>
  <div>
    <div class="adInput-input agentSearchInvoice" style=" cursor: pointer;">
      <a-form-item has-feedback class="searchBox" v-show="searchType">
        <label for="">出入库单号</label>
        <a-input placeholder="请输入出入库单号" size="large" v-model="queryModalParam.docNo" class="selectDistName"/>
      </a-form-item>
      <a-form-item has-feedback class="searchBox" v-show="!searchType">
        <label for="">产品型号</label>
        <a-input placeholder="请输入产品型号" size="large" v-model="queryModalParam.productModel" class="selectDistName"/>
        <!--<label for="">自定义名称</label>
        <a-input placeholder="请输入自定义名称" size="large" v-model="queryModalParam.customName" class="selectDistName"/>-->
      </a-form-item>
      <span class="table-page-search-submitButtons">
        <a-button type="primary" @click="searchTableRefresh" size="small">查询</a-button>
        <a-button style="margin-left: 8px" @click="resetSearchForm" size="small">重置</a-button>
      </span>
    </div>
    <a-table
      :columns="columns"
      :dataSource="ModalData"
      :destroyOnClose="true"
      :loading="loading"
      rowKey="index"
      :scroll="tableScroll"
      :pagination="pagination"
      :rowSelection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}"
      @change="tableChange"
    >
      <span slot="qty" slot-scope="text, record">
        <template>
          <div>
            <a-input placeholder="请输入数量" v-model="record.qty"/>
          </div>
        </template>
      </span>
      <span slot="price" slot-scope="text, record">
        <template>
          <div>
            <a-input placeholder="请输入单价" v-model="record.nonePrice"/>
          </div>
        </template>
      </span>
    </a-table>
  </div>
</template>

<script>
import { invoiceDetailSearch } from '@/api/auditManage/auditManage'
const columnsManual = [
  {
    title: '产品型号',
    dataIndex: 'productModel',
    width: 120,
    fixed: 'left'
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    width: 150
  }, {
    title: '产品分类',
    dataIndex: 'productCategory',
    width: 150
  }, {
    title: '自定义型号',
    dataIndex: 'customModel',
    width: 150
  }, {
    title: '自定义名称',
    dataIndex: 'customName',
    width: 150
  }, {
    title: '度数',
    dataIndex: 'degree',
    width: 80
  }, {
    title: '单位',
    dataIndex: 'uom',
    width: 80
  }, {
    title: '税率',
    dataIndex: 'tax',
    width: 80
  }, {
    title: '数量',
    dataIndex: 'qty',
    width: 150,
    fixed: 'right',
    scopedSlots: { customRender: 'qty' }
  }, {
    title: '单价',
    dataIndex: 'price',
    width: 150,
    fixed: 'right',
    scopedSlots: { customRender: 'price' }
  }
]
const columnsCode = [
  {
    title: '出库单号',
    dataIndex: 'docNo'
  },
  {
    title: '产品型号',
    dataIndex: 'productModel'
  },
  {
    title: '产品名称',
    dataIndex: 'productName'
  }, {
    title: '数量',
    dataIndex: 'qty'
  }, {
    title: '单位',
    dataIndex: 'uom'
  }]
export default {
  name: 'InvoiceDetailsAdd',
  props: ['detailsAddData'],
  data () {
    return {
      columns: [],
      searchType: true,
      tableScroll: {},
      ModalData: [], // 经销商数据
      selectedRowKeys: [],
      selectedData: {},
      loading: true,
      pagination: {
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        total: 0
      },
      queryModalParam: {
        page: 1,
        size: 10,
        docFlag: 1,
        productModel: '',
        docNo: '',
        customName: '',
        distCode: ''
      }
    }
  },
  watch: {
    selectedRows () {
      if (this.selectedRows.distName === undefined) {
        this.selectedRowKeys = []
      }
    }
  },
  created () {
    this.getTableType()
  },
  methods: {
    searchTableRefresh () { // 搜索表格
      this.getModalData()
    },
    resetSearchForm () { // 重置查询条件
      this.queryModalParam.docFlag = 1
      this.queryModalParam.docNo = ''
      this.queryModalParam.productModel = ''
      this.queryModalParam.customName = ''
      this.queryModalParam.distCode = this.detailsAddData.distCode
    },
    tableChange (page, pageSize) { // 切换页码
      this.queryModalParam.page = page.current
      this.queryModalParam.size = page.pageSize
      this.getModalData()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedRows
      this.$emit('selectedData', this.selectedData)
    },
    getTableType () { // 判断表格类型
      this.tableScroll = {}
      this.searchType = true
      this.columns = columnsCode
      this.queryModalParam.docFlag = 1
      this.queryModalParam.distCode = this.detailsAddData.distCode
      this.getModalData()
    },
    getModalData () { // 获取modal数据
      this.loading = true
      // console.info('this.detailsAddData.addType===', this.detailsAddData)
      if (this.detailsAddData.addType && this.detailsAddData.addType !== null) {
        this.queryModalParam.isDistribution = 1
      } else {
        this.queryModalParam.isDistribution = 0
      }
      invoiceDetailSearch(this.queryModalParam).then(res => {
        this.ModalData = res.data.list
        for (let i = 0; i < this.ModalData.length; i++) {
          this.ModalData[i].index = (parseInt(res.data.pages) - 1) * parseInt(res.data.size) + 1 + i
        }
        this.loading = false
        const pagination = { ...this.pagination }
        pagination.total = res.data.total
        this.pagination = pagination
        this.pagination.pageSize = res.data.pageSize
      })
    }
  }
}
</script>

<style lang="less">
.agentSearchInvoice{
  .searchBox{
    width: auto !important;
  }
  .ant-row{
    display: inline-block;
    input{
      height: 44px;
      width: 200px;
      margin-left: 20px;
      background: #fcfcfc;
      margin-right: 20px;
    }
    .ant-input{
      border: 1px solid #e3e3e3;
    }
    .ant-input-search-button{
      height: 32px;
      border: 1px solid #e9e9e9;
    }
  }
  .ant-btn-primary{
    background: #3e4da8 !important;
    color: white;
  }
  .ant-btn-default{
    background: #f6f6f6 !important;
    color: #939393;
  }
  .table-page-search-submitButtons{
    float: right;
    button{
      width: 130px;
      height: 44px;
    }
  }
}
  /*表格行*/
.ant-table-tbody {
  tr:nth-child(2n) {
    td{
      background: #fbfbfb;
    }
  }
  tr.active{
    td {
      background: #e6f7ff !important;
    }
  }
}
</style>
