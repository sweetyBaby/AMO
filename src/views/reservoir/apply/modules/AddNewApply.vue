<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3>{{ title }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleAllot()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ iconTitle }}</span>
                </template>
                <i
                  class="iconfont"
                  :class="this.type == 'refuseAccept'?'icon-preRejection':'icon-proReturn'"
                />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-if="!isEmpty">
      <a-drawer
        title="搜索条件"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        width="340"
      >
        <a-form layout="inline">
          <div class="searchWrap">
            <div class="searchList" v-if="this.type === 'refuseAccept'">
              <label for>输入单据号</label>
              <a-input v-model="queryParam.docNo" placeholder="输入单据号" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for>产品型号</label>
              <a-input v-model="queryParam.productModel" placeholder="输入产品型号" style="width: 100%;" />
            </div>
            <div class="searchList">
              <label for>产品SN</label>
              <a-input v-model="queryParam.serialNumber" placeholder="输入产品SN" style="width: 100%;" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveFuzzy" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetBtn" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
    </div>
    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :locale="{emptyText:emptyText}"
      :customRow="handleCheck"
      :columns="columns"
      :dataSource="storeList"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="loading"
    >
      <template slot="name" slot-scope="name">
        <a-tooltip placement="top" :title="name">
          <span class="serialWrap">{{ name }}</span>
        </a-tooltip>
      </template>
    </a-table>
    <back-modal
      v-if="isBack"
      :backData="backData"
      @cancel="handleCancle"
      @handleSub="handleSub"
      :type="type"
    />
  </div>
</template>

<script>
import DhEmpty from '../../../comPublic/DhEmpty'
import moment from 'moment'
import { preSt, applySave, getFrom } from '@/api/depot/wareHouse'
import BackModal from './BackModal'
const returnColumns = [
  {
    title: '产品型号',
    dataIndex: 'productModel',
    align: 'left',
    width: 89
  },
  {
    title: '库位名称',
    dataIndex: 'whName',
    align: 'left',
    width: 89
  },
  {
    title: '产品SN',
    dataIndex: 'serialNumber',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 89
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    align: 'left',
    width: 89
  },
  {
    title: '度数',
    dataIndex: 'degree',
    align: 'left',
    width: 83
  },
  {
    title: '数量',
    dataIndex: 'qty',
    align: 'left',
    width: 83
  },
  {
    title: '单位',
    dataIndex: 'uom',
    align: 'left',
    width: 83
  },
  {
    title: '生产日期',
    dataIndex: 'effectiveDateBegin',
    align: 'left',
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 89
  },
  {
    title: '失效日期',
    dataIndex: 'effectiveDateEnd',
    align: 'left',
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 89
  },
  {
    width: 90,
    title: '注册证编号',
    dataIndex: 'registration',
    align: 'left'
  }
]
const refuseColumns = [
  {
    title: '单据号码',
    dataIndex: 'docNo',
    align: 'left',
    width: 89
  },
  {
    title: '产品型号',
    dataIndex: 'productModel',
    align: 'left',
    width: 89
  },
  {
    title: '上游机构',
    dataIndex: 'cusName',
    align: 'left',
    width: 89
  },
  {
    title: '产品SN',
    dataIndex: 'serialNumber',
    align: 'left',
    scopedSlots: {
      customRender: 'name'
    },
    width: 89
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    align: 'left',
    width: 89
  },
  {
    title: '度数',
    dataIndex: 'degree',
    align: 'left',
    width: 83
  },
  {
    title: '数量',
    dataIndex: 'qty',
    align: 'left',
    width: 83
  },
  {
    title: '单位',
    dataIndex: 'uom',
    align: 'left',
    width: 83
  },
  {
    title: '生产日期',
    dataIndex: 'effectiveDateBegin',
    align: 'left',
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 89
  },
  {
    title: '失效日期',
    dataIndex: 'effectiveDateEnd',
    align: 'left',
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    width: 89
  },
  {
    width: 90,
    title: '注册证编号',
    dataIndex: 'registration',
    align: 'left'
  }
]
export default {
  name: 'AddNewApply',
  props: ['type'],
  components: {
    BackModal,
    DhEmpty
  },
  mounted() {
    // console.log(this.type);
    this.getApplyList()
    if (this.type === 'refuseAccept') {
      this.title = ' 新增拒收申请'
      this.iconTitle = '拒收'
      this.columns = refuseColumns
    } else if (this.type === 'ReturnGoods') {
      this.title = '新增退货申请'
      this.iconTitle = '退货'
      this.columns = returnColumns
    }
  },
  data() {
    return {
      emptyText: <dh-empty />,
      iconTitle: null,
      title: null,
      isShowSearch: false,
      isEmpty: false,
      storeList: [],
      queryParam: {
        page: 1,
        size: 10,
        // distCode: this.$store.state.user.info.distCode,
        cusCode: 'CRGD'
      },
      isBack: false,
      backData: {
        visible: false
      },
      columns: [],
      loading: true,
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      }
    }
  },
  methods: {
    moment,
    handleCheck(record, index) {
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
    resetBtn() {
      this.queryParam = {
        ...this.queryParam,
        docNo: '',
        productModel: '',
        serialNumber: ''
      }
    },
    retriveFuzzy() {
      this.selectedRowKeys = []
      this.selectedRows = []

      this.getApplyList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.info(selectedRowKeys,selectedRows);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSearch() {
      this.isShowSearch = true
    },
    onSearchClose() {
      this.isShowSearch = false
    },
    getApplyList() {
      this.loading = true
      this.isShowSearch = false
      let preStorageApi
      if (this.type == 'refuseAccept') {
        preStorageApi = preSt
      } else if (this.type == 'ReturnGoods') {
        preStorageApi = getFrom
      }
      preStorageApi(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.storeList = res.data.list
          this.pagination = pagination
        }
        this.loading = false
        this.isShowArea = false
      })
      document.body.scrollTop = 0
    },
    handleAllot() {
      console.info('this.selectedRows---', this.selectedRows)
      if (this.selectedRows.length > 0) {
        this.isBack = true
        this.backData.visible = true
      } else {
        let msg = ''
        if (this.type == 'refuseAccept') {
          msg = ' 新请先选择拒收产品'
        } else if (this.type == 'ReturnGoods') {
          msg = '新请先选择退货产品'
        }
        this.$notification['error']({
          message: '错误',
          description: msg,
          duration: 4
        })
      }
    },
    handleBack () {
      this.$emit('back')
    },
    handleCancle() {
      this.backData.visible = false
      this.isBack = false
    },
    handleSub(val) {
      console.log(this.type)
      let num
      if (this.type == 'refuseAccept') {
        num = 0
      } else if (this.type == 'ReturnGoods') {
        num = 1
      }
      this.backData.visible = false
      this.isBack = false
      const params = {
        list: this.selectedRows,
        applyType: num,
        ...val
      }
      applySave(params).then(res => {
        this.loading = true
        if (res.message == 'SUCCESS') {
          this.loading = false
          console.log(res)
          this.$emit('handleSubmit')
        } else {
          this.$notification['error']({
            message: '错误',
            description: res.message,
            duration: 4
          })
        }
      })
    },
    // 分页
    handleTableChange(pagination) {
      this.selectedRows = []
      this.selectedRowKeys = []
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize

      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getApplyList()
    }
  }
}
</script>

<style lang="less">
.serialWrap {
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
