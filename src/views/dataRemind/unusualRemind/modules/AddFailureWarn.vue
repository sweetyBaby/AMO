<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ tableTitle }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back"></i>
              </a-tooltip>
            </span>
            <!-- <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
              </a-tooltip>
            </span> -->
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
    <div>
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
            <div class="searchList">
              <label for>经销商名称</label>
              <a-select
                showSearch
                @change="handleDist"
                placeholder="请选择经销商名称"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.distCode"
              >
                <a-select-option
                  :value="item.distCode"
                  v-for="(item,index) in distList"
                  :key="index"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>度数</label>
              <a-input placeholder="输入度数" style="width: 100%" v-model="queryParam.degree" />
            </div>
            <div class="searchList">
              <label for>产品型号</label>
              <a-select
                showSearch
                placeholder="请选择产品型号"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.productModel"
              >
                <a-select-option
                  :value="item.productModel"
                  v-for="(item,index) in modelList"
                  :key="index"
                >{{ item.productModel }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>库位</label>
              <a-select
                showSearch
                placeholder="请选择库位"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.whCode"
              >
                <a-select-option
                  :value="item.whCode"
                  v-for="(item,index) in LocationList"
                  :key="index"
                >{{ item.whName }}</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="clearBtn()">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        :rowClassName="rowClassName"
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :locale="{emptyText:emptyText}"
      ></s-table>
    </div>
  </div>
</template>
<script>
import { STable } from '@/components'
import { exportTable, DataFilter } from '@/utils/storage'
import DhEmpty from '../../../comPublic/DhEmpty'
import { failureWarnDetailList } from '@/api/unusualRemind'
import { userDistRange } from '@/api/depot/wareHouse'
import { findProductMo, retriveNameData } from '@/api/basicInfo/hosData'
import { retriveLocation } from '@/api/information'
const columns = [
  {
    width: 174,
    title: '经销商名称',
    dataIndex: 'distName',
    key: 'distName'
  },
  {
    width: 162,
    title: '产品型号',
    dataIndex: 'productModel',
    key: 'productModel'
  },
  {
    width: 162,
    title: '批号',
    dataIndex: 'batchNumber',
    key: 'batchNumber'
  },
  {
    width: 162,
    title: '度数',
    dataIndex: 'degree',
    key: 'degree'
  },
  {
    width: 162,
    title: '库位',
    dataIndex: 'whName',
    key: 'whName'
  },
  {
    width: 162,
    title: '数量',
    dataIndex: 'qty',
    key: 'qty'
  },
  {
    width: 162,
    title: '失效日期',
    dataIndex: 'effectiveDateEnd',
    key: 'effectiveDateEnd'
  },
  {
    width: 150,
    title: '剩余失效天数',
    dataIndex: 'effectiveNotifyDay',
    key: 'effectiveNotifyDay',
    customRender: (text, record) => {
      return text > 0 ? text : '已过期'
    }
  }
]
export default {
  name: 'AddFailureWarn',
  props: ['details'],
  data() {
    return {
      tableTitle: '产品失效预警详情',
      columns,
      emptyText: <dh-empty />,
      queryParam: {
        page: 1,
        size: 10,
        distCode: this.details.distCode,
        productModel: this.details.productModel,
        batchNumber: this.details.batchNumber
      },
      tableList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return failureWarnDetailList(
          Object.assign(this.queryParam, parameter)
        ).then(res => {
          const inventoryList = DataFilter(res, 'table')
          this.queryParam.size = res.data.pageSize
          this.tableList = inventoryList
          return inventoryList
        })
      },
      distList: [],
      modelList: [],
      isShowSearch: false,
      LocationList: []
    }
  },
  created() {
    this.reserveProductMo()
    this.getDistList()
    this.locationChange()
  },
  components: {
    STable,
    DhEmpty
  },
  methods: {
    clearBtn() {
      this.queryParam.distCode = this.details.distCode
      this.queryParam.degree = undefined
      this.queryParam.productModel = undefined
      this.queryParam.whCode = undefined
    },
    handleExport() {
      this.queryParam = {
        ...this.queryParam,
        page: undefined,
        size: undefined
      }
      console.log(this.tableList.data)
      exportTable(
        this.tableList.data,
        this.queryParam,
        '/amo/warn/failureWarnDetailList/export ',
        '产品失效预警详情导出列表'
      )
    },
    rowClassName(record, index) {
      const className = 'light-row'
      if (record.effectiveNotifyDay <= 0) {
        return className
      }
    },
    handleDist(value) {
      this.queryParam = {
        ...this.queryParam,
        whCode: undefined
      }
      this.locationChange()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 返回到主页面
    handleBack() {
      this.$emit('handleNew', false)
    },
    locationChange() {
      const params = {
        ...this.queryParam,
        page: 1,
        size: 100000
      }
      retriveLocation(params).then(res => {
        if (res.message === 'SUCCESS') {
          console.log('==========')
          this.LocationList = res.data.list
        }
      })
    },
    reserveProductMo() {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.modelList = res.data
        }
      })
    },
    getDistList() {
      const params = {
        distCode: this.$store.state.user.info.distCode
      }
      userDistRange(params).then(res => {
        // console.info('====',res)
        this.distList = res.data
      })
    },
    // 高级搜索的查询
    retriveTable() {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleSearch() {
      this.isShowSearch = true
    },

    onSearchClose() {
      this.isShowSearch = false
    }
  }
}
</script>
    <style lang="less">
.light-row {
  td {
    color: red !important;
  }
}
</style>
