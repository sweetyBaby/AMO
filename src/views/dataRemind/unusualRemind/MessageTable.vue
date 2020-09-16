<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>消息提醒</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="checkAllList()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>将全部消息标记为已读</span>
                </template>
                <i class="iconfont icon-allRead" />
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
              <label for>是否已读</label>
              <!-- <a-input placeholder="输入是否已读" style="width: 100%" v-model="queryParam.distName" /> -->
              <a-select placeholder="请选择消息状态" style="width: 100%" v-model="queryParam.hasCheck">
                <a-select-option value="1">已读</a-select-option>
                <a-select-option value="0">未读</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="retriveTable" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}" size="small">重置</a-button>
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
        <template slot="noticeContent" slot-scope="noticeContent">
          <a-tooltip placement="top" :title="noticeContent.replace(/<br\/>/g, '\n')">
            <span class="serialWrap" v-html="noticeContent"></span>
          </a-tooltip>
        </template>
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record" class="tabBtn">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-detail" />详情
              </a>
              <a href="javascript:;" @click="deleHostData(record)">
                <i class="iconfont icon-messageRead" />标记为已读
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
  <a-card v-else :bordered="false"></a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { STable } from '@/components'
import { deleHostProcurement } from '@/api/basicInfo/hosData'
import moment from 'moment'
import { listMsg, checkMsgByIds, checkAllMsg } from '@api/unusualRemind'
import { DataFilter, BtnShow } from '@/utils/storage'

export default {
  name: 'MessageTable',
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  // create生命周期只加载一次
  created() {
    // this.getFirstLoad();
  },
  components: {
    // AddHostProcurement,
    STable,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty />,
      isShowSearch: false,
      isEmpty: false,
      columns: [
        {
          width: 120,
          title: '类型',
          dataIndex: 'noticeType',
          key: 'noticeType',
          customRender: (text, record) => {
            switch (text) {
              case '1&2&3':
                return '强制入库'
              case '1&2&4':
                return '出入库'
              case '1&2&5':
                return '代报申请'
              case '1&2&6':
                return '拒收申请'
              case '1&2&7':
                return '退货申请'
              case '1&2&8':
                return '账号申请'
              case '1&2&9':
                return '发货提醒'
              case '1&2&10':
                return '污损置换'
              case '1&2&11':
                return '备案效期提醒'
              case '1&2&12':
                return '产品失效提醒'
              case '1&2&13':
                return '华润寄售库调拨提醒'
              case '1&1&1':
                return '即时系统公告'
              case '2&1&2':
                return '定时系统公告'
              default:
                return null
            }
          }
        },
        {
          width: 120,
          title: '内容',
          dataIndex: 'noticeContent',
          key: 'noticeContent',
          scopedSlots: {
            customRender: 'noticeContent'
          }
        },
        {
          width: 120,
          title: '通知时间',
          dataIndex: 'sendTime',
          key: 'sendTime',
          customRender: (text, record) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          width: 120,
          title: '是否已读',
          dataIndex: 'hadRead',
          key: 'hadRead',
          customRender: (text, record) => {
            switch (text) {
              case '0':
                return '未读'
              case '1':
                return '未读'
              case '2':
                return '已读'
              default:
                return null
            }
          }
        },
        {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      isAdd: false,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 0,
        size: 10
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return listMsg(Object.assign(this.queryParam, parameter)).then(res => {
          const tableList = DataFilter(res, 'table')
          this.queryParam.size = res.data.pageSize
          return tableList
        })
      },
      btnPermission: []
    }
  },

  methods: {
    checkAllList() {
      checkAllMsg().then(res => {
        if (res.message === 'SUCCESS') {
          this.$refs.table.refresh(true)
        } else {
          notification.error({
            message: '错误',
            description: '标记失败！'
          })
        }
      })
    },
    // 高级搜索的查询
    retriveTable() {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    // getFirstLoad(){
    //   //  判断按钮
    //   const currentRoute = this.$route.meta.permission[0]
    //   this.btnPermission = BtnShow(currentRoute)
    //   if(this.hasPermission('delete')){
    //     this.columns.push({
    //       width: 100,
    //       align: "center",
    //       title: "操作",
    //       scopedSlots: {
    //         customRender: "action"
    //       }
    //     })
    //   }
    // },
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
      const h = this.$createElement
      const newContent = val.noticeContent.split('<br/>')
      this.$success({
        class: 'noticeStyle',
        title: h('h4', {}, val.noticeTitle),
        content: h(
          'div',
          {},
          newContent.map(item => {
            return h('p', item)
          })
        )
      })
    },

    deleHostData(record) {
      console.log('2')
      this.$confirm({
        title: '确认',
        content: '是否将【' + record.noticeTitle + '】标记为已读？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = [record.id]
          checkMsgByIds(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.$refs.table.refresh(true)
            } else {
              notification.error({
                message: '错误',
                description: '标记失败！'
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
        // this.getFirstLoad();
      }
    }
  }
}
</script>

<style lang="less">
.ant-modal-success {
  .ant-modal-content {
    .ant-modal-confirm-btns {
      .ant-btn {
        width: 100%;
      }
    }
  }
}
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
.noticeStyle{
    .ant-modal-confirm-body{
            padding: 0 16px 0 32px;
    .ant-modal-confirm-content{
        max-height: 320px;
        overflow-y: auto;
        > div{
            padding-right: 10px;
        p{
            margin: 0;
        }
        }
    }
    }
}
.serialWrap {
  max-width: 140px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: -webkit-box;
   text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
