<template>
  <a-card :bordered="false">
    <div v-if="!isAddClose">
      <div class="pageTitle">
        <a-row :gutter="48">
          <a-col :md="16" :sm="24">
            <h3>合同管理</h3>
          </a-col>
          <a-col :md="8" :sm="24">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handleAdd()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>新增合同</span>
                  </template>
                  <i class="iconfont icon-plus"/>
                </a-tooltip>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-if="!isEmpty">
        <s-table
          ref="table"
          size="default"
          rowKey="key"
          :columns="columns"
          :data="loadData"
          :pageSize="queryParam.size"
          :locale="{ emptyText: emptyText }"
        >
          <span slot="action" slot-scope="text, record">
            <a-popover placement="bottomRight" overlayClassName="tableBtn">
              <template slot="title">
                <a @click="handleAdd(record)">
                  <i class="iconfont icon-table-edit"></i>编辑
                </a>
                <a @click="handleDel(record)">
                  <i class="iconfont icon-empty"></i>删除
                </a>
              </template>
              <span>
                <i class="iconfont icon-tableMore"></i>
              </span>
            </a-popover>
          </span>
          <!-- 名称超出省略  -->
          <template slot="name" slot-scope="name">
            <a-tooltip placement="top" :title="name">
              <span class="serialName">{{ name }}</span>
            </a-tooltip>
          </template>
        </s-table>
      </div>
    </div>
    <add-contract
      v-if="isAddClose"
      @handleClose="handleClose"
      @handleSubmit="handleSubmit"
      @handleBack="hancleBack"
      :editData="editData"
    >
    </add-contract>
  </a-card>
</template>

<script>
import moment from 'moment'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { DataFilter } from '@/utils/storage'
import { STable } from '@/components'
import { getContract, contractDel } from '@/api/auditManage/auditManage'
import AddContract from './modules/AddContract'

export default {
  name: 'ContractManage',
  components: {
    DhEmpty,
    STable,
    AddContract
  },
  data () {
    return {
      columns: [
        {
          width: 150,
          title: '合同编号',
          dataIndex: 'contractNum',
          key: 'contractNum'
        },
        {
          width: 150,
          title: '经销商',
          dataIndex: 'distName',
          key: 'distName',
        },
        {
          width: 150,
          title: '配送商名称',
          dataIndex: 'distribution',
          key: 'distribution',
        },
        {
          width: 100,
          title: '医院名称',
          dataIndex: 'hosName',
          key: 'hosName'
        },
        {
          width: 150,
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        },
        // {
        //   width: 150,
        //   title: '合同附件',
        //   dataIndex: 'updateBy',
        //   key: 'updateBy'
        // },
        {
          width: 150,
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getContract(Object.assign(this.queryParam, parameter)).then(
          res => {
            const tableList = DataFilter(res, 'contract')
            this.queryParam.size = res.data.pageSize
            return tableList
          }
        )
      },
      isAdd: false,
      isEmpty: false,
      isShowSearch: false,
      queryParam: {
        page: 1,
        size: 10
      },
      emptyText: <dh-empty/>,
      isAddClose: false,
      editData: {}
    }
  },
  methods: {
    moment,
    handleAdd (record) {
      this.isAddClose = true
      if (record) {
        this.editData = {
          ...record,
          title: '编辑合同管理'
        }
      } else {
        this.editData = {
          title: '新增合同管理'
        }
      }
    },
    handleDel (record) {
      const param = {
        id: record.id
      }
      contractDel(param).then(res => {
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '合同删除成功',
            description: '合同删除成功',
            duration: 4
          })
          this.$refs.table.refresh(true)
        } else {
          this.$notification['error']({
            message: '删除失败',
            description: '合同删除失败！',
            duration: 4
          })
        }
      })
    },
    hancleBack () {
      this.isAddClose = false
    },
    isEdit (record) {
      if (
        moment(record.year + '-' + record.month).isAfter(moment().endOf('month')) ||
          (moment(record.month).isSame(moment().format('MM')) && Number(moment().format('DD')) < 16)
      ) {
        return true
      }
      return false
    },
    handleClose () {
      this.isAddClose = false
    },
    handleSubmit (val) {
      this.isAddClose = false
      this.$refs.table.refresh(true)
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handleSearch () {
      this.$refs.table.refresh(true)
      this.isShowSearch = true
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    retriveTable () {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    searchReset () {
      this.queryParam.date = null
    }
  }
}
</script>

<style lang="less" scoped>
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

  .serialName {
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  }

</style>
