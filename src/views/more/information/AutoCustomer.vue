<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>自定义开票名称</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>自定义开票名称</span>
                </template>
                <i class="iconfont icon-plus" />
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
              <label for>可开票名称</label>
              <a-input
                placeholer="可开票名称"
                placeholder="请输入可开票名称"
                v-model="queryParam.mappingName"
              ></a-input>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="resetList">重置</a-button>
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
        <!-- <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span> -->
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <a href="javascript:;" @click="handleAdd(record)" v-if="hasPermission('edit')">
                <i class="iconfont icon-table-edit" />编辑
              </a>
              <a href="javascript:;" @click="deleData(record)">
                <i class="iconfont icon-tableEmpty" />删除
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px;" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <add-auto-customer :tabletData="tabletInfo" @handleNewSN="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { getHosMapList, delHosMap } from '@/api/basicInfo/hosData'
import { AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
import notification from 'ant-design-vue/es/notification'
import AddAutoCustomer from './modules/AddAutoCustomer'
import { DataFilter, BtnShow } from '@/utils/storage'
import { STable } from '@/components'

export default {
  name: 'MyCustomer',
  created () {
    this.getFirstLoad()
  },
  components: {
    AddAutoCustomer,
    AreaSelect,
    STable,
    DhEmpty
  },
  data () {
    return {
      cusType: undefined,
      distCode: undefined,
      cusTypeList: [],
      emptyText: <dh-empty />,
      searchList: [],
      isShowArea: true, // 判断省市联动是否显示
      cusList: [],
      distList: [],
      pca,
      pcaa,
      loading: true,
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      columns: [
        {
          width: 200,
          title: '客户名称',
          dataIndex: 'hosName',
          key: 'hosName'
        },
        {
          width: 200,
          title: '可开票名称',
          dataIndex: 'mappingName',
          key: 'mappingName'
        }
      ],
      isAdd: false,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10
      },
      btnPermission: [],
      loadData: parameter => {
        return getHosMapList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const tableList = DataFilter(res, 'table')
            this.queryParam.size = res.data.pageSize
            return tableList
          }
        )
      },
      privinceData: [],
      tabletInfo: {}
    }
  },
  methods: {
    hasPermission (val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad () {
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
    },
    deleData (record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.hosName + '】?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id
          }
          // console.log(record);
          delHosMap(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.$refs.table.refresh(true)
            } else {
              notification.error({
                message: '错误',
                description: '删除失败！'
              })
            }
          })
        }
      })
    },
    retriveTable () {
      this.queryParam.cusType = this.cusType
      this.queryParam.distCode = this.distCode
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleProvince (val) {
      // console.info("已选择", val);
    },

    handleSearch () {
      this.isShowSearch = true
      this.isShowArea = true
    },

    onSearchClose () {
      this.isShowSearch = false
    },

    handleChange () {
      this.isAdd = false
    },

    handleAdd (val) {
      const _that = this
      const callback = function () {
        _that.isAdd = false
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/more/information/AutoCustomer#edit')
      window.addEventListener('popstate', callback)
      if (val) {
        this.tabletInfo = val
      } else {
        this.tabletInfo = []
      }
      this.isAdd = true
    },
    resetList () {
      this.queryParam = {
        page: 1,
        size: 10
      }
    }
  }
}
</script>

<style lang="less">
/* 城市2级联动样式 */
.area-select-wrap {
  display: flex;
  flex-wrap: nowrap;

  .area-select {
    background: #fcfcfc;
    border: 1px solid #ececec;
    color: rgba(159, 172, 195, 1);
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
        content: "\e64b";
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
