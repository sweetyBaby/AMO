<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>库位管理</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加库位</span>
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
              <label for>经销商名称</label>
              <a-select
                placeholder="请选择经销商名称"
                style="width: 100%"
                v-model="queryParam.distCode"
                :filterOption="filterOption"
                showSearch
              >
                <a-select-option
                  v-for=" (item,index) in distList"
                  :value="item.distCode"
                  :key="index"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>库位名称</label>
              <a-input placeholder="输入库位名称" style="width: 100%" v-model="queryParam.code" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="() => queryParam = {}">重置</a-button>
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
        <!-- <span slot="isPrimary" slot-scope="text">
          <span :status-map="orPrimary">{{orPrimary[text].text}}</span>
        </span>
        <span slot="type" slot-scope="text">
          <span :status-map="typeWareHouse">{{typeWareHouse[text].text}}</span>
        </span>-->
        <!-- <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span> -->
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn" v-if="record.type!=2">
            <template slot="title">
              <a href="javascript:;" @click="handleAdd(record)" v-if="hasPermission('edit')">
                <i class="iconfont icon-table-edit" />编辑
              </a>
              <a href="javascript:;" @click="deleData(record)" v-if="record.isPrimary=='0' && hasPermission('delete')">
                <i class="iconfont icon-tableEmpty" />删除
              </a>
              <a
                href="javascript:;"
                @click="mainBlank(record)"
                v-if="record.isPrimary=='0'&&record.type=='1' && hasPermission('mainHost')"
              >
                <i class="iconfont icon-use" />更新为主库
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <add-location-management :tabletData="tabletInfo" @handleNewSN="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { Icon } from 'ant-design-vue'
import { userDistRange } from '@/api/depot/wareHouse'
import { retriveLocation, deleLocation, setPrimary } from '@/api/information'
import notification from 'ant-design-vue/es/notification'
import AddLocationManagement from './modules/AddLocationManagement'
import { DataFilter, BtnShow } from '@/utils/storage'
import { STable } from '@/components'

export default {
  name: 'LocationManagement',
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  // create生命周期只加载一次
  created () {
    this.getFirstLoad()
    const params = {
      distCode: this.$store.state.user.info.distCode
    }
    userDistRange(params).then(res => {
      // console.info('====',res)
      this.distList = res.data
    })
  },
  components: {
    STable,
    AddLocationManagement,
    DhEmpty
  },
  data () {
    return {
      btnPermission: [],
      emptyText: <dh-empty />,
      distList: [],
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      columns: [
        {
          width: 150,
          title: '经销商',
          dataIndex: 'distName',
          key: 'distName'
        },
        {
          width: 150,
          title: '库位名称',
          dataIndex: 'whName',
          key: 'whName'
        },
        {
          width: 150,
          title: '库位代码',
          dataIndex: 'whCode',
          key: 'whCode'
        },
        {
          width: 100,
          title: '库位类型',
          dataIndex: 'type',
          key: 'type',
          customRender: (text, record) => {
            switch (text) {
              case '1':
                return '自有库位'
              case '3':
                return '自有寄售'
              case '2':
                return '华润寄售'
              case '4':
                return '污损库'
              case '5':
                return '报废库'
              default:
                return null
            }
          }
          // scopedSlots: { customRender: "type" }
        },
        {
          width: 150,
          title: '是否为主库',
          dataIndex: 'isPrimary',
          key: 'isPrimary',
          customRender: (text, record) => {
            switch (text) {
              case 1:
                return '是'
              case 0:
                return '否'
              default:
                return null
            }
          }
          // scopedSlots: { customRender: "isPrimary" }
        },
        {
          width: 150,
          title: '库位地址',
          dataIndex: 'address',
          key: 'address'
        },
        {
          width: 150,
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        }
      ],
      isAdd: false,
      orPrimary: {
        0: {
          systemStatus: '0',
          text: '否'
        },
        1: {
          systemStatus: '1',
          text: '是'
        }
      },
      typeWareHouse: {
        1: {
          type: '1',
          text: '自有主库'
        },
        3: {
          type: '3',
          text: '自由寄售'
        },
        2: {
          type: '2',
          text: '华润寄售'
        },
        4: {
          type: '4',
          text: '污损库'
        },
        5: {
          type: '5',
          text: '污损库'
        }
      },
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10
      },
      loadData: parameter => {
        return retriveLocation(Object.assign(this.queryParam, parameter)).then(
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
    hasPermission (val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad () {
      //   const currentRoute = this.$route.meta.permission[0];
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      // console.log(currentRoute);
      this.btnPermission = BtnShow(currentRoute)
      // console.info("---", this.$route.meta.permission[0]);
      if (this.hasPermission('edit') || this.hasPermission('delete' || this.hasPermission('mainHost') || this.hasPermission('add'))) {
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
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
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
      const _that = this
      const callback = function () {
        _that.isAdd = false
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(
        null,
        null,
        '/more/information/LocationManagement#detail'
      )
      window.addEventListener('popstate', callback)
      if (val) {
        this.tabletInfo = val
      } else {
        this.tabletInfo = []
      }
      this.isAdd = true
    },
    mainBlank (record) {
      this.$confirm({
        title: '是否设为主库',
        content: '是否将【' + record.whName + '】替换主库为当前库位',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id
          }
          setPrimary(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.$refs.table.refresh(true)
            } else {
              notification.error({
                message: '错误',
                description: res.data
              })
            }
          })
        }
      })
    },
    deleData (record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.whName + '】库位',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id
          }
          deleLocation(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.$refs.table.refresh(true)
            } else {
              notification.error({
                message: '错误',
                description: res.data
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
