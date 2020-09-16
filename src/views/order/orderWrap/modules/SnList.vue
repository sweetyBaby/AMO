<template>
  <a-modal
    title="发货详情"
    :width="900"
    :visible="data.visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-table
        ref="table"
        size="default"
        rowKey="id"
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
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { getSnList } from '@/api/depot/order'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
export default {
  name: 'SnList',
  props: ['data'],
  components: {
    STable,
    moment
  },
  created () {
    // console.info('data====', this.data)
    this.queryParam = {
      page: 1,
      size: 10,
      ...this.data
    }
    this.getFirst()
  },
  data () {
    return {
      confirmLoading: false,
      storeList: [],
      queryParam: {
        page: 1,
        size: 10,
      },
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      columns: [
        {
          title: '产品型号',
          dataIndex: 'productModel',
          align: 'left',
          width: 120
        }, {
          title: '产品SN',
          dataIndex: 'udi',
          align: 'left',
          scopedSlots: {
            customRender: 'name'
          },
          width: 160
        }, {
          title: '是否入库',
          dataIndex: 'received',
          align: 'left',
          width: 80,
          customRender: (text) => {
            return text === '0' ? '未入库' : '已入库'
          }
        }, {
          title: '度数',
          dataIndex: 'degree',
          align: 'left',
          width: 100,
          customRender: (text) => {
            return text === '1000.0' ? '未知度数' : text
          }
        }],
    }
  },
  methods: {
    handleCancel () {
      this.$emit('cancel', false)
    },
    getFirst () {
      this.loading = true
      getSnList(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.storeList = res.data.list
          this.pagination = {
            ...this.pagination,
            total: res.data.total
          }
          this.loading = false
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
      this.getFirst()
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
    max-width: 140px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
</style>
