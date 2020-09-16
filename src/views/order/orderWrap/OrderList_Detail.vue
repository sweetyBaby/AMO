<template>
  <a-card :bordered="false">
    <a-spin tip="文件导出中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>订单发货明细</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="hancleBack()">
              <a-tooltip placement="top" v-model="isBackShow">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <!--    <h3>订单详情</h3>-->
    <a-table
      :locale="{ emptyText: emptyText }"
      ref="table"
      size="default"
      rowKey="productModel-degree"
      :columns="columns"
      :dataSource="loadData"
      :pagination="false"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <div>
            <a-popover placement="bottomRight" overlayClassName="tableBtn">
              <template slot="content">
                <a @click="handleDetails(record)">
                  <i class="iconfont icon-detail"/>
                  SN明细
                </a>
              </template>
              <i class="iconfont icon-tableMore"/>
            </a-popover>
          </div>
        </template>
      </span>
    </a-table>
    <!--    <h3 class="orderInfo">订单额外产品详情</h3>-->
    <!--    <a-table-->
    <!--        :locale="{ emptyText: emptyText }"-->
    <!--        ref="table"-->
    <!--        size="default"-->
    <!--        rowKey="productModel"-->
    <!--        :columns="columnsExcept"-->
    <!--        :dataSource="loadDataExcept"-->
    <!--        :pagination="false"-->
    <!--    >-->
    <!--        <span slot="action" slot-scope="text, record">-->
    <!--          <template>-->
    <!--            <div>-->
    <!--              <a-popover placement="bottomRight" overlayClassName="tableBtn">-->
    <!--                <template slot="content">-->
    <!--                  <a @click="handleDetails(record)">-->
    <!--                    <i class="iconfont icon-detail"/>-->
    <!--                    产品详情-->
    <!--                  </a>-->
    <!--                </template>-->
    <!--                <i class="iconfont icon-tableMore"/>-->
    <!--              </a-popover>-->
    <!--            </div>-->
    <!--          </template>-->
    <!--        </span>-->
    <!--    </a-table>-->

    <sn-list
      v-if="isShowInfo"
      :data="InfoId"
      @cancel="handleCancle"
    />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import moment from 'moment'
import { STable } from '@/components'
import { DataFilter, exportTable, getParamsFromStore } from '@/utils/storage'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'
import { getOrderInfo } from '@/api/depot/order'
import SnList from './modules/SnList'

export default {
  name: 'OrderList',
  components: {
    DhEmpty,
    STable,
    SnList
  },
  created () {
    this.getFirst()
  },
  data () {
    return {
      title: '新增订单',
      loadingSpin: false,
      isAddShow: false,
      isEmpty: false,
      isShowSearch: false,
      queryParam: {
        page: 1,
        size: 10
      },
      distList: [],
      isDocData: null,
      dateFormat: 'YYYY-MM-DD HH:mm',
      emptyText: <dh-empty/>,
      columns: [
        {
          title: '发货单号',
          dataIndex: 'srcOrderNo',
          width: 180
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: 200
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          width: 120,
          scopedSlots: { customRender: 'cusName' }
        },
        {
          title: '度数',
          dataIndex: 'degree',
          width: 100
        },
        {
          title: '数量',
          dataIndex: 'qty',
          width: 120
        },
        {
          title: '已发数量',
          dataIndex: 'srcQty',
          width: 120
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 120
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 100
        }
      ],
      columnsExcept: [
        {
          title: '发货单号',
          dataIndex: 'srcOrderNo',
          width: 240
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: 200
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          width: 180,
          scopedSlots: { customRender: 'cusName' }
        },
        {
          title: '度数',
          dataIndex: 'degree',
          width: 100
        },
        {
          title: '已发数量',
          dataIndex: 'qty',
          width: 160
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 100
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      loadDataExcept: [],
      type: '01',
      typeList: [{
        typeCode: '01',
        typeName: '全部'
      }, {
        typeCode: '02',
        typeName: '未发货'
      }, {
        typeCode: '03',
        typeName: '部分发货'
      }, {
        typeCode: '04',
        typeName: '已发货'
      }, {
        typeCode: '05',
        typeName: '已确认'
      }, {
        typeCode: '06',
        typeName: '已取消'
      }],
      isShowInfo: false,
      InfoId: {
        visible: false
      },
      isBackShow: false
    }
  },
  methods: {
    handleDetails (record) {
      this.InfoId = {
        visible: true,
        orderNo: record.orderNo,
        productModel: record.productModel,
        degree: record.degree
      }
      this.isShowInfo = true
    },
    handleCancle () {
      this.isShowInfo = false
      this.InfoId = {
        visible: false
      }
    },
    hancleBack () {
      this.$router.push({
        name: 'OrderList'
      })
      this.isBackShow = false
      this.queryParam.orderNo = ''
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
        docNo: '',
        cusName: '',
        docDateStart: null,
        docDateEnd: null,
        distCode: undefined
      }
    },
    handleExport () {
      // console.info('====', this.loadingSpin)
      this.loadingSpin = true
      this.$notification['info']({
        message: '提示',
        description: '默认导出近三个月数据，可以通过修改查询日期修改导出数据！',
        duration: 4
      })
      this.queryParam = {
        ...this.queryParam,
        page: undefined,
        size: undefined
      }
      exportTable(
        this.tableList.data,
        this.queryParam,
        '/amo/document/export',
        '入库表'
      ).then(res => {
        this.loadingSpin = false
      })
    },
    handleAdd () {
      const parmas = {
        parentCom: 'OrderList',
        pageTitle: '新增订单'
      }
      this.$router.push({
        name: 'OrderList_Edit',
        params: parmas
      })
      this.isAddShow = false
    },
    handlePicker (date, dateString) {
      // console.info(date)
      this.queryParam.docData = date
      this.isDocData = true
      this.queryParam.docDateStart = moment(date[0]).format('YYYY-MM-DD')
      this.queryParam.docDateEnd = moment(date[1]).format('YYYY-MM-DD')
    },
    handleSizeChange (val) {

    },
    getFirst () {
      const orderInfo = JSON.parse(getParamsFromStore('orderInfoId'))
      // console.info('orderId====', orderInfo)
      this.queryParam.orderNo = orderInfo.orderNo
      getOrderInfo(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.loadData = res.data.commonList ? res.data.commonList : []
          this.loadDataExcept = res.data.exceptList ? res.data.exceptList : []
        }
      })
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'OrderList_Detail') {
        this.getFirst()
      }
    }
  }
}
</script>

<style scoped lang="less">
.typeName{
  padding:0 0 16px 0;
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
.tableBtn{
  :global {
    .ant-popover-content{
      padding: 0;
      min-width:160px;
      a{
        width: 100%;
        /*padding: 8px 0 8px 32px;*/
        padding-left: 32px;
        color: rgba(147, 147, 147, 1);
        display: inline-block;
        box-sizing: border-box;
        line-height: 38px;
        height: 38px;
        .iconfont{
          font-size: 19px;
          color: rgba(147, 147, 147, 1);
          padding: 0 12px 0 0;
        }
        &:hover{
          background: rgba(246, 246, 248, 1);
          color: rgba(21, 58, 175, 1);
          .iconfont{
            color: rgba(21, 58, 175, 1);
          }
        }
      }
    }
  }
}
  .orderInfo{
    padding: 24px 0 0 0;
  }
</style>
