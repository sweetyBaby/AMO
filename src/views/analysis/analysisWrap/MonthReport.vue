<template>
  <a-card>
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>月报</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出月报</span>
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
            @change="handleDistChange"
          >
            <a-select-option
              v-for="item in distList"
              :key="item.distCode"
              :value="item.distCode"
            >{{ item.distName }}</a-select-option>
          </a-select>
          <div class="selectTime">
            <span>导出月份：</span>
            <a-month-picker
              :style="{width:'240px'}"
              @change="handleChangeTimer"
              :format="monthFormat"
              :defaultValue="defaultVal"
              :disabledDate="disabledDate"
            ></a-month-picker>
          </div>
        </div>
      </a-row>
    </div>
    <a-table
      class="monthTable"
      :locale="{emptyText:emptyText}"
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :dataSource="loadData"
      :scroll="{ x: 1900 }"
      :pagination="false"
      :loading="loading"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <template slot="distName" slot-scope="name">
        <a-tooltip placement="top" :title="name">
          <span class="serialWrap">{{ name }}</span>
        </a-tooltip>
      </template>
      <template slot="monthText" slot-scope="text">
        <span> {{ Number(text) }}</span>
      </template>

    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { DataFilter, exportTable } from '@/utils/storage'
import { STable } from '@/components'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { userDistRange, monthList } from '@/api/depot/wareHouse'
export default {
  name: 'MonthReport',
  created () {
    this.getFirst()
  },
  components: {
    STable,
    DhEmpty
  },
  data () {
    return {
      loading: true,
      emptyText: <dh-empty />,
      monthFormat: 'YYYY-MM',
      loadingSpin: false,
      queryParam: {
        page: 1,
        size: 10000,
        // reportDate: moment(new Date()).subtract(1, 'months').format('YYYY-MM'),
        reportDate: moment().subtract(1, 'months').format('YYYY-MM'),
        distCode: this.$store.state.user.info.distCode
      },
      distList: [],
      monthList: [
        {
          date: '2019-11',
          title: '2019年11月'
        },
        {
          date: moment(new Date()).format('YYYY-MM-DD'),
          title: '实时'
        }
      ],
      defaultVal: moment().subtract(1, 'months'),
      columns: [
        {
          title: '经销商名称',
          dataIndex: 'distName',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'distName' }
        },
        {
          title: '产品型号',
          dataIndex: 'productType',
          align: 'left',
          width: 120
        },
        {
          title: '上月末库存',
          dataIndex: 'lastMonthStock',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月进货',
          dataIndex: 'inStock',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月销量',
          dataIndex: 'sales',
          align: 'left',
          width: 80,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月在途',
          dataIndex: 'transitStock',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '已出库未开票',
          dataIndex: 'outStockNoInvoice',
          align: 'left',
          width: 140,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月本库',
          dataIndex: 'stock',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月赊销库',
          dataIndex: 'sellOnCredit',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月实际库存',
          dataIndex: 'actualStockTotal',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月理论库存',
          dataIndex: 'theoryStock',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '差异',
          dataIndex: 'difference',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月换货',
          dataIndex: 'exchange',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        },
        {
          title: '本月新增污损',
          dataIndex: 'newDeficient',
          align: 'left',
          width: 120,
          scopedSlots: { customRender: 'monthText' }
        }
      ],
      loadData: []
      // 加载数据方法 必须为 Promise 对象
    //   loadData: parameter => {
    //     return monthList(Object.assign(this.queryParam, parameter)).then(
    //       res => {
    //         const monthList = DataFilter(res, "monthList");
    //         this.queryParam.size = res.data.pageSize;
    //         return monthList;
    //       }
    //     );
    //   }
    }
  },
  methods: {
    moment,
    handelRetrive () {
      this.loading = true
      monthList(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.loadData = res.data
        }
        this.loading = false
      })
    },

    disabledDate (current) {
      return !current.isBetween(
        moment('2020-1', 'YYYY-MM'),
        moment().endOf('month')
      )
    },
    getFirst () {
      userDistRange().then(res => {
        if (res.data.length > 4) {
          res.data.unshift({
            distCode: 'qbkw~001',
            distName: '全部'
          })
          this.queryParam.distCode = res.data[1].distCode
        } else {
          this.queryParam.distCode = this.$store.state.user.info.distCode
        }
        this.distList = res.data
        this.handelRetrive()
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleDistChange () {
      // console.info('e---',dist)
      if (this.queryParam.distCode === 'qbkw~001') {
        this.queryParam.distCode = undefined
      }
      //   this.$refs.table.refresh(false);
      this.handelRetrive()
      // this.getAanalysis()
    },
    handleChangeTimer (date, dateString) {
      this.queryParam.reportDate = date ? moment(date).format('YYYY-MM') : null
      this.handelRetrive()
    },
    handleCheck (val) {
      this.queryParam.reportDate = val
    },
    handleDown () {
      this.handleExport()
    },
    handleExport () {
      this.loadingSpin = true
      exportTable(
        [],
        {
          ...this.queryParam
        //   reportDate: null
        },
        '/amo/report/monthlyReport/export',
        '月报',
        true
      ).then(doc => {
        this.loadingSpin = false
      })
    }
  },
  destroyed () {
    this.loadingSpin = false
  }
}
</script>

<style lang="less" scoped>
.monthTable {
  .ant-table-tbody > tr > td {
    padding: 10px 10px;
    .serialWrap {
      display: inline-block;
    }
  }
}
</style>
<style scoped lang="less">
.ant-card-bordered {
  border: none !important;
}
.searchTitle {
  .selectFirm {
    float: left;
    line-height: 32px;
  }
  .selectType {
    float: right;
    .ant-select-selection__placeholder {
      color: #49494b;
    }
  }
  .selectTime {
    float: right;
    margin-left: 10px;
    span {
      float: left;
      display: inline-block;
      line-height: 32px;
    }
    .ant-calendar-picker {
      color: #49494b;
      font-weight: bold;
      font-size: 14px;
      float: left;
    }
  }
  .ant-dropdown-link {
    font-size: 14px;
    color: #34353e;
    font-weight: bold;
  }
}
.monthWrap {
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
  .ant-tag {
    float: left;
  }
  :global {
    a {
      display: inline-block;
      text-align: center;
      position: absolute;
      top: 50%;
      margin-top: -160px;
      left: 50%;
      margin-left: -100px;
      .iconfont {
        font-size: 110px;
        color: rgba(236, 236, 236, 1);
      }
      h3 {
        color: rgba(147, 147, 147, 1);
        font-size: 16px;
        font-weight: bold;
      }
      p {
        color: rgba(177, 177, 177, 1);
        font-size: 14px;
      }
    }
  }
}

//上传中
.uploading {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.65);
  z-index: 99;
  left: 0;
  top: 0;
  .ant-spin-text {
    color: #fff;
    position: relative;
    top: 250px;
  }
  .ant-spin-dot {
    top: 250px;
    i {
      background-color: #fff;
    }
  }
}
.serialWrap {
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
