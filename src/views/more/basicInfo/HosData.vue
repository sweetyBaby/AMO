<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>医院主数据查询</h3>
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
              <label for>医院名称</label>
              <a-input placeholder="输入医院名称" style="width: 100%" v-model="queryParam.hosName" />
              <!--            <hos-search @change="hostChange" />-->
            </div>
            <div class="searchList">
              <label for>医院代码</label>
              <a-input placeholder="输入医院代码" style="width: 100%" v-model="queryParam.hosCode" />
            </div>
            <div class="searchList">
              <label for>省份/城市</label>
              <area-select
                v-model="privinceData"
                size="large"
                @change="handleProvince"
                :data="pca"
                v-if="isShowArea"
                type="text"
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
        rowKey="id"
      >
        <span slot="action" slot-scope="text, record">
          <div class="tabBtn" v-if="btnPermission.length !== 0">
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
                <i class="iconfont icon-tableMore" style="font-size:28px" />
              </span>
            </a-popover>
          </div>
        </span>
      </a-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <div class="proNew">
      <add-host-basic :hostData="hostInfo" @handleNewPro="handleChange()" />
    </div>
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import notification from 'ant-design-vue/es/notification'
import { AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
import { Icon } from 'ant-design-vue'
import { retriveHosData, deleHosData } from '@/api/basicInfo/hosData'
import AddHostBasic from './modules/AddHostBasic'
import { BtnShow } from '@/utils/storage'
import HosSearch from '@/views/comPublic/HosSearch'

export default {
  name: 'HosData',
  // create生命周期只加载一次
  created() {
    this.getTableList()
    this.getFirstLoad()
  },
  components: {
    AddHostBasic,
    AreaSelect,
    DhEmpty,
    BtnShow,
    HosSearch
  },
  data() {
    return {
      emptyText: <dh-empty />,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      isShowArea: true, // 判断省市联动是否显示
      pca,
      pcaa,
      privinceData: [],
      loading: true,
      tableDatas: [],
      isShowSearch: false,
      isEmpty: false,
      columns: [
        {
          width: 115,
          title: '医院名称',
          key: 'hosName',
          dataIndex: 'hosName'
        },
        {
          width: 115,
          title: '医院代码',
          key: 'hosCode',
          dataIndex: 'hosCode'
        },
        {
          width: 115,
          title: '医院类型',
          key: 'hosCategoryName',
          dataIndex: 'hosCategoryName'
        },
        {
          width: 100,
          title: '医院性质',
          key: 'hosTypeName',
          dataIndex: 'hosTypeName'
        },
        {
          width: 130,
          title: '省份',
          key: 'province',
          dataIndex: 'province'
        },
        {
          width: 130,
          title: '城市',
          key: 'city',
          dataIndex: 'city'
        },
        {
          width: 130,
          title: '地址',
          key: 'detail',
          dataIndex: 'detail'
        },
        {
          width: 100,
          title: '地区',
          key: 'regionName',
          dataIndex: 'regionName'
        },
        {
          width: 100,
          title: '区域',
          key: 'districtName',
          dataIndex: 'districtName'
        }
      ],
      isAdd: false,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10,
        hosName: '',
        hosCode: '',
        province: '',
        city: ''
      },
      btnPermission: []
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
      const t = setTimeout(() => {
        this.isShowArea = true
      }, 0)
    },
    // 分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getTableList()
    },
    // 表格查询接口
    getTableList() {
      this.loading = true
      this.isShowSearch = false
      retriveHosData(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.tableDatas = res.data.list
          this.pagination = {
            ...this.pagination,
            total: res.data.total
          }
        }
        this.loading = false
      })
      document.body.scrollTop = 0
    },
    // 判断是否有权限
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad() {
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
    // 省份的选择
    handleProvince(val) {
      console.log(val)
      this.queryParam.province = val[0]
      this.queryParam.city = val[1]
    },

    // 传给子组件的方法，展示table页面
    handleChange() {
      this.isAdd = false
      this.getTableList()
    },

    // 编辑变法
    handleAdd(val) {
      const _that = this
      const callback = function() {
        _that.isAdd = false
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/more/basicInfo/HosData#detail')
      window.addEventListener('popstate', callback)
      if (val) {
        this.hostInfo = val
      } else {
        this.hostInfo = []
      }
      this.isAdd = true
    },

    // 切换医院名称
    hostChange(val) {
      console.info('val=====', val)
    },
    // 展开模糊搜索
    handleSearch() {
      this.privinceData = []
      this.isShowArea = true
      this.isShowSearch = true
    },

    onSearchClose() {
      this.isShowSearch = false
    },

    deleHostData(record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.hosName + '】医院主数据？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id,
            hosCode: record.hosCode
          }
          deleHosData(params).then(res => {
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
  },

  watch: {
    $route(to, from) {
      if (to.name === 'HosData') {
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
    font-size: 28px;
  }
}
.ant-table-thead tr th {
  min-width: 100px;
}
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
      width: 88%;
      padding: 0 12px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
// .ant-popover-inner {
//   width: 160px;

//   .ant-popover-inner-content {
//     padding: 0px;

//     .ant-popover-buttons {
//       display: none !important;
//     }

//     .ant-popover-message {
//       padding: 0px;

//       .anticon {
//         display: none !important;
//       }

//       .ant-popover-message-title {
//         padding: 0px;
//       }

//       .ant-popover-message-title {
//         a {
//           display: block;
//           height: 38px;
//           line-height: 38px;
//           padding-left: 31px;
//           color: #939393;

//           i {
//             margin-right: 12px;
//           }
//         }

//         a:hover {
//           color: #153aaf;
//           background: rgba(246, 246, 248, 1);
//         }
//       }
//     }
//   }
// }

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
/* 高级搜索的样式 */
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
