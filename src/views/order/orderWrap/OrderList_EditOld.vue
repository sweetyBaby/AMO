<template>
  <a-card :bordered="false">
    <a-spin tip="文件保存中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>新增订单产品</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="hancleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top" v-model="isAddShow">
                <template slot="title">
                  <span>新增产品</span>
                </template>
                <i class="iconfont icon-plus"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSave()">
              <a-tooltip placement="top" v-model="isSaveShow">
                <template slot="title">
                  <span>保存产品</span>
                </template>
                <i class="iconfont icon-save"/>
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <!--    <a-table-->
    <!--        :locale="{ emptyText: emptyText }"-->
    <!--        ref="table"-->
    <!--        size="default"-->
    <!--        rowKey="rowkey"-->
    <!--        :columns="columns"-->
    <!--        :dataSource="data"-->
    <!--        :pagination="false"-->
    <!--    >-->
    <!--        <span slot="action" slot-scope="text, record">-->
    <!--          <template>-->
    <!--            <div>-->
    <!--              <a-popover placement="bottomRight" overlayClassName="tableBtn">-->
    <!--                <template slot="content">-->
    <!--                  <a @click="handleEdit(record)">-->
    <!--                    <i class="iconfont icon-table-edit"/>-->
    <!--                    编辑-->
    <!--                  </a>-->
    <!--                  <a @click="handleDel(record)">-->
    <!--                    <i class="iconfont icon-empty"/>-->
    <!--                    删除-->
    <!--                  </a>-->
    <!--                </template>-->
    <!--                <i class="iconfont icon-tableMore"/>-->
    <!--              </a-popover>-->
    <!--            </div>-->
    <!--          </template>-->
    <!--        </span>-->
    <!--    </a-table>-->
    <a-form layout="inline" :form="form">
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle"><span>*</span>经销商名称</label>
            <div class="basicInfo">
              <a-select
                v-if="!isDist"
                showSearch
                style="width: 100%;"
                placeholder="选择经销商"
                v-model="distCode"
                optionFilterProp="children"
                @change="handleDist"
              >
                <a-select-option
                  v-for="item in distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >
                  {{ item.distName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle"><span>*</span>月份</label>
            <div class="basicInfo">
              <a-month-picker
                placeholder="请选择月份"
                style="width: 100%"
                v-model="proWrap.month"
                :format="format"
                :disabledDate="disabledDate"
              ></a-month-picker>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">备注</label>
            <div class="basicInfo">
              <a-input
                placeholder="备注"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.remark"
              >
              </a-input>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="basicBorder newHosSales">
        <div class="newHosTitle">
          <h3><span>*</span>添加产品型号及指标</h3>
          <span class="newPro" @click="handleAdd">
            <a-tooltip placement="top">
              <template slot="title">
                <span>型号选择</span>
              </template>
              <i class="iconfont icon-plus"></i>
            </a-tooltip>

          </span>
        </div>
        <a-row :gutter="24" v-for="(product,index) in proList">
          <a-col span="16">
            <label for class="basicTitle"><span>*</span>型号</label>
            <div class="basicInfo">
              <a-input
                v-model="product.productType"
                placeholder="请选择产品型号"
                :style="{ width:'240px'}"
                :disabled="true"
              ></a-input>
            </div>
            <label for class="basicTitle"><span>*</span>指标</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%" has-feedback>
                <a-input-number
                  v-model="product.quota"
                  placeholder="指标"
                  :style="{ width:'240px'}"
                ></a-input-number>
              </a-form-item>
            </div>
          </a-col>
          <a-col span="8">
            <div class="newProWrap">
              <span class="newPro" @click="handelDel(product)" v-if="index !== 0">
                <i class="iconfont icon-empty"></i>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-drawer
      title="新增产品"
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
import DhEmpty from '@/views/comPublic/DhEmpty'
import moment from 'moment'
import { STable } from '@/components'
import { DataFilter, exportTable, getParamsFromStore } from '@/utils/storage'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'
import { getOrderInfo, saveOrder } from '@/api/depot/order'
import AddNewOrder from './modules/AddNewOrder'

export default {
  name: 'OrderList',
  components: {
    DhEmpty,
    STable,
    AddNewOrder
  },
  created () {
    this.getFirst()
  },
  data () {
    return {
      title: '新增订单',
      loadingSpin: false,
      isAddShow: false,
      isSaveShow: false,
      isEmpty: false,
      isShowSearch: false,
      isAdd: false,
      editData: {},
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
          title: '数量',
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
      data: [],
      type: '01',
      typeList: [
        {
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
      remark: ''
    }
  },
  methods: {
    handleEdit (record) {
      const orderInfo = JSON.parse(getParamsFromStore('ORDERINFO'))
      this.isAdd = true
      this.editData = {
        visible: false,
        distCode: orderInfo.distCode,
        distName: orderInfo.distName,
        type: 'edit',
        ...record
      }
    },
    handleDel (record) {
      const delId = this.data.findIndex(item => item.rowkey === record.rowkey)
      // console.info('delId===', delId)
      this.data.splice(delId, 1)
    },
    handleAdd () {
      const orderInfo = JSON.parse(getParamsFromStore('ORDERINFO'))
      this.isAdd = true
      this.editData = {
        visible: false,
        distCode: orderInfo.distCode,
        distName: orderInfo.distName,
        remark: this.remark,
        type: 'edit'
      }
    },
    handleSave () {
      if (!this.loadingSpin && this.data.length > 0) {
        this.loadingSpin = true
        const orderInfo = JSON.parse(getParamsFromStore('ORDERINFO'))
        const params = {
          distCode: orderInfo.distCode,
          distName: orderInfo.distName,
          remark: this.remark,
          orderDetails: this.data
        }
        // console.info('params===', params)
        saveOrder(params).then(res => {
          if (res.message === 'SUCCESS') {
            this.$notification['success']({
              message: '提示',
              description: '新增成功！',
              duration: 2
            })
            this.loadingSpin = false
            // console.info('res====', res)
            this.$router.push({
              name: 'OrderList'
            })
          } else {
            this.$notification['error']({
              message: '提示',
              description: res.message || '新增失败！',
              duration: 2
            })
          }
        })
      } else if (this.data.length === 0) {
        this.$notification['error']({
          message: '提示',
          description: '还未添加任何数据哦~',
          duration: 2
        })
      } else {
        this.$notification['info']({
          message: '提示',
          description: '数据提交中！',
          duration: 2
        })
      }
    },
    handleModelCancle () {
      this.isAdd = false
      this.editData = {
        visible: false,
      }
    },
    handleModleSub (formdata) {
      const newData = []
      let modify = 0
      let oldData = JSON.parse(JSON.stringify(this.data))
      let checkIndex = -1
      // console.info('formdata===', formdata)
      oldData.map((old, index) => {
        if (old.productModel === formdata.orderDetails[0].productModel && old.degree ===
            formdata.orderDetails[0].degree) {
          if (formdata.orderDetails[0].rowkey && old.rowkey === formdata.orderDetails[0].rowkey) {
            old.qty = formdata.orderDetails[0].qty
          } else if (formdata.orderDetails[0].rowkey && old.rowkey !== formdata.orderDetails[0].rowkey) {
            old.qty = old.qty + formdata.orderDetails[0].qty
            checkIndex = formdata.orderDetails[0].rowkey
          } else {
            old.qty = old.qty + formdata.orderDetails[0].qty
          }
          modify = 1
        }
      })
      // console.info('checkIndex===', checkIndex)
      if (checkIndex !== 0) {
        oldData = oldData.filter(obj => obj.rowkey !== checkIndex)
      }
      if (modify < 1) {
        if (!formdata.orderDetails[0].rowkey) {
          const newInfo = {
            rowkey: formdata.orderDetails[0].productModel + '_' + formdata.orderDetails[0].degree,
            ...formdata.orderDetails[0]
          }
          this.data.push(newInfo)
        } else {
          this.data.map(old => {
            if (old.rowkey === formdata.orderDetails[0].rowkey) {
              newData.push(formdata.orderDetails[0])
            } else {
              newData.push(old)
            }
          })
          this.data = newData
        }
      } else {
        this.data = oldData
      }
      // console.info('this.data====', this.data)
      this.remark = formdata.orderDetails[0].remark
      this.isAdd = false
      this.editData = {
        visible: false,
      }
    },
    hancleBack () {
      this.$router.push({
        name: 'OrderList'
      })
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
      const orderList = JSON.parse(getParamsFromStore('ORDERINFO'))
      // console.info('orderList===', orderList.orderDetails)
      this.remark = orderList.remark
      this.data = orderList.orderDetails.map((item, index) => {
        return {
          rowkey: 'order' + index,
          ...item
        }
      })
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'OrderList_Edit') {
        this.getFirst()
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

  .tableBtn {
    :global {
      .ant-popover-content {
        padding: 0;
        min-width: 160px;
        a {
          width: 100%;
          padding: 0 0 0 32px;
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

  .orderInfo {
    padding: 24px 0 0 0;
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
</style>
