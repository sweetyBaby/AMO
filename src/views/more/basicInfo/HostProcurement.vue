<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>配送商业务授权医院</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加产品</span>
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
              <!--              <a-input placeholder="输入经销商名称" style="width: 100%" v-model="queryParam.distName" />-->
              <!--              <dist-search @change="handleDist" :distNames.sync = "defaultName" />-->
              <a-select
                showSearch
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="queryParam.distCode"
                optionFilterProp="children"
                :filterOption="filterOption"
                @change="handleDist"
              >
                <a-select-option v-for="item in distList" :key="item.distCode" :value="item.distCode">{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>经销商代码</label>
              <a-input placeholder="输入经销商代码" style="width: 100%" v-model="queryParam.distCode" />
            </div>
            <div class="searchList">
              <label for>配送商</label>
              <a-input placeholder="输入配送商" style="width: 100%" v-model="queryParam.cusName" />
            </div>
            <div class="searchList">
              <label for>医院名称</label>
              <a-input placeholder="输入医院名称" style="width: 100%" v-model="queryParam.hosName" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
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
        <span slot="action" slot-scope="text, record" class="tabBtn">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <a href="javascript:;" @click="deleHostData(record)">
                <i class="iconfont icon-tableEmpty" />删除
              </a>
              <!-- <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-table-edit" />编辑
              </a>-->
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px;" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
    <!-- <depot-empty v-else /> -->
  </a-card>
  <a-card v-else :bordered="false">
    <add-host-procurement :tabletData="tabletInfo" @handleNewPro="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { STable } from '@/components'
import DistSearch from '@/views/comPublic/DistSearch'
import { retriveHostProcurement, deleHostProcurement } from '@/api/basicInfo/hosData'
import { userDistRange } from '@/api/depot/wareHouse'
import AddHostProcurement from './modules/AddHostProcurement'
import { DataFilter, BtnShow } from '@/utils/storage'

export default {
  name: 'HostProcurement',
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  // create生命周期只加载一次
  created() {
    this.getFirstLoad()
  },
  components: {
    AddHostProcurement,
    STable,
    DhEmpty,
    DistSearch
  },
  data() {
    return {
      emptyText: <dh-empty />,
      isShowSearch: false,
      isEmpty: false,
      columns: [
        {
          width: 120,
          title: '经销商名称',
          dataIndex: 'distName',
          key: 'distName'
        },
        {
          width: 120,
          title: '经销商代码',
          dataIndex: 'distCode',
          key: 'distCode'
        },
        {
          width: 120,
          title: '配送商',
          dataIndex: 'cusName',
          key: 'cusName'
        },
        {
          width: 120,
          title: '配送商代码',
          dataIndex: 'cusCode',
          key: 'cusCode'
        },
        {
          width: 130,
          title: '医院名称',
          dataIndex: 'hosName',
          key: 'hosName'
        },
        {
          width: 120,
          title: '医院代码',
          dataIndex: 'hosCode',
          key: 'hosCode'
        },
        {
          width: 100,
          title: '有效期',
          dataIndex: 'effectiveDate',
          key: 'effectiveDate'
        }
      ],
      isAdd: false,
      defaultName: undefined,
      distCode: '',
      distList: [],
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 0,
        size: 10,
        distCode: undefined
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return retriveHostProcurement(
          Object.assign(this.queryParam, parameter)
        ).then(res => {
          const tableList = DataFilter(res, 'table')
          this.queryParam.size = res.data.pageSize
          return tableList
        })
      },
      btnPermission: []
    }
  },
  methods: {
    // 高级搜索的查询
    retriveTable() {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad() {
      //  判断按钮
      //   const currentRoute = this.$route.meta.permission[0];
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      this.btnPermission = BtnShow(currentRoute)
      if (this.hasPermission('delete')) {
        this.columns.push({
          width: 100,
          align: 'center',
          title: '操作',
          scopedSlots: {
            customRender: 'action'
          }
        })
      }
      userDistRange().then(res => {
        // console.info('res-date---',res)
        this.distList = res.data
      })
    },
    filterOption(input, option) {
      // console.log(input);
      if (input) {}
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
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
    // 选择经销商
    handleDist(val) {
      this.queryParam.distCode = val
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
      const _that = this
      const callback = function() {
        _that.isAdd = false
        console.log('销毁')
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/more/basicInfo/HostProcurement#detail')
      window.addEventListener('popstate', callback)

      if (val) {
        this.tabletInfo = val
      } else {
        this.tabletInfo = []
      }
      this.isAdd = true
    },

    deleHostData(record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.distName + '】代理？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id
          }
          deleHostProcurement(params).then(res => {
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
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'HostProcurement') {
        this.getFirstLoad()
      }
    }
  }
}
</script>

<style lang="less">
// 表格操作样式
.ant-table-tbody {
  .icon-tableMore {
    color: #939393;
  }
}
.ant-table-thead tr th {
  min-width: 100px;
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
.tabBtn {
  .iconfont {
    font-size: 28px;
    color: rgba(196, 196, 196, 1);
  }
  &:hover {
    .iconfont {
      color: rgba(62, 77, 168, 1);
    }
  }
}
</style>
