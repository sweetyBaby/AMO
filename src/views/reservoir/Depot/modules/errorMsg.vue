<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ pageTitle }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top" v-model="showTool">
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
        :locale="{emptyText:emptyText}"></s-table>
    </div>
  </a-card>
</template>

<script>
import DhEmpty from '@/views/comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter, saveParamsFromStore, getParamsFromStore } from '@/utils/storage'
import { ErrorMsg } from '@/api/depot/depot'

const columns = [
  {
    title: '文件编号',
    key: 'reportHisId',
    dataIndex: 'reportHisId',
    width: '20%'
  },
  {
    title: '错误描述',
    key: 'errorDesc',
    dataIndex: 'errorDesc',
    width: '60%'
  },
  {
    title: '错误所在行',
    key: 'errorIndex',
    dataIndex: 'errorIndex',
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
      showTool: false,
      emptyText: <dh-empty/>,
      queryParam: {},
      params: {},
      pageTitle: '',
      parentCom: '',
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return ErrorMsg(Object.assign(this.queryParam, parameter)).then(res => {
          const ErrorMsgList = DataFilter(res, 'error')
          return ErrorMsgList
        })
      }
    }
  },
  created() {
    this.getFirst()
  },
  methods: {
    handleBack() {
      this.$router.push({
        name: this.parentCom,
        params: this.params
      })
      this.showTool = false
    },
    getFirst() {
      // const getParams = this.$route.params
      let getParams
      if (this.$route.params.pageTitle) {
        getParams = this.$route.params
        saveParamsFromStore(getParams, 'ERRORDETAIL')
        this.getParamsRed = getParams
      } else {
        getParams = getParamsFromStore('ERRORDETAIL')
        // console.info( getParamsFromStore('ERRORDETAIL'))
        this.getParamsRed = getParamsFromStore('ERRORDETAIL')
      }
      console.info('getParams====', getParams)
      this.pageTitle = getParams.pageTitle
      this.queryParam.reportHisId = getParams.id
      this.parentCom = getParams.parentCom
      this.params = {
        ...getParams
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name.indexOf('_Detail') !== -1) {
        this.$refs.table.refresh(false)
        this.getFirst()
      }
    }
  }
}
</script>

<style>
</style>
