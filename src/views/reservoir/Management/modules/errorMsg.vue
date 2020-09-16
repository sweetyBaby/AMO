<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>错误详情</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <s-table
        :columns="columns"
        :data="loadData"
        rowKey="key"
        ref="table"
        size="default"
        :locale="{emptyText:emptyText}"
      ></s-table>
    </div>
  </div>
</template>

<script>
import DhEmpty from '../../../comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import { ErrorMsg } from '@/api/depot/depot'

const columns = [
  {
    title: '文件编号',
    key: 'reportHisId',
    dataIndex: 'reportHisId'
  },
  {
    title: '错误描述',
    key: 'errorDesc',
    dataIndex: 'errorDesc'
  },
  {
    title: '错误所在行',
    key: 'errorIndex',
    dataIndex: 'errorIndex'
  }
]

export default {
  name: 'ErrorMsg',
  components: {
    STable,
    DhEmpty
  },
  props: ['errorData'],
  data() {
    return {
      emptyText: <dh-empty />,
      queryParam: {
        reportHisId: this.errorData.id
      },
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return ErrorMsg(Object.assign(this.queryParam, parameter)).then(res => {
          const ErrorMsgList = DataFilter(res, 'ware')
          return ErrorMsgList
        })
      }
    }
  },
  created() {
    this.queryParam.reportHisId = this.errorData.id
  },
  methods: {
    handleBack() {
      this.$emit('errorBack', false)
    }
  }
}
</script>

<style>
</style>
