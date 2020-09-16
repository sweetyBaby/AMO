<template>
  <a-card v-if="AddCode">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存表</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search" />
              </a-tooltip>
            </span>
          </div>
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAddCode()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>无码详情</span>
                </template>
                <i class="iconfont iconnoCode" />
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
            <div class="searchList">
              <label for>产品型号</label>
              <!-- <a-input v-model="queryParam.productModel" placeholder="输入产品型号" style="width: 100%;" /> -->
              <a-select
                showSearch
                :filterOption="filterOption"
                style="width: 100%;"
                placeholder="选择产品型号"
                v-model="queryParam.productModel"
              >
                <a-select-option
                  v-for="item in productType"
                  :key="item.productModel"
                  :value="item.productModel"
                >{{ item.productModel }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>度数</label>
              <a-input v-model="queryParam.degree" placeholder="输入度数" style="width: 100%;" />
            </div>
            <div class="searchList">
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
            <div class="searchList">
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
      </s-table>
    </div>
  </a-card>
  <add-no-code v-else @back="handelBack" />
</template>

<script>
import AddNoCode from './modules/AddNoCode'
import DhEmpty from '../../comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import { reportingList, inventoryList } from '@/api/depot/depot'
import { userDistRange } from '@/api/depot/wareHouse'
import { findProductMo } from '@/api/basicInfo/hosData'
import { retriveLocation } from '@/api/information'

const columns = [
  {
    title: '经销商名称',
    dataIndex: 'distName',
    width: 180
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    width: 180
  },,
  {
    title: '产品型号',
    dataIndex: 'productModel',
    width: 180
  },
  {
    title: '度数',
    dataIndex: 'degree',
    width: 100,
    customRender: (text) => {
      return text === '1000.0' ? '未知度数' : text
    },
  },
  {
    title: '库位名称',
    dataIndex: 'whName',
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
  },
  {
    typeCode: 5,
    typeName: '报废库'
  }
]

export default {
  name: 'Stock',
  components: {
    STable,
    DhEmpty,
    AddNoCode
  },
  created() {
    this.getSearch()
    this.getProList()
  },
  data() {
    return {
      // whCode:undefined,
      AddCode: true,
      productType: [],
      emptyText: <dh-empty />,
      isEmpty: false,
      isShowSearch: false,
      loading: true,
      search: {
        date: '',
        result: ''
      },
      columns,
      typeList,
      distList: [],
      whList: [],
      queryParam: {
        page: 0,
        size: 10,
        productModel: undefined,
        degree: '',
        whCode: undefined
      },
      loadData: parameter => {
        return inventoryList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const inventoryList = DataFilter(res, 'inventory')
            this.queryParam.size = res.data.pageSize
            return inventoryList
          }
        )
      },
      selectData: [
        { value: '0', text: '全部' },
        { value: '1', text: '处理失败' },
        { value: '2', text: '处理成功' }
      ]
    }
  },
  methods: {
    handelBack(val) {
      this.AddCode = val
    },
    handleAddCode() {
      const _that = this
      const callback = function() {
        _that.AddCode = true
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/reservoir/Management/Stock#detail')
      window.addEventListener('popstate', callback)
      this.AddCode = false
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    handleChange(val) {
      this.queryParam.distCode = val
      this.queryParam.whCode = undefined
      this.getWhList()
    },
    handleType(val) {
      this.queryParam.type = val
      this.queryParam.whCode = undefined
      if (this.queryParam.distCode) {
        this.getWhDetail()
      }
    },
    getProList() {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        // console.log(res);
        this.productType = res.data
      })
    },
    getWhList() {
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
    getWhDetail() {
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
    getSearch() {
      userDistRange(this.queryParam).then(res => {
        this.distList = res.data
      })
    },
    getTableList() {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    handleReset() {
      this.whList = []
      // this.whCode=undefined
      //   this.queryParam.productModel = "";
      //   this.queryParam.degree = "";
      //   this.queryParam.whCode = undefined;
      //   this.queryParam.type = undefined;
      //   this.queryParam.distCode = undefined;

      this.queryParam = {
        ...this.queryParam,
        productModel: undefined,
        degree: '',
        whCode: undefined,
        type: undefined,
        distCode: undefined
      }
    }
  }
}
</script>

<style lang="less">
.ant-card-bordered {
  border: none !important;
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
