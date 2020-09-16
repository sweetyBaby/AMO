<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>产品SN查询</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加产品SN</span>
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
              <label for>产品序列号</label>
              <a-input placeholder="输入产品序列号" style="width: 100%" v-model="queryParam.udi" />
            </div>
            <div class="searchList">
              <label for>产品型号</label>
              <!--              <a-input placeholder="输入产品型号" style="width: 100%" v-model="queryParam.productModel" />-->
              <a-select
                showSearch
                style="width: 100%;"
                placeholder="选择产品型号"
                v-model="queryParam.productModel"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option v-for="item in modelList" :key="item.productModel" :value="item.productModel">{{ item.productModel }}</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="getTableList()" size="small">查询</a-button>
            <a-button
              style="margin-left: 8px"
              size="small"
              @click="() => queryParam = { page:0,size:10 }"
            >重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <a-table
        :columns="columns"
        :dataSource="tableDatas"
        :locale="{emptyText:emptyText}"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="tableDatas => tableDatas.id"
      >
        <template slot="udi" slot-scope="udi">
          <a-tooltip placement="top" :title="udi">
            <span class="serialWrap">{{ udi }}</span>
          </a-tooltip>
        </template>
        <span slot="action" slot-scope="text, record" class="action_btn">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <a href="javascript:;" @click="handleAdd(record)" v-if="hasPermission('edit')">
                <i class="iconfont icon-table-edit" />编辑
              </a>
              <a href="javascript:;" @click="deleSNdata(record)" v-if="hasPermission('delete')">
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
  </a-card>
  <a-card v-else :bordered="false">
    <add-product-s-n :productSNdata="productSNdata" @handleNewSN="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { Icon } from 'ant-design-vue'
import { reserveSNTable, deleSNData, getModelAndName } from '@/api/basicInfo/hosData'
import notification from 'ant-design-vue/es/notification'
import AddProductSN from './modules/AddProductSN'
import { BtnShow } from '@/utils/storage'

export default {
  name: 'ProductSN',
  // create生命周期只加载一次
  created() {
    this.getTableList()
    this.getFirstLoad()
  },
  components: {
    AddProductSN,
    DhEmpty
  },
  data() {
    return {
      emptyText: <dh-empty />,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`,
      },
      loading: true,
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      columns: [
        {
          width: 103,
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel'
        },
        {
          width: 103,
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName'
        },
        {
          width: 100,
          title: '产品分类',
          dataIndex: 'productCategory',
          key: 'productCategory'
        },
        {
          width: 100,
          title: '度数',
          dataIndex: 'degree',
          key: 'degree'
        },
        {
          width: 100,
          title: '中文名称',
          dataIndex: 'productNameCn',
          key: 'productNameCn'
        },
        {
          width: 100,
          title: '批号',
          dataIndex: 'productBatch',
          key: 'productBatch'
        },
        {
          width: 100,
          title: '注册证号',
          dataIndex: 'registration',
          key: 'registration'
        },
        {
          width: 100,
          title: '产品序列号',
          dataIndex: 'udi',
          key: 'udi',
          scopedSlots: {
            customRender: 'udi'
          }
        },
        {
          width: 100,
          title: '产品生产日期',
          dataIndex: 'effectiveDateBegin',
          key: 'effectiveDateBegin'
        },
        {
          width: 100,
          title: '产品有效日期',
          dataIndex: 'effectiveDateEnd',
          key: 'effectiveDateEnd'
        }
      ],
      isAdd: false,
      modelList: [],
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10,
        serialNumber: '',
        productModel: undefined
      },
      btnPermission: []
    }
  },
  methods: {
    // 分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
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
      reserveSNTable(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.tableDatas = res.data.list
          this.pagination = pagination
        }
        this.loading = false
      })
      document.body.scrollTop = 0
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
      getModelAndName(params).then(res => {
        // console.info('res---',res)
        this.modelList = res.data.list
      })
    },
    filterOption(input, option) {
      // console.log(input);
      if (input) {}
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
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
      const _that = this
      const callback = function() {
        _that.isAdd = false
        console.log('销毁')
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/more/basicInfo/ProductSN#detail')
      window.addEventListener('popstate', callback)
      if (val) {
        this.productSNdata = val
      } else {
        this.productSNdata = []
      }
      this.isAdd = true
    },

    deleSNdata(record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.productName + '】数据？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id
          }
          deleSNData(params).then(res => {
            if (res.message === 'SUCCESS') {
              this.getTableList()
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
  }
}
</script>

<style lang="less">
// 表格操作固定样式
.ant-table-fixed {
  .ant-table-thead {
    tr {
      height: 54.8px;
    }
  }
  .ant-table-tbody {
    tr {
      min-height: 58px;
      .icon-tableMore {
        color: #939393;
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
.serialWrap {
  max-width: 140px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
