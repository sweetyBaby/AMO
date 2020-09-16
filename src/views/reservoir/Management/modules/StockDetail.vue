<template>
  <a-card :bordered="false">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存表</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handelBack">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
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
              <label for>选择经销商</label>
              <a-select
                showSearch
                :filterOption="filterOption"
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="queryParam.distCode"
                @change="handleChange"
              >
                <a-select-option
                  v-for="item in distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList" v-if="productT">
              <label for>产品型号</label>
              <a-select
                showSearch
                :filterOption="filterOption"
                style="width: 100%;"
                placeholder="全部"
                v-model="queryParam.productModel"
              >
                <a-select-option
                  v-for="item in productType"
                  :key="item.productModel"
                  :value="item.productModel"
                >{{ item.productModel }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList" v-if="dNum">
              <label for>度数</label>
              <a-input v-model="queryParam.degree" placeholder="输入度数" style="width: 100%;" />
            </div>
            <div class="searchList" v-if="bankType">
              <label for>库位类型</label>
              <a-form-item>
                <a-form-item style="width: 100%">
                  <a-select
                    placeholder="请选择库位类型"
                    style="width: 100%"
                    v-model="queryParam.type"
                    @change="handleType"
                  >
                    <a-select-option
                      v-for="item in typeList"
                      :value="item.typeCode"
                      :key="item.typeCode"
                    >{{ item.typeName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
            </div>
            <div class="searchList" v-if="bankName">
              <label for>库位名称</label>
              <a-form-item>
                <a-form-item style="width: 100%">
                  <a-select
                    placeholder="请选择库位名称"
                    style="width: 100%"
                    v-model="queryParam.whCode"
                    showSearch
                    :filterOption="filterOption"
                  >
                    <a-select-option
                      v-for="item in whList"
                      :value="item.whCode"
                      :key="item.whCode"
                    >{{ item.whName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="getTableList()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset()" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        class="bankTable"
        :locale="{emptyText:emptyText}"
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-left">
              <div class="tabBtn">
                <a-popover placement="bottomRight" overlayClassName="tableBtn">
                  <template slot="title">
                    <a @click="handleInfo(record)">
                      <i class="iconfont icon-detail" />查看详情
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore" />
                </a-popover>
              </div>
            </div>
          </template>
        </span>
        <template :slot="totaNumber" slot-scope="currentPageData">总数: {{ productNumber }}</template>
      </s-table>
    </div>
  </a-card>
</template>

<script>
import DhEmpty from '../../../comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter, exportTable } from '@/utils/storage'
import { inventoryList, productCount } from '@/api/depot/depot'
import { userDistRange } from '@/api/depot/wareHouse'
import { findProductMo } from '@/api/basicInfo/hosData'
import { retriveLocation } from '@/api/information'

const typeList = [
  {
    typeCode: 1,
    typeName: '自有库'
  },
  {
    typeCode: 3,
    typeName: '自有寄售'
  },
  {
    typeCode: 2,
    typeName: '华润寄售'
  },
  {
    typeCode: 4,
    typeName: '污损库'
  }
  //   {
  //     typeCode: 5,
  //     typeName: "报废库"
  //   }
]

export default {
  name: 'StockDetail',
  props: ['tableType', 'radioShow', 'tableRecord'],
  components: {
    STable,
    DhEmpty
  },
  created () {
    this.getSearch()
    this.getProList()
    this.showTable()
    this.getCount()
  },
  data () {
    return {
      productNumber: '',
      bankName: false,
      dNum: false,
      productT: false,
      bankType: true,
      AddCode: true,
      productType: [],
      emptyText: <dh-empty />,
      isEmpty: false,
      isShowSearch: false,
      loadingSpin: false,
      loading: true,
      search: {
        date: '',
        result: ''
      },
      columns: [],
      typeList,
      distList: [],
      whList: [],
      queryParam: {
        page: 0,
        size: 10,
        type: undefined,
        productModel: undefined,
        degree: '',
        whCode: undefined
      },
      totaNumber: null,
      tableList: [],
      loadData: parameter => {
        return inventoryList(Object.assign(this.queryParam, parameter)).then(
          res => {
            this.totaNumber = null
            if (res.data.list.length > 0) {
              this.totaNumber = 'footer'
            }
            const inventoryList = DataFilter(res, 'inventory')
            this.queryParam.size = res.data.pageSize
            this.tableList = inventoryList
            return inventoryList
          }
        )
      }
    }
  },
  methods: {
    handleExport () {
      this.loadingSpin = true
      this.queryParam = {
        ...this.queryParam,
        page: undefined,
        size: undefined
      }
      let exportTitle = ''
      if (this.queryParam.summary.toString() === ['2', '3'].toString()) {
        exportTitle = '度数表'
      } else if (this.queryParam.summary.toString() === ['2', '4'].toString()) {
        exportTitle = '库位表'
      } else if (this.queryParam.summary.toString() === ['1', '2'].toString()) {
        exportTitle = '型号表'
      }
      exportTable(
        this.tableList.data,
        this.queryParam,
        '/amo/inventory/detail/export',
        exportTitle
      ).then(res => {
        this.loadingSpin = false
      })
    },
    getCount () {
      productCount(this.queryParam).then(res => {
        // console.log(res.data);
        this.productNumber = res.data
      })
    },
    showTable () {
      this.columns = [
        {
          title: '经销商名称',
          dataIndex: 'distName',
          width: 180
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          width: 100
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: 100
        },
        {
          title: '数量/单位',
          dataIndex: 'qty',
          customRender: (text, record) => {
            return text + record.uom
          },
          width: 100
        }
      ]
      if (this.radioShow === '2') {
        this.queryParam = {
          ...this.queryParam,
          summary: ['2'],
          degree: undefined,
          whCode: undefined,
          productModel: undefined,
          type: undefined,
          distCode: undefined
        }

        if (this.columns.length > 5) {
          this.columns.splice(0, this.columns.length - 5)
        }
        if (this.tableType === 'degree') {
          this.queryParam = {
            ...this.queryParam,
            productModel: this.tableRecord.productModel,
            distCode: this.tableRecord.distCode,
            summary: ['2', '3']
          }
          this.productT = true
          this.bankType = false
          this.dNum = true
          this.bankName = false
          this.columns.splice(2, 0, {
            title: '度数',
            dataIndex: 'degree',
            width: 100,
            customRender: (text) => {
              return text === '1000.0' ? '未知度数' : text
            }
          })
        } else if (this.tableType === 'bank') {
          this.queryParam = {
            ...this.queryParam,
            productModel: this.tableRecord.productModel,
            distCode: this.tableRecord.distCode,
            summary: ['2', '4']
          }
          this.bankType = true
          this.productT = true
          this.dNum = false
          this.bankName = true
          this.columns.splice(1, 0,
            {
              title: '库位类型',
              dataIndex: 'type',
              width: 100,
              customRender: text => {
                switch (text) {
                  case '1':
                    return '自有库'
                    break
                  case '2':
                    return '华润寄售'
                    break
                  case '3':
                    return '自有寄售'
                    break
                  case '4':
                    return '污损库'
                    break
                  case '5':
                    return '报废库'
                    break
                  default:
                    break
                }
              }
            },
            {
              title: '库位名称',
              dataIndex: 'whName',
              width: 100
            }
          )
          //   this.columns.splice(3, 0, {
          //     title: "库位名称",
          //     dataIndex: "whName",
          //     width: 100
          //   });
        }
      } else if (this.radioShow === '1') {
        this.queryParam = {
          ...this.queryParam,
          summary: ['1', '2'],
          degree: undefined,
          whCode: undefined,
          productModel: undefined,
          type: parseInt(this.tableRecord.type),
          distCode: this.tableRecord.distCode
        }
        this.getWhDetail()
        // if (this.columns.length > 4) {
        //   this.columns.splice(0, this.columns.length - 4);
        // }
        this.productT = true
        this.bankType = true
        this.dNum = false
        this.columns.splice(1, 0, {
          title: '库位类型',
          dataIndex: 'type',
          width: 100,
          customRender: text => {
            switch (text) {
              case '1':
                return '自有库'
                break
              case '2':
                return '华润寄售'
                break
              case '3':
                return '自有寄售'
                break
              case '4':
                return '污损库'
                break
              case '5':
                return '报废库'
                break
              default:
                break
            }
          }
        })
      }
      //   this.$refs.table.refresh(true);
      this.getCount()
    },
    // 返回上一级的方法
    handelBack () {
      this.$emit('back', 'table')
    },

    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleSearch () {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose () {
      // 关闭搜索
      this.isShowSearch = false
    },
    handleChange (val) {
      this.queryParam.distCode = val
      this.queryParam.whCode = undefined
      this.getWhList()
    },
    handleType (val) {
      this.queryParam.type = val
      this.queryParam.whCode = undefined
      if (this.queryParam.distCode) {
        this.getWhDetail()
      }
    },
    getProList () {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        // console.log(res);
        this.productType = res.data
        this.productType.unshift({
          productModel: '全部'
        })
      })
    },
    getWhList () {
      const params = {
        page: 1,
        size: 10000,
        distCode: this.queryParam.distCode
      }
      userDistRange(params).then(res => {
        this.distList = res.data
      })
      this.getWhDetail()
    },
    getWhDetail () {
      const params = {
        distCode: this.queryParam.distCode,
        type: this.queryParam.type,
        page: 1,
        size: 10000
      }
      retriveLocation(params).then(res => {
        this.whList = res.data.list
      })
    },
    getSearch () {
      userDistRange(this.queryParam).then(res => {
        this.distList = res.data
      })
    },
    getTableList () {
      this.isShowSearch = false
      this.getCount()
      if (this.queryParam.productModel === '全部') {
        this.queryParam.productModel = undefined
      }
      this.$refs.table.refresh(true)
    },
    handleReset () {
      this.whList = []
      this.queryParam = {
        ...this.queryParam,
        productModel: undefined,
        degree: '',
        whCode: undefined,
        type: undefined,
        distCode: undefined
      }
    }
  },
  destroyed () {
    this.loadingSpin = false
  }
}
</script>

<style lang="less">
.ant-table-footer {

    border-radius: 0 0 8px 8px;
    span{
        font-size:16px;
        color:#3E4DA8;
        font-weight: 700;
    }
}
.ant-card-bordered {
  border: none !important;
}
.bankTable {
  .ant-table-content .ant-table-tbody > tr:last-child > td:first-child {
    border-bottom-left-radius: 0px !important;
  }
  .ant-table-content .ant-table-tbody > tr:last-child > td:last-child {
    border-bottom-right-radius: 0px !important;
  }
  .ant-table-footer {
    border: 1px solid #e8e8e8;
  }
}
/* 搜索样式 */
.searchWrap {
  .ant-drawer-content-wrapper {
    background: rgba(251, 251, 251, 1);
    box-shadow: -3px 0px 6px rgba(0, 4, 123, 0.2);
    .ant-drawer-content {
      background: rgba(251, 251, 251, 1);
      .ant-drawer-header {
        border: none;
        background: rgba(251, 251, 251, 1);
        font-size: 14px;
      }
      .ant-drawer-close {
        .anticon {
          color: rgba(148, 148, 148, 1);
          &:hover {
            color: rgba(62, 77, 168, 1);
          }
        }
      }
      .ant-drawer-body {
        padding: 0 24px 24px 24px;
        height: calc(100% - 54px);
        /*overflow-y: auto;*/
        .searchList {
          padding: 0 0 40px 0;
          .ant-calendar-picker {
            width: 100%;
          }
          label {
            color: rgba(147, 147, 147, 1);
            font-size: 14px;
            line-height: 20px;
            margin: 0 0 8px 0;
            width: 100%;
            display: block;
          }
          .ant-input {
            border: 1px solid rgba(233, 233, 233, 1);
            border-radius: 4px;
            background: white;
            height: 44px;
            line-height: 44px;
            .ant-calendar-picker {
              line-height: 36px;
            }
          }
        }
        .ant-form {
          height: 100%;
          padding: 0 0 60px 0;
          .searchWrap {
            height: 100%;
            overflow-y: auto;
            .ant-form-item {
              width: 100%;
              margin-right: 0;
            }

            .ant-select-selection {
              background: #fff !important;
              border: 1px solid #ececec !important;
            }

            .ant-select-selection--single {
              height: 42px;
              width: 100%;
            }

            .ant-select-selection__rendered {
              line-height: 42px;
            }

            .ant-select-dropdown-menu-item-active {
              background-color: #e6f7ff !important;
            }

            .adInput-input {
              .begin_date {
                .anticon-calendar {
                  color: #3e4da8;
                }
              }

              .ant-form-item,
              .ant-form-item-control-wrapper,
              .ant-form-item-control {
                width: 100%;
              }

              .ant-input {
                width: 100%;
                height: 44px;
                background: rgba(252, 252, 252, 1);
                border: 1px solid rgba(236, 236, 236, 1);
                opacity: 1;
                border-radius: 4px;
              }

              .ant-input-affix-wrapper .ant-input-suffix {
                .icon-cancle {
                  color: rgba(205, 223, 252, 1);
                  font-size: 24px;
                }
              }
            }
          }
          position: relative;
          .table-page-search-submitButtons {
            text-align: center;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            .ant-btn {
              width: 130px;
              height: 44px;
            }
          }
        }
      }
    }
  }
}
</style>
