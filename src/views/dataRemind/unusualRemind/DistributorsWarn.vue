<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>配送商备案效期预警</h3>
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
            <div class="searchList">
              <label for>经销商名称</label>
              <a-select
                showSearch
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
              <label for>配送机构</label>
              <a-select
                showSearch
                placeholder="请选择配送机构"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.cusCode"
              >
                <a-select-option
                  :value="item.cusCode"
                  v-for="(item,index) in cusList"
                  :key="index"
                >{{ item.cusName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>备案结束日期</label>
              <a-date-picker format="YYYY-MM-DD" @change="onChangeDate" v-model="date" />
            </div>
            <div class="searchList">
              <label for>是否忽略</label>
              <a-select placeholder="请选择是否忽略" v-model="queryParam.status">
                <a-select-option value="0">未忽略</a-select-option>
                <a-select-option value="1">忽略</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable()">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="clearBtn()">重置</a-button>
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
        :locale="{emptyText:emptyText}">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn" v-if=" record.status==0">
            <template slot="title">
              <a href="javascript:;" @click="deleHostData(record)">
                <i class="iconfont iconignore" />忽略
              </a>
              <!-- <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-card-edit" />编辑
              </a>-->
            </template>
            <span>
              <i class="iconfont icon-tableMore" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <!-- <add-product-s-n :productSNdata="productSNdata" @handleNewSN="handleChange()" /> -->
  </a-card>
</template>

<script>
import {
  findProductMo,
  retriveNameData,
  retriveCustName
  , reserveSNTable, deleSNData } from '@/api/basicInfo/hosData'
import DhEmpty from '../../comPublic/DhEmpty'
import { userDistRange } from '@/api/depot/wareHouse'
import moment from 'moment'
import { filingWarnList, ignoreFilingWarn } from '@/api/unusualRemind'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'

import notification from 'ant-design-vue/es/notification'
// import AddProductSN from './modules/AddProductSN';
const columns = [
  {
    width: 150,
    title: '经销商名称',
    dataIndex: 'distName',
    key: 'distName'
  },
  {
    width: 150,
    title: '配送机构',
    dataIndex: 'cusName',
    key: 'cusName'
  },
  {
    width: 150,
    title: '配送医院',
    dataIndex: 'hosName',
    key: 'hosName'
  },
  {
    width: 150,
    title: '剩余到期（天数）',
    dataIndex: 'diff',
    key: 'diff'
  },
  {
    width: 150,
    title: '提前提醒（天数）',
    dataIndex: 'day',
    key: 'day',
    customRender: (text, record) => {
      return 10
    }
  },
  //   {
  //     width: 150,
  //     title: "备案开始日期",
  //     dataIndex: "effectiveDateBegin",
  //     key: "effectiveDateBegin"
  //   },
  {
    width: 150,
    title: '备案结束日期',
    dataIndex: 'effectiveDate',
    key: 'effectiveDate'
    // customRender: (text, record) => {
    //   return moment(text).format("YYYY-MM-DD");
    // }
  },
  {
    width: 100,
    align: 'center',
    title: '操作',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'DistributorsWarn',

  // create生命周期只加载一次
  created() {
    this.getDistList()
    this.getCusList()
  },
  components: {
    STable,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty/>,
      cusList: [],
      date: null,
      distList: [],
      loading: true,
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      columns,
      isAdd: false,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return filingWarnList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const tableList = DataFilter(res, 'table')
            this.queryParam.size = res.data.pageSize
            return tableList
          }
        )
      }
    }
  },
  methods: {
    moment,
    clearBtn() {
      this.date = null
      this.queryParam = {
        page: 1,
        size: 10
      }
    },
    deleHostData(record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定忽略【' + record.distName + '】配送商备案效期预警？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id,
            status: 1
          }
          ignoreFilingWarn(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.$refs.table.refresh(true)
            } else {
              notification.error({
                message: '错误',
                description: '忽略失败！'
              })
            }
          })
        }
      })
    },
    // 高级搜索的查询
    retriveTable() {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    onChangeDate(date, dateString) {
      // console.log(dateString);
      this.queryParam.effectiveDate = dateString
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
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
    getCusList() {
      const params = {
        page: 1,
        size: 10000
      }
      retriveCustName(params).then(res => {
        if (res.message === 'SUCCESS') {
          // console.log(res);
          this.cusList = res.data.list
        }
      })
    },
    handleSearch() {
      this.isShowSearch = true
    },

    onSearchClose() {
      this.isShowSearch = false
    },

    handleChange() {
      this.isAdd = false
    },

    handleAdd(val) {
      if (val) {
        this.productSNdata = val
      } else {
        this.productSNdata = []
      }
      this.isAdd = true
    },

    deleSNdata(record) {
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
/* 操作的样式 */
/* .action_btn { */
.tableBtn .ant-popover-title {
  padding: 0;
  min-width: 160px;
  a {
    width: 100%;
    padding: 8px 0 8px 32px;
    color: rgba(147, 147, 147, 1);
    display: inline-block;
    box-sizing: border-box;
    .iconfont {
      font-size: 19px;
      color: rgba(147, 147, 147, 1);
      padding: 0 12px 0 0;
    }
    &:hover {
      background: rgba(246, 246, 248, 1);
      color: rgba(21, 58, 175, 1);
      .iconfont {
        color: rgba(21, 58, 175, 1);
      }
    }
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
          .ant-calendar-picker {
            max-width: 100%;
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
