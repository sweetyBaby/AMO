<template>
  <a-card>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>“0”销量统计</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出销量报表</span>
                </template>
                <i class="iconfont icon-exeptOut" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="searchTitle">
      <a-row>
        <div class="searchList" style="padding: 0 0 12px 0;">
          <a-select
            showSearch
            style="width: 240px"
            placeholder="全部"
            v-model="queryParam.distCode"
            optionFilterProp="children"
            :filterOption="filterOption"
            @change="handleDistChange"
          >
            <a-select-option v-for="item in distList" :key="item.distCode" :value="item.distCode">{{ item.distName }}</a-select-option>
          </a-select>
          <div class="selectTime">
            <span>日期：</span>
            <a-range-picker
              :defaultValue="[moment(queryParam.beginDate, dateFormat), moment(queryParam.endDate, dateFormat)]"
              :format="dateFormat"
              @change="handleChangeTimer"
              :allowClear="false"
            />
          </div>
        </div>
      </a-row>
    </div>
    <s-table
      :locale="{emptyText:emptyText}"
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :pageSize="queryParam.size"
      :pageNum="queryParam.page"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { DataFilter, exportTable, exportTabList } from '@/utils/storage'
import { STable } from '@/components'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { getWareList, userDistRange, zeroList } from '@/api/depot/wareHouse'
export default {
  name: 'MonthReport',
  components: {
    DhEmpty,
    STable
  },
  created () {
    this.getFirst()
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      distList: [],
      emptyText: <dh-empty/>,
      loadingSpin: false,
      queryParam: {
        page: 1,
        size: 10,
        distCode: undefined,
        beginDate: moment(moment().week(moment().week() - 1).startOf('week').valueOf()).format('YYYY-MM-DD'),
        endDate: moment(moment().week(moment().week() - 1).endOf('week').valueOf()).format('YYYY-MM-DD')
      },
      columns: [
        {
          title: '经销商名称',
          dataIndex: 'distName',
          align: 'left',
          width: 120
        },
        {
          title: '时间段',
          dataIndex: 'cusName',
          align: 'left',
          width: 180,
          customRender: (text, record) => {
            return record.beginDate + '~' + record.endDate
          }
        },
        // {
        //   title: '是否有销量出库',
        //   dataIndex: 'sumOut',
        //   align: 'left',
        //   width: 120
        // },
        {
          title: '是否点击“0”销量',
          dataIndex: 'zeroSalesFlag',
          align: 'left',
          width: 120,
          customRender: (text, record) => {
            return (text.toString() === '0') ? '否' : '是'
          }
        },
        {
          title: '操作时间',
          dataIndex: 'updateTime',
          align: 'left',
          width: 120,
          customRender: (text, record) => {
            return moment(text).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          title: '操作人',
          dataIndex: 'updateBy',
          align: 'left',
          width: 80
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return zeroList(Object.assign(this.queryParam, parameter)).then(res => {
          const zerolist = DataFilter(res, 'zerolist')
          this.tableList = zerolist
          this.queryParam.size = res.data.pageSize
          return zerolist
        })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    moment,
    getFirst () {
      userDistRange().then(res => {
        if (res.data.length > 1) {
          res.data.unshift({
            distCode: 'qbkw~001',
            distName: '全部'
          })
          this.queryParam.distCode = undefined
        } else {
          this.queryParam.distCode = this.$store.state.user.info.distCode
        }
        this.distList = res.data
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleDistChange (val) {
      // console.info('e---',dist)
      if (this.queryParam.distCode === 'qbkw~001') {
        this.queryParam.distCode = undefined
      } else {
        this.queryParam.distCode = val
      }
      this.$refs.table.refresh(true)
    },
    handleChangeTimer (date, dateString) {
      console.info('date', date)
      if (date.length > 0) {
        this.queryParam.beginDate = dateString[0]
        this.queryParam.endDate = dateString[1]
        this.$refs.table.refresh(true)
      } else {
        this.$notification['error']({
          message: '提示',
          description: '日期不能为空！',
          duration: 4
        })
      }
    },
    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList,
          {
            ...this.queryParam
          },
          '/amo/zeroSalesStatistics/export',
          '0销量报表',
          true
        ).then(doc => {
          this.loadingSpin = false
        })
      }
    }
  },
  destroyed () {
    this.loadingSpin = false
  }
}
</script>

<style scoped  lang="less">
  .ant-card-bordered{
    border: none !important;
  }
  .searchTitle{
    .selectFirm{
      float: left;
      line-height: 32px;
    }
    .selectType{
      float: right;
    .ant-select-selection__placeholder{
      color: #49494B;
    }
    }
    .selectTime{
      float: right;
      margin-left: 10px;
      span{
        float: left;
        display: inline-block;
        line-height: 32px;
      }
      .ant-calendar-picker{
        color: #49494B;
        font-weight: bold;
        font-size: 14px;
        float: left;
      }
    }
    .ant-dropdown-link{
      font-size: 14px;
      color: #34353E;
      font-weight:bold;
    }
  }
</style>
