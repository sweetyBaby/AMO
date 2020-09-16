<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>经销商主数据</h3>
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
              <!--              <a-input placeholder="输入经销商名称" style="width: 100%" v-model="queryParam.distName" />-->
              <a-select
                showSearch
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="queryParam.distCode"
                optionFilterProp="children"
                :filterOption="filterOption"
                @change="handleDist"
              >
                <a-select-option
                  v-for="item in distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>经销商代码</label>
              <a-input placeholder="输入经销商代码" style="width: 100%" v-model="queryParam.distCode" />
            </div>
            <div class="searchList">
              <label for>省份/城市</label>
              <area-select
                type="text"
                v-model="privinceData"
                size="large"
                @change="handleProvince"
                :data="pca"
                icon="icon-arrow-down "
                v-if="isShowArea"
              />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="getTableList()" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetBtn" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <a-table
        :locale="{emptyText:emptyText}"
        :columns="columns"
        :dataSource="tableDatas"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="tableDatas => tableDatas.id"
      >
        <span slot="action" slot-scope="text, record" class="action_btn">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <a href="javascript:;" @click="handleAdd(record)" v-if="hasPermission('edit')">
                <i class="iconfont icon-table-edit" />编辑
              </a>
              <a href="javascript:;" @click="deleHostData(record)" v-if="hasPermission('delete')">
                <i class="iconfont icon-tableEmpty" />删除
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px;" />
            </span>
          </a-popover>
        </span>
      </a-table>
    </div>
    <!-- <depot-empty v-else /> -->
  </a-card>
  <a-card v-else :bordered="false">
    <add-dealers-data :tableData="tableInfo" @handleNewPro="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import moment from 'moment'
import { pca, pcaa } from 'area-data'
import { AreaSelect } from 'vue-area-linkage'
import { Icon } from 'ant-design-vue'
import { retriveDealersData, deleDealersData } from '@/api/basicInfo/hosData'
import AddDealersData from './modules/AddDealersData'
import notification from 'ant-design-vue/es/notification'
import { BtnShow } from '@/utils/storage'

export default {
  name: 'ProductSN',
  // create生命周期只加载一次
  created() {
    this.getTableList()
    this.getFirstLoad()
  },
  components: {
    AddDealersData,
    AreaSelect,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty />,
      isShowArea: true, // 判断省市联动是否显示
      pca,
      pcaa,
      privinceData: [],
      loading: true,
      distList: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      columns: [
        {
          width: 213,
          title: '经销商名称',
          dataIndex: 'distName',
          key: 'distName'
        },
        {
          width: 113,
          title: '经销商代码',
          dataIndex: 'distCode',
          key: 'distCode'
        },
        {
          width: 93,
          title: '省份',
          dataIndex: 'province',
          key: 'province'
        },
        {
          width: 93,
          title: '城市',
          dataIndex: 'city',
          key: 'city'
        },
        {
          width: 193,
          title: '地址',
          dataIndex: 'address',
          key: 'address'
        },
        {
          width: 103,
          title: '地区',
          dataIndex: 'regionName',
          key: 'regionName'
        },
        {
          width: 103,
          title: '联系人',
          dataIndex: 'contacts',
          key: 'contacts'
        },
        {
          width: 103,
          title: '联系方式',
          dataIndex: 'contactPhone',
          key: 'contactPhone'
        }
      ],
      isAdd: false,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 0,
        size: 10
      }
    }
  },
  methods: {
    resetBtn() {
      this.isShowArea = false
      this.privinceData = []
      this.queryParam = {
        page: 1,
        size: 10
      }
      var t = setTimeout(() => {
        this.isShowArea = true
      }, 0)
    },
    handleProvince(val) {
      this.queryParam.province = val[0]
      this.queryParam.city = val[1]
    },
    // 分页
    handleTableChange(pagination) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      //   this.queryParam = {
      //     page: pagination.current,
      //     size: pagination.pageSize
      //   };
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getTableList(this.queryParam)
    },
    getTableList() {
      this.loading = true
      this.isShowSearch = false
      retriveDealersData(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          const pagination = { ...this.pagination }
          this.tableDatas = res.data.list
          this.pagination = pagination
          this.pagination.total = res.data.total
          this.loading = false
        }
      })
      document.body.scrollTop = 0
    },
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad() {
      //  判断按钮
      //   const currentRoute = this.$route.meta.permission[0]
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      this.btnPermission = BtnShow(currentRoute)
      if (this.hasPermission('edit') || this.hasPermission('delete')) {
        this.columns.push({
          width: 100,
          align: 'center',
          title: '操作',
          scopedSlots: {
            customRender: 'action'
          }
        })
      }
      const params = {
        page: 1,
        size: 999
      }
      retriveDealersData(params).then(res => {
        // console.info('res-date---',res)
        this.distList = res.data.list
      })
    },
    handleReset() {
      this.distCode = ''
      this.defaultName = undefined
      this.queryParam = {
        distName: undefined,
        cusName: '',
        hosName: ''
      }
    },
    filterOption(input, option) {
      // console.log(input);
      if (input) {
      }
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleDist(val) {
      this.queryParam.distCode = val
    },
    handleSearch() {
      this.privinceData = []
      this.isShowSearch = true
    },

    onSearchClose() {
      this.isShowSearch = false
    },

    handleChange() {
      this.isAdd = false
      this.getTableList()
    },

    handleAdd(val) {
      const _that = this
      const callback = function() {
        _that.isAdd = false
        console.log('销毁')
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/more/basicInfo/DealersData#detail')
      window.addEventListener('popstate', callback)
      if (val) {
        this.tableInfo = val
      } else {
        this.tableInfo = []
      }
      this.isAdd = true
    },

    deleHostData(record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.distName + '】医院主数据？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id,
            distCode: record.distCode
          }
          deleDealersData(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.getTableList()
            } else {
              notification.error({
                message: '错误',
                description: res.message
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
/* 高级搜索框城市2级联动样式 */
.area-select-wrap {
  display: flex;
  flex-wrap: nowrap;

  .area-select {
    background: #fff;
    border: 1px solid #ececec;
    color: rgba(132, 132, 132, 0.65);
    height: 42px;
    width: 50%;
    line-height: 42px;
    display: inline-block;
    position: relative;

    .area-select-icon {
      font-family: "iconfont";
      font-style: normal;
      position: absolute;
      right: 16px;
      top: 0;

      &:before {
        content: "\e665";
      }
    }

    &:first-child {
      margin-left: 0;
    }

    .area-selected-trigger {
      width: 100%;
      padding: 0 12px;
      display: inline-block;
    }

    .area-selectable-list-wrap {
      position: absolute;
      margin: -15px 0 0 0;
      width: 100%;
    }

    .area-selectable-list {
      border: 1px solid #ececec;
      width: 100%;
      margin: 12px 0 0 0;
      padding: 0;
      list-style: none;
      z-index: 9999;
      position: absolute;
      background: #fcfcfc;
      max-height: 130px;
      overflow-y: auto;

      li {
        padding: 0 12px;
        cursor: pointer;
        line-height: 32px;
      }
    }
  }
}

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

/* } */

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
</style>
