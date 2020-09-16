<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>产品度数对应表</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加产品度数</span>
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
              <label for>产品型号</label>
              <a-input placeholder="输入产品型号" style="width: 100%" v-model="queryParam.productModel" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="getTableList()" size="small">查询</a-button>
            <a-button
              style="margin-left: 8px"
              size="small"
              @click="() => queryParam = {page:0,size:10}"
            >重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <a-table
        ref="table"
        :locale="{emptyText:emptyText}"
        :columns="columns"
        :dataSource="tableDatas"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="tableDatas => tableDatas.id"
      >
        <span slot="action" slot-scope="text, record" class="action_btn">
          <!-- <a-popconfirm placement="bottomRight">
                        <template slot="title">
                            <a href="javascript:;" @click="deleSNdata(record)">
                                <i class="iconfont icon-tableEmpty" />删除</a>
                            <a href="javascript:;" @click="handleAdd(record)">
                                <i class="iconfont icon-tableEmpty" />编辑</a>
                        </template>
          </a-popconfirm>-->
          <!-- <a-button size="small" type="default" @click="changeState(record.id)">
          {{ record.status === 0 ?  '启用' : '禁用' }}</a-button>-->
          <a-switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            :defaultChecked="record.status===0?true:false"
            @change="changeState(record)"
          />
        </span>
      </a-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <add-product-degree :productSNdata="productSNdata" @handleNewSN="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { Icon } from 'ant-design-vue'
import { retiveDegreeTable, enableOrDisable } from '@/api/basicInfo/hosData'
import notification from 'ant-design-vue/es/notification'
import AddProductDegree from './modules/AddProductDegree'

const columns = [
  {
    title: '产品型号',
    dataIndex: 'productModel',
    key: 'productModel'
  },
  // {
  //     title: '批号',
  //     dataIndex: 'productBatch',
  //     key: 'productBatch'
  // },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    title: '产品分类',
    dataIndex: 'productCategory',
    key: 'productCategory'
  },
  {
    title: '度数',
    dataIndex: 'degree',
    key: 'degree'
  },
  {
    title: '中文名称',
    dataIndex: 'productNameCn',
    key: 'productNameCn'
  },
  {
    title: '操作',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'ProductDegree',
  // create生命周期只加载一次
  created() {
    this.getTableList()
  },
  components: {
    AddProductDegree,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty/>,
      pagination: {},
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
        size: 10,
        productModel: ''
      }
    }
  },

  methods: {
    // 分页
    handleTableChange(pagination) {
      const pager = {
        ...this.pagination
      }
      // console.log(this.pagination);
      // console.log(pager);
      pager.current = pagination.current
      this.pagination = pager
      //   this.queryParam = {
      //     page: pagination.current,
      //     size: pagination.pageSize
      //   };
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getTableList(this.queryParam)
    },

    changeState(record) {
      const params = {
        id: record.id,
        status: record.status
      }
      enableOrDisable(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.getTableList()
        }
      })
    },

    getTableList() {
      this.loading = true
      this.isShowSearch = false
      retiveDegreeTable(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          const pagination = {
            ...this.pagination
          }
          pagination.total = res.data.total
          this.tableDatas = res.data.list
          this.pagination = pagination
        }
        this.loading = false
      })
      if (this.$refs.table) {
        document.getElementsByClassName('ant-table-body')[0].scrollTop = 0
      }
    },

    handleSearch() {
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
      if (val) {
        this.productSNdata = val
      } else {
        this.productSNdata = []
      }
      this.isAdd = true
    }

    // deleSNdata(record) {
    //     this.$confirm({
    //         title: '删除确认',
    //         content: '是否确定删除【' + record.productName + '】医院主数据？',
    //         okText: '确定',
    //         cancelText: '取消',
    //         onOk: () => {
    //             const params = {
    //                 id: record.id
    //             }
    //             deleSNData(params).then(res => {
    //                 if (res.message === 'SUCCESS') {
    //                     this.getTableList();
    //                 } else {
    //                     notification.error({
    //                         message: '错误',
    //                         description: '删除失败！'
    //                     })
    //                 }
    //             })
    //         }
    //     })

    // },
  }
}
</script>

<style lang="less">
/* 操作框中选择框的样式 */
.action_btn {
  .ant-switch-checked {
    background: #3e4da8;
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
