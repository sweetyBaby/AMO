<template>
  <a-card :bordered="false">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>订单列表</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top" v-model="isAddShow">
                <template slot="title">
                  <span>新增订单</span>
                </template>
                <i class="iconfont icon-plus"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search"/>
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
              <label for="">选择经销商</label>
              <a-select
                showSearch
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="queryParam.distCode"
                optionFilterProp="children"
              >
                <a-select-option v-for="item in distList" :key="item.distCode" :value="item.distCode">{{ item.distName
                }}
                </a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for="">订单号</label>
              <a-input v-model="queryParam.orderNo" placeholder="输入单据号" style="width: 100%;"/>
            </div>
            <div class="searchList">
              <label for="">是否确认收货</label>
              <a-select
                showSearch
                style="width: 100%;"
                placeholder="是否确认收货"
                v-model="queryParam.confirm"
                optionFilterProp="children"
              >
                <a-select-option v-for="item in confirmList" :key="item.code" :value="item.code">{{ item.type }}
                </a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for="">订单日期</label>
              <a-range-picker
                @change="handlePicker"
                :value="isDocData ? [moment(queryParam.startDate, dateFormat), moment(queryParam.endDate, dateFormat)] : null"
                :format="dateFormat"
              ></a-range-picker>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="handleSearchR" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
          </span>

        </a-form>
      </a-drawer>
      <div class="typeName">
        <a-radio-group :value="type" @change="handleSizeChange">
          <a-radio-button v-for="item in typeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeName }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <s-table
        :locale="{ emptyText: emptyText }"
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :pageNum="queryParam.page"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-left">
              <div class="tabBtn">
                <a-popover placement="bottomRight" overlayClassName="tableBtn">
                  <template slot="content">
                    <a @click="handleDetails(record)">
                      <i class="iconfont icon-detail"/>
                      产品详情
                    </a>
                    <a @click="handleCancle(record)" v-if="record.status === '-1' || record.status === '0'">
                      <i class="iconfont icon-table-edit"/>
                      取消订单
                    </a>
                    <!-- <a @click="handleConfirm(record)" v-if="(record.status ==='3' || record.status ==='4') && record.confirm !== '1'"> -->
                    <a @click="handleConfirm(record)" v-if="record.status !=='99' && record.confirm !== '1'">
                      <i class="iconfont icon-save"/>
                      确认收货
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore"/>
                </a-popover>
              </div>
            </div>
          </template>
        </span>
        <!-- 名称超出省略  -->
        <template slot="name" slot-scope="name">
          <a-tooltip placement="top" :title="name">
            <span class="serialName">{{ name }}</span>
          </a-tooltip>
        </template>
      </s-table>
    </div>
    <a-drawer
      title="新增订单"
      placement="right"
      @close="handleModelCancle"
      :visible="isAdd"
      wrapClassName="searchWrap"
      width="480"
    >
      <add-new-order
        v-if="isAdd"
        :editData="editData"
        @cancel="handleModelCancle"
        @submit="handleModleSub"
      >
      </add-new-order>
    </a-drawer>

  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import moment from 'moment'
import { STable } from '@/components'
import { DataFilter, exportTable, saveParamsFromStore, exportTabList } from '@/utils/storage'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'
import { getOrderList, OrderCancle, OrderConfirm } from '@/api/depot/order'
import AddNewOrder from './modules/AddNewOrder'
import OrderListEdit from './OrderList_Edit'

export default {
  name: 'OrderList',
  components: {
    DhEmpty,
    STable,
    AddNewOrder,
    OrderListEdit
  },
  created () {
    this.getFirst()
  },
  data () {
    return {
      loadingSpin: false,
      isAddShow: false,
      isEmpty: false,
      isShowSearch: false,
      isAdd: false,
      editData: {},
      queryParam: {
        page: 1,
        size: 10,
        startDate: moment().startOf('day').subtract(3, 'month').format('YYYY-MM-DD'),
        endDate: moment().startOf('day').format('YYYY-MM-DD'),
      },
      distList: [],
      isDocData: true,
      dateFormat: 'YYYY-MM-DD',
      emptyText: <dh-empty/>,
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderNo',
          width: 200
        },
        {
          title: '经销商名称',
          dataIndex: 'distName',
          width: 180,
          scopedSlots: { customRender: 'cusName' }
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          customRender: (text) => {
            switch (text) {
              case '3':
                return '部分发货'
                break
              case '4':
                return '已发货'
                break
              case '99':
                return '已取消'
                break
              default:
                return '未发货'
                break
            }
          },
          width: 100
        },
        {
          title: '收货状态',
          dataIndex: 'confirm',
          customRender: (text) => {
            return text === '1' ? '已收货' : '未收货'
          },
          width: 100
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          },
          width: 140
        },
        {
          title: '操作人',
          dataIndex: 'createUser',
          width: 120
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 120,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 100
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOrderList(Object.assign(this.queryParam, parameter)).then(res => {
          const orderList = DataFilter(res, 'order')
          this.tableList = orderList
          this.queryParam.size = res.data.pageSize
          return orderList
        })
      },
      type: 'all',
      typeList: [
        {
          typeCode: 'all',
          typeName: '全部'
        }, {
          typeCode: '2',
          typeName: '未发货'
        }, {
          typeCode: '3',
          typeName: '部分发货'
        }, {
          typeCode: '4',
          typeName: '已发货'
        }, {
          typeCode: '99',
          typeName: '已取消'
        }],
      confirmList: [
        {
          code: 0,
          type: '未收货'
        }, {
          code: 1,
          type: '已收货'
        }]
    }
  },
  methods: {
    moment,
    getFirst () {
      userDistRange().then(res => {
        this.distList = res.data
      })
    },
    handleExport () {
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/order/export',
          '订单报表'
        ).then(res => {
          this.loadingSpin = false
        })
      }
    },
    isTimeOut (record) {
      // console.info('========', moment().diff(moment(record.createTime),'minutes'))
      return moment().diff(moment(record.createTime), 'minutes') > 30
    },
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handleSearchR () {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    handleReset () {
      this.isDocData = false
      this.queryParam = {
        ...this.queryParam,
        distCode: undefined,
        orderNo: '',
        confirm: undefined,
        docDateEnd: null,
        startDate: null,
        endDate: null
      }
    },

    handleAdd () {
      this.$router.push({
        name: 'OrderList_Edit'
      })
      this.isAddShow = false
    },
    handleModelCancle () {
      this.isAdd = false
      this.editData = {
        visible: false
      }
    },
    handleModleSub (val) {
      this.isAdd = false
      this.editData = {
        visible: false,
      }
      this.$router.push({
        name: 'OrderList_Edit'
      })
    },
    handleDetails (record) {
      const order = {
        orderNo: record.orderNo,
        title: '订单产品明细'
      }
      saveParamsFromStore(JSON.stringify(order), 'orderInfoId')
      this.$router.push({
        name: 'OrderList_Detail'
      })
    },
    handleCancle (record) {
      const _that = this
      this.$confirm({
        title: '确定取消该订单?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _that.handleCancleSub(record)
        },
        onCancel () {
          console.log('Cancel')
        },
      })
    },
    handleCancleSub (record) {
      // console.info('record===', record)
      OrderCancle({ id: record.id }).then(res => {
        if (res.message === 'SUCCESS') {
          this.$refs.table.refresh(true)
        } else {
          this.$notification['error']({
            message: '提示',
            description: res.message || '取消订单失败！',
            duration: 4
          })
        }
      })
    },
    handleConfirm (record) {
      const _that = this
      this.$confirm({
        title: '确认收货?',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _that.handleConfirmSub(record)
        },
        onCancel () {
          console.log('Cancel')
        },
      })
    },
    handleConfirmSub (record) {
      // console.info('record===', record)
    //   OrderConfirm({ id: record.id }).then(res => {
    //     if (res.message === 'SUCCESS') {
    //       this.$refs.table.refresh(true)
    //     } else {
    //       this.$notification['error']({
    //         message: '提示',
    //         description: res.message || '确认收货失败！',
    //         duration: 4
    //       })
    //     }
    //   })
      const data = {
        ...record,
        isFromOrderList: true
      }
      console.log('0914 data=', data)
      this.$router.push({
        name: 'WareHouse',
        params: data
      })
    },
    handlePicker (date) {
      this.isDocData = (date !== null)
      this.queryParam.startDate = moment(date[0]).format(this.dateFormat)
      this.queryParam.endDate = moment(date[1]).format(this.dateFormat)
    },
    handleSizeChange (code) {
      // console.info('this.$refs.table.refresh(true)===', code)
      const newType = code.target.value
      this.type = newType
      if (newType === 'all') {
        this.queryParam.status = undefined
      } else {
        this.queryParam.status = newType
      }
      this.$refs.table.refresh(true)
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'OrderList') {
        this.$refs.table.refresh(true)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .typeName {
    padding: 0 0 16px 0;
  }

  /* 搜索样式 */
  .searchWrap {
    .ant-select-selection--multiple {
      .ant-select-selection__rendered {
        ul {
          li {
            margin-top: 10px;
          }
        }
      }
    }

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

            .ant-calendar-picker {
              width: 100%;
              max-width: none;
            }

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
              line-height: inherit;
            }

            .ant-input-disabled {
              cursor: pointer;
            }

            .ant-calendar-range-picker-separator {
              vertical-align: inherit;
            }

            .ant-form-item-control-wrapper {
              width: 100%;
            }
          }

          .ant-form {
            height: 100%;
            padding: 0 0 60px 0;

            .searchWrap {
              height: 100%;
              overflow-y: auto;

              .ant-form-item {
                width: 100%;
                margin-right: 0;
              }

              .ant-select-selection {
                background: #fff !important;
                border: 1px solid #ececec !important;

                .ant-select-selection__placeholder {
                  // color: #bfbfbf;
                }
              }

              .ant-select-selection--single {
                height: 42px;
                width: 100%;
              }

              .ant-select-selection__rendered {
                line-height: 42px;
              }

              .ant-select-dropdown-menu-item-active {
                background-color: #e6f7ff !important;
              }

              .adInput-input {
                .begin_date {
                  .anticon-calendar {
                    color: #3e4da8;
                  }
                }

                .ant-form-item,
                .ant-form-item-control-wrapper,
                .ant-form-item-control {
                  width: 100%;
                }

                .ant-input {
                  width: 100%;
                  height: 44px;
                  background: rgba(252, 252, 252, 1);
                  border: 1px solid rgba(236, 236, 236, 1);
                  opacity: 1;
                  border-radius: 4px;
                }

                .ant-input-affix-wrapper .ant-input-suffix {
                  .icon-cancle {
                    color: rgba(205, 223, 252, 1);
                    font-size: 24px;
                  }
                }
              }
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
        color: rgba(62, 77, 168, 1) !important
      }
    }
  }

  .tableBtn {
    :global {
      .ant-popover-content {
        padding: 0;
        min-width: 160px;

        a {
          width: 100%;
          padding: 0px 0 8px 32px;
          color: rgba(147, 147, 147, 1);
          display: inline-block;
          box-sizing: border-box;
          height: 38px;
          line-height: 38px;
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
    }
  }
  //上传中
  .uploading {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.65);
    z-index: 99;
    left: 0;
    top: 0;
    .ant-spin-text {
      color: #fff;
      position: relative;
      top: 250px;
    }
    .ant-spin-dot {
      top: 250px;
      i {
        background-color: #fff;
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
