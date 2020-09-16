<template>
  <a-card :bordered="false" v-if="isNewRole === false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>角色管理</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新增</span>
                </template>
                <i class="iconfont icon-plus"></i>
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
          <!-- <a-input
            v-model="queryParam.code"
            placeholder="请输入姓名、ID号、用户名"
            style="width: 260px;float: right;"
            class="pageSearch"
          >
            <i class="iconfont icon-search" slot="prefix" />
          </a-input>-->
        </a-col>
      </a-row>
    </div>
    <!--    <div class="table-page-search-wrapper search-border">-->
    <!--      <a-form layout="inline">-->
    <!--        <a-row :gutter="16">-->
    <!--          <a-col :md="16" :sm="24" :span="6">-->
    <!--            <a-input v-model="queryParam.code" placeholder="请输入姓名、ID号、用户名" style="width: 260px"  >-->
    <!--              <i class="iconfont icon-search" slot="prefix" />-->
    <!--            </a-input>-->
    <!--          </a-col>-->
    <!--          <a-col :md="8" :sm="24">-->
    <!--            <span class="table-page-search-submitButtons" style="text-align: right">-->
    <!--              <a-button type="primary" @click="$refs.table.refresh(true)" size="small">查询</a-button>-->
    <!--              <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>-->
    <!--            </span>-->
    <!--          </a-col>-->
    <!--        </a-row>-->
    <!--      </a-form>-->
    <!--    </div>-->
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
            <label for>角色名称</label>
            <a-input placeholder="请输入角色名称" style="width: 100%" v-model="queryParam.roleName" />
          </div>
          <div class="searchList">
            <label for>角色描述</label>
            <a-input placeholder="请输入角色描述" style="width: 100%" v-model="queryParam.roleDes" />
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable" size="small">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="() => queryParam = {}">重置</a-button>
          </span>
        </div>
      </a-form>
    </a-drawer>
    <s-table ref="table" size="default" rowKey="key" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <template>
          <div class="align-right">
            <a-button size="small" @click="handleAdd(record)">编辑</a-button>
            <a-button size="small" type="default" @click="showDeleteConfirm(record)">删除</a-button>
          </div>
        </template>
      </span>
    </s-table>
  </a-card>
  <a-card v-else :bordered="false">
    <role-new @handleBack="handleGoBack" :roleData="roleDataEdit" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getRoleData } from '@/api/manage'
import { getMenuRole, getRoleNewList, deleteMenuList } from '@/api/storage'
import { DataFilter } from '@/utils/storage'
import RoleNew from './RoleNew'
export default {
  name: 'RoleManage',
  components: {
    STable,
    RoleNew
  },
  data() {
    return {
      isShowSearch: false,
      isNewRole: false,
      queryParam: {
        page: 1,
        size: 10
      },
      roleDataEdit: {},
      statusMap: {
        0: {
          status: 'success',
          text: '已启用'
        },
        1: {
          status: 'error',
          text: '已禁用'
        }
      },
      columns: [
        {
          title: '角色名称',
          dataIndex: 'roleName',
          align: 'center',
          width: '20%'
        },
        {
          title: '角色描述',
          dataIndex: 'roleDes',
          align: 'center',
          width: '20%'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD  HH:ss')
          },
          width: '20%'
        },
        {
          title: '创建人',
          dataIndex: 'createBy',
          align: 'center',
          width: '20%'

        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          width: '20%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: '150px'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('loadData.parameter', parameter)
        return getRoleNewList(Object.assign(parameter, this.queryParam)).then(
          res => {
            console.info(res)
            const roleList = DataFilter(res, 'role')
            return roleList
          }
        )
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/roleManage') {
        this.isNewRole = false
      }
    }
  },
  methods: {
    retriveTable() {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    onSearchClose() {
      this.isShowSearch = false
    },
    handleSearch() {
      this.isShowSearch = true
    },

    handleAdd(val) {
      console.info(val)
      if (val) {
        this.roleDataEdit = val
      }
      this.isNewRole = true
    },
    handleGoBack() {
      this.isNewRole = false
    },
    handleEdit(val) {
      console.info(val)
    },
    showConfirm() {
      this.$confirm({
        title: '提示',
        content: '该角色已被使用，不可禁用！',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {}
      })
    },
    showDeleteConfirm(val) {
      const _that = this
      this.$confirm({
        title: '删除弹框',
        content: '确定删除该角色？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // console.log('OK',val);
          const params = {
            id: val.id
          }
          deleteMenuList(params).then(res => {
            if (res.message === 'SUCCESS') {
              console.info('res----', res)
              _that.$refs.table.refresh()
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less">
// .align-right {
//   text-align: right;
//   button {
//     margin: 0 0 0 8px;
//     font-size: 14px;
//     color: rgba(139, 174, 222, 1);
//     line-height: 19px;
//     background: rgba(244, 247, 252, 1);
//     border: none;
//     &:hover {
//       background: rgba(17, 137, 249, 1);
//       color: white;
//     }
//   }
// }
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
