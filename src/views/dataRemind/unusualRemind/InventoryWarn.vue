<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库存预警</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <!-- <span class="titleBtn" @click="handleAdd()">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>添加产品SN</span>
                                    </template>
                                    <i class="iconfont icon-plus" />
                                </a-tooltip>
            </span>-->
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search"></i>
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
              <label for>库位名称</label>
              <a-select
                v-model="queryParam.whCode"
                placeholder="请选择库位名称"
                showSearch
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="item in bankList"
                  :value="item.type+'-'+item.whCode"
                  :key="item.whCode"
                >{{ item.whName }}</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable" size="small">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="ResetList">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :locale="{emptyText:emptyText}"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <!-- <a href="javascript:;" @click="deleHostData(record)">
                <i class="iconfont icon-tableEmpty" />删除
              </a>-->
              <!-- <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-card-edit" />编辑
              </a>-->
            </template>
            <span>
              <i class="iconfont icon-tableMore"></i>
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <!-- <add-product-s-n :tabletData="tabletInfo" @handleNewSN="handleChange()" /> -->
  </a-card>
</template>
<script>
import { exportTable, DataFilter, exportTabList } from '@/utils/storage'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { userDistRange } from '@/api/depot/wareHouse'
import { STable } from '@/components'
import { findProductMo, retriveNameData } from '@/api/basicInfo/hosData'
import { retriveLocation } from '@/api/information'

import { inventoryWarnList } from '@/api/unusualRemind'
import notification from 'ant-design-vue/es/notification'
// import AddProductSN from './modules/AddProductSN';
const columns = [
  {
    width: 162,
    title: '产品型号',
    dataIndex: 'productModel',
    key: 'productModel'
  },
  {
    width: 174,
    title: '经销商',
    dataIndex: 'distName',
    key: 'distName'
  },
  {
    width: 162,
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  },
  { width: 162, title: '库位名称', dataIndex: 'whName', key: 'whName' },
  { width: 162, title: '数量', dataIndex: 'qty', key: 'qty' },
  {
    width: 162,
    title: '库存预警数',
    dataIndex: 'earlyWarningInventory',
    key: 'earlyWarningInventory'
  },
  {
    width: 150,
    title: '低于预警数',
    dataIndex: 'q',
    key: 'q',
    customRender: (text, record) => {
      return record.earlyWarningInventory - record.qty
    }
  }
]
export default {
  name: 'InventoryWarn',
  // create生命周期只加载一次
  created () {
    this.reserveProductMo()
    this.getDistList()
  },
  components: {
    STable,
    DhEmpty
  },
  data () {
    return {
      //   whCode: undefined,
      tableList: [],
      emptyText: <dh-empty />,
      distList: [],
      modelList: [],
      loading: true,
      isShowSearch: false,
      loadingSpin: false,
      isEmpty: false,
      tableDatas: [],
      columns,
      isAdd: false,
      bankList: [],
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        whCode: undefined,
        distCode: undefined,
        page: 1,
        size: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return inventoryWarnList(
          Object.assign(this.queryParam, parameter)
        ).then(res => {
          const inventoryList = DataFilter(res, 'table')
          this.queryParam.size = res.data.pageSize
          this.tableList = inventoryList
          return inventoryList
        })
      }
    }
  },
  methods: {
    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/warn/inventoryWarnList/export',
          '库存预警导出列表'
        ).then(doc => {
          this.loadingSpin = false
        })
      }
    },
    ResetList () {
      this.bankList = []
      this.queryParam = {
        page: 1,
        size: 10,
        whCode: undefined,
        distCode: undefined
      }
    },
    getDistList () {
      const params = {
        distCode: this.$store.state.user.info.distCode
      }
      userDistRange(params).then(res => {
        this.distList = res.data
      })
    },
    reserveProductMo () {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.modelList = res.data
        }
      })
    },
    handleDist (value) {
      this.queryParam.distCode = value
      this.bankList = []
      this.queryParam.whCode = undefined
      this.getBankList()
    },
    getBankList () {
      const params = {
        page: 1,
        size: 10000,
        distCode: this.queryParam.distCode
      }
      retriveLocation(params).then(res => {
        console.log(res)
        res.data.list.map(item => {
          if (item.type !== '4' && item.type !== '5' && item.type !== '2') {
            this.bankList.push(item)
          }
        })
        // this.bankList = res.data.list;
        console.log(this.bankList)
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 高级搜索的查询
    retriveTable () {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleSearch () {
      this.isShowSearch = true
    },

    onSearchClose () {
      this.isShowSearch = false
    },

    handleChange () {
      this.isAdd = false
    },

    handleAdd (val) {
      if (val) {
        this.productSNdata = val
      } else {
        this.productSNdata = []
      }
      this.isAdd = true
    },

    deleSNdata (record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.productName + '】医院主数据？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id
          }
          deleSNData(params).then(res => {
            if (res.message === 'SUCCESS') {
            } else {
              notification.error({
                message: '错误',
                description: '删除失败！'
              })
            }
          })
        }
      })
    }
  }
}
</script>

    <style lang="less">
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
          .ant-select {
            height: 44px;
            .ant-select-selection--single {
              height: 44px;
            }
            .ant-select-selection__rendered {
              height: 44px;
              line-height: 44px;
            }
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

            &.ant-calendar-picker-input {
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
