<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>我的产品</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <!-- <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>添加我的产品</span>
                </template>
                <i class="iconfont icon-plus" />
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
              <label for>产品型号</label>
              <a-input placeholder="输入产品型号" style="width: 100%" v-model="queryParam.productModel" />
            </div>
            <div class="searchList">
              <label for>产品分类</label>
              <a-input
                placeholder="输入产品分类"
                style="width: 100%"
                v-model="queryParam.productCategory"
              />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable">查询</a-button>
            <a-button
              style="margin-left: 8px"
              size="small"
              @click="() => queryParam = {page:0,size:10}"
            >重置</a-button>
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
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <a
                href="javascript:;"
                @click="handleAdd(record)"
                v-if="hasPermission('edit')"
              >
                <i class="iconfont icon-table-edit" />编辑
              </a>
              <!-- <a href="javascript:;" @click="deleData(record)">
                <i class="iconfont icon-tableEmpty" />删除
              </a>-->
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px;" />
            </span>
          </a-popover>
        </span>
      </s-table>
      <!-- <a-table :columns="columns" :dataSource="tableDatas" :loading="loading">
        <span slot="action" slot-scope="text, record" class="action_btn">
          <a-popconfirm placement="bottomRight">
            <template slot="title">
              <a href="javascript:;" @click="deleSNdata(record)">
                <i class="iconfont icon-tableEmpty" />删除
              </a>
              <a href="javascript:;" @click="handleAdd(record)">
                <i class="iconfont icon-tableEmpty" />编辑
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" />
            </span>
          </a-popconfirm>
        </span>
      </a-table>-->
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <add-my-product :tabletData="tabletInfo" @handleNewSN="handleChange()" />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { userDistRange } from '@/api/depot/wareHouse'
import { Icon } from 'ant-design-vue'
import { retriveCusProducts, deleteCusProducts, retriveCus } from '@/api/information'
import notification from 'ant-design-vue/es/notification'
import AddMyProduct from './modules/AddMyProduct'
import { DataFilter, BtnShow } from '@/utils/storage'
import { STable } from '@/components'

export default {
  name: 'MyProduct',
  // create生命周期只加载一次
  created() {
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
    AddMyProduct,
    STable,
    DhEmpty
  },
  data() {
    return {
      btnPermission: [],
      emptyText: <dh-empty />,
      distList: [],
      loading: true,
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      columns: [
        {
          width: 150,
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel'
        },
        {
          width: 150,
          title: '经销商',
          dataIndex: 'distName',
          key: 'distName'
        },
        {
          width: 150,
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName'
        },
        {
          width: 150,
          title: '产品分类',
          dataIndex: 'productCategory',
          key: 'productCategory'
        },
        // {
        //   width: 150,
        //   title: "中文名称",
        //   dataIndex: "productNameCn",
        //   key: "productNameCn"
        // },
        {
          width: 150,
          title: '自定义型号',
          dataIndex: 'cusProductModel',
          key: 'cusProductModel'
        },
        {
          width: 150,
          title: '自定义名称',
          dataIndex: 'cusProductName',
          key: 'cusProductName'
        }
      ],
      isAdd: false,
      cooperInfo: [], // 点击修改向子级传递参数
      // 查询参数
      queryParam: {
        page: 1,
        size: 10
      },
      loadData: parameter => {
        return retriveCusProducts(
          Object.assign(this.queryParam, parameter)
        ).then(res => {
          const tableList = DataFilter(res, 'table')
          this.queryParam.size = res.data.pageSize
          return tableList
        })
      }
    }
  },
  methods: {
    hasPermission(val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad() {
      //   const currentRoute = this.$route.meta.permission[0];
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      this.btnPermission = BtnShow(currentRoute)
      // console.info("---", this.$route.meta.permission[0]);
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // getTableList() {
    //   this.loading = true;
    //   this.isShowSearch = false;
    //   reserveSNTable(this.queryParam).then(res => {
    //     this.loading = false;
    //     this.tableDatas = res.data.list;
    //   });
    // },
    retriveTable() {
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleSearch() {
      this.isShowSearch = true
    },

    onSearchClose() {
      this.isShowSearch = false
    },

    handleChange() {
      this.isAdd = false
      //   this.getTableList();
    },

    handleAdd(val) {
      const _that = this
      const callback = function() {
        _that.isAdd = false
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(null, null, '/more/information/MyProduct#detail')
      window.addEventListener('popstate', callback)
      if (val) {
        this.tabletInfo = val
      } else {
        this.tabletInfo = []
      }
      this.isAdd = true
    },

    deleData(record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确定删除【' + record.productName + '】产品？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: record.id
          }
          // console.log(record);
          deleteCusProducts(params).then(res => {
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
  }
}
</script>

<style lang="less">
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
//操作样式

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
