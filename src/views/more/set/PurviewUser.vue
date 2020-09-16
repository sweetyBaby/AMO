<template>
  <a-card :bordered="false" v-if="isNewUser === false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>用户管理</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <!-- <span class="titleBtn" @click="handleAdd">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新增</span>
                </template>
                <i class="iconfont icon-plus"></i>
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
    <!-- <div class="table-page-search-wrapper search-border">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="16" :sm="24" :span="6">
            <a-input v-model="queryParam.code" placeholder="请输入姓名/ID号/用户名" style="width: 260px">
              <i class="iconfont icon-search" slot="prefix" />
            </a-input>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" style="text-align:right">
              <a-button type="primary" @click="$refs.table.refresh(true)" size="small">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>-->
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
            <label for>机构名称</label>
            <a-input placeholder="输入机构名称" style="width: 100%" v-model="queryParam.sysOrgName" />
          </div>
          <div class="searchList">
            <label for>用户名</label>
            <a-input placeholder="输入用户名" style="width: 100%" v-model="queryParam.userName" />
          </div>

          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
          </span>
        </div>
      </a-form>
    </a-drawer>
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :locale="{emptyText:emptyText}"
    >
      <span slot="status" slot-scope="text">
        <status-badage :status="text" :status-map="statusMap" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <!-- <a href="javascript:;" @click="handleDelete(record)">
                <i class="iconfont icon-tableEmpty" />删除
              </a>-->
              <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-table-edit" />编辑
              </a>
              <a href="javascript:;" @click="handleUnUse(record)">
                <i class="iconfont icontable-unuser" v-if="record.systemStatus==0" />
                <i class="iconfont icontable-user" v-else />
                {{ record.systemStatus==0 ? '禁用' : '启用' }}
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px;;color:#c4c4c4" />
            </span>
          </a-popover>
          <!-- <div class="align-right">
            <a-button size="small" @click="handleAdd(record)">编辑</a-button>
            <a-button size="small" @click="handleUnUse(record)">{{ record.status ? '禁用' : '启用' }}</a-button>
            <a-button size="small" @click="handleDelete(record)">删除</a-button>
          </div>-->
        </template>
      </span>
    </s-table>
  </a-card>
  <a-card v-else :bordered="false">
    <purview-user-new @handleBack="handleGoBack" :userData="userData" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { STable, StatusBadage } from '@/components'
import { getUserList, deletUser, useDisable } from '@/api/auth'
import PurviewUserNew from './PurviewUserNew'
import { DataFilter } from '@/utils/storage'
import notification from 'ant-design-vue/es/notification'

export default {
  name: 'PurviewUser',
  components: {
    STable,
    StatusBadage,
    PurviewUserNew,
    DhEmpty
  },
  // mounted () {
  //   console.log('this.$route---', this.$router)
  //   const menuObj = Vue.ls.get(ACCESS_MENU)
  //   const currentKey = this.$router.currentRoute.meta.metaNo
  //   const currentKeyArr = currentKey.split('-')
  //   let menu = null
  //   if (Array.isArray(currentKeyArr)) {
  //     for (let i = 1; i < currentKeyArr.length; i++) {
  //       if (i === 1) {
  //         menu = menuObj.children[currentKeyArr[i]]
  //       } else {
  //         menu = menu.children[currentKeyArr[i]]
  //       }
  //     }
  //   }
  //   // console.log('menu--', menu)
  // },
  data() {
    return {
      emptyText: <dh-empty />,
      isShowSearch: false,
      isNewUser: false,
      queryParam: {
        page: 1,
        size: 10
      },
      statusMap: {
        0: {
          status: 'success',
          text: '启用'
        },
        1: {
          status: 'error',
          text: '禁用'
        }
      },
      userData: [],
      columns: [
        {
          width: 100,
          title: '用户名',
          dataIndex: 'userName',
          align: 'center'
        },
        // {
        //   title: "用户账号",
        //   dataIndex: "sysUserCode",
        //   align: "center"
        // },
        {
          width: 100,
          title: '真实姓名',
          dataIndex: 'nickName',
          align: 'center'
        },
        {
          width: 100,
          title: '所属机构类型',
          dataIndex: 'sysOrgCode',
          align: 'center',
          customRender: text => {
            switch (text) {
              case 'SYS_INNOVAMED':
                return '医迈德'
                break
              case 'AMO':
                return '眼力健'
                break
              case 'CRGD':
                return '华润广东'
                break

              default:
                return '经销商'
                break
            }
          }
        },
        {
          width: 200,
          title: '机构名称',
          dataIndex: 'sysOrgName',
          align: 'center'
        },
        // {
        //   title: "机构code",
        //   dataIndex: "sysOrgCode",
        //   align: "center"
        // },
        {
          width: 100,
          title: '状态',
          dataIndex: 'systemStatus',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          width: 100,
          align: 'center',
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const roleList = DataFilter(res, 'table')
            // this.queryParam.size = res.data.pageSize
            return roleList
          }
        )
      }

    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/settings/permission/PurviewUser') {
        this.isNewUser = false
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
      const _that = this
      const callback = function() {
        _that.isNewUser = false
        console.log('销毁')
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/more/set/PurviewUser#detail')
      window.addEventListener('popstate', callback)
      if (val) {
        // this.userData = {
        //   id: val.id
        // };
        this.userData = val
      } else {
        this.userData = {}
      }
      this.isNewUser = true
    },
    handleGoBack() {
      this.isNewUser = false
    },
    handleEdit(val) {
      console.info(val)
    },
    handleDelete(record) {
      console.info(record)
      const _that = this
      this.$confirm({
        title: '删除弹框',
        content: '确定删除该用户？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          const params = {
            id: record.id
          }
          deletUser(params).then(res => {
            if (res.message === 'SUCCESS') {
              _that.$refs.table.refresh()
            } else {
              notification.error({
                message: '错误',
                description: '删除失败！'
              })
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    handleUnUse(record) {
      const _that = this
      this.$confirm({
        title: '提示弹框',
        content: '确定修改该状态？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let nowStatus = null
          if (record.systemStatus == 0) {
            nowStatus = 1
          } else {
            nowStatus = 0
          }
          const params = {
            sysUserCode: record.sysUserCode,
            status: nowStatus
          }
          console.log(record)
          useDisable(params).then(res => {
            if (res.message === 'SUCCESS') {
              _that.$refs.table.refresh()
            } else {
              notification.error({
                message: '错误',
                description: '修改状态失败！'
              })
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
