<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3>{{ SNtitle }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSubmit">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>保存</span>
                </template>
                <i class="iconfont icon-save"></i>
              </a-tooltip>
            </span>
            <!-- <span class="titleBtn">
                        <a-tooltip placement="top">
                            <template slot="title">
                                <span>取消</span>
                            </template>
                            <i class="iconfont icon-cancle"></i>
                        </a-tooltip>
            </span>-->
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-form layout="inline" :form="form">
        <a-row :gutter="16">
          <a-col :md="12" :sm="12">
            <div class="proNewBorder">
              <div class="addInput" :class="[!orUpdata?'ban_update':'']">
                <div class="addInput-title">
                  <small class="ban_small" v-if="!orUpdata">不可修改</small>
                  <small v-else>*</small>
                  <span>产品分类</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      :disabled="!orUpdata"
                      v-decorator="['productCategory', { rules: [{ required: true, message: '输入产品分类', whitespace: true }]}]"
                      placeholder="输入产品分类"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput ban_update" :class="[!orUpdata?'ban_update':'']">
                <div class="addInput-title">
                  <small class="ban_small">不可修改</small>
                  <!-- <small v-else>*</small> -->
                  <span>产品名称</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      disabled
                      v-decorator="['productName', { rules: [{ required: true, message: '输入产品名称', whitespace: true }]}]"
                      placeholder="输入产品名称"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <!-- <small>*</small> -->
                  <span>产品失效提醒天数</span>
                  <a-tooltip>
                    <template slot="title">产品失效提醒天数</template>
                    <i class="iconfont icon-question" />
                  </a-tooltip>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['effectiveNotifyDay', { rules: [{ required: false,pattern:/^[0-9]*$/, message: '请输入不小于0的整数!', whitespace: true }]}]"
                      placeholder="请输入产品失效提醒天数"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <!-- <small>*</small> -->
                  <span>自定义名称</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['cusProductName', { rules: [{ required: false, message: '请输入自定义名称！', whitespace: true }]}]"
                      placeholder="请输入自定义名称"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :md="12" :sm="12">
            <div class="proNewBorder">
              <div class="addInput" :class="[!orUpdata?'ban_update':'']">
                <div class="addInput-title">
                  <small class="ban_small" v-if="!orUpdata">不可修改</small>
                  <small v-else>*</small>
                  <span>产品型号</span>
                </div>
                <div class="adInput-input">
                  <div style="margin-bottom: 16px">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-select
                        showSearch
                        placeholder="请选择产品型号"
                        optionFilterProp="children"
                        @change="selectModel"
                        :filterOption="filterOption"
                        :disabled="!orUpdata"
                        v-decorator="['productModel', { rules: [{ required: true, message: '请选择产品型号！', whitespace: true }]}]"
                      >
                        <a-select-option
                          :value="item.productModel"
                          v-for="(item,index) in modelList"
                          :key="index"
                        >{{ item.productModel }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <!-- <small class="ban_small">不可修改</small> -->
                  <span>备注</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <!-- <a-select placeholder="输入中文名称" optionFilterProp="children"
                                        v-decorator="['productNameCn', { rules: [{ required: true, message: '输入中文名称', whitespace: true }]}]">
                                        <a-select-option :value="item" v-for="(item,index) in nameCN" :key="index">
                                            {{item}}
                                        </a-select-option>
                    </a-select>-->
                    <a-input
                      v-decorator="['remark', { rules: [{ required: false, message: '输入备注', whitespace: true }]}]"
                      placeholder="输入备注"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <!-- <small>*</small> -->
                  <span>自定义型号</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['cusProductModel', { rules: [{ required: false, message: '请输入自定义型号！', whitespace: true }]}]"
                      placeholder="请输入自定义型号"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
      <div class="inventory">
        <div class="inventory_header">
          <span class="inventory_title">设置库存预警<small style="margin-left:5px;color:#c2bcbc">安全库存数量 >= 未来三个月市场销量指标片数之和</small></span>
          <a-tooltip>
            <template slot="title">安全库存数量 >= 未来三个月市场销量指标片数之和</template>
            <i class="iconfont icon-question" />
          </a-tooltip>
        </div>
        <template>
          <div class="table">
            <!-- <a-input class="titleInput" :disabled="allDisabled" v-model="remindDay" /> -->
            <a-table
              :rowSelection="rowSelection"
              :columns="columns"
              :dataSource="dataTable"
              :pagination="false"
              rowKey="tableId"
            >
              <span slot="customTitle">
                所有库位最低库存数量
                <a-input :disabled="allDisabled" v-model="remindDay" style="margin-left:20px" />
              </span>
              <div slot="earlyWarningInventory" slot-scope="text,record">
                <span class="tableSpan">该库存最低库存数量</span>
                <a-input v-model="record.earlyWarningInventory" :disabled="disabled" />
              </div>
            </a-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { findProductMo } from '@/api/basicInfo/hosData'
import {
  addCusProducts,
  retriveWareData,
  retriveLocation
} from '@/api/information'
import { DataFilter } from '@/utils/storage'
import { STable } from '@/components'
const columnsAdd = [
  //   {
  //     title: "所有库位一键预警",
  //     dataIndex: "whName"
  //   },
  //   {
  //     title: "所有库位最低库存数量",
  //     dataIndex: "earlyWarningInventory",
  //     scopedSlots: {
  //       customRender: "earlyWarningInventory"
  //     }
  //   }
]

const columnsUpdate = [
  {
    title: '所有库位一键预警',
    dataIndex: 'whName'
  },
  {
    // title: "所有库位最低库存数量",
    dataIndex: 'earlyWarningInventory',
    scopedSlots: {
      customRender: 'earlyWarningInventory'
    },
    slots: { title: 'customTitle' }
  }
]

export default {
  name: 'AddMyProduct',
  props: ['tabletData'],
  privinceData: [],
  components: {
    STable
  },
  data() {
    return {
      addBtn: true,
      selectList: [],
      remindDay: null,
      queryParam: {
        page: 1,
        size: 100
      },
      dataTable: [],
      allDisabled: true,
      disabled: false,
      columns: [],
      modelList: [],
      nameCN: [],
      startValue: null,
      endValue: null,
      endOpen: false,
      SNtitle: '',
      bankList: [],
      orUpdata: true // true可以修改 false时不可修改
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.reserveProductMo()
  },
  mounted() {
    // 蚂蚁金服的验证规则
    // console.log(this.tabletData);
    if (this.tabletData.id) {
      this.orUpdata = false
      this.SNtitle = '修改我的产品'
      this.form.setFieldsValue({
        productName: this.tabletData.productName,
        productModel: this.tabletData.productModel,
        effectiveNotifyDay: this.tabletData.effectiveNotifyDay,
        productCategory: this.tabletData.productCategory,
        cusProductName: this.tabletData.cusProductName,
        remark: this.tabletData.remark,
        cusProductModel: this.tabletData.cusProductModel
      })
      this.getList()
    } else {
      this.getWarnList()
      this.SNtitle = '新增我的产品'
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(selectedRows);
          this.selectList = selectedRows
          for (let i = 0; i < this.dataTable.length; i++) {
            const index = selectedRows.findIndex((value, index) => {
              return this.dataTable[i].whCode === value.whCode
            })
            if (index >= 0) {
              this.dataTable[i].status = 1
            } else {
              this.dataTable[i].status = 0
            }
          }

          // console.log(this.dataTable);
          if (selectedRowKeys.length === this.dataTable.length) {
            this.disabled = true
            this.allDisabled = false
          } else {
            this.disabled = false
            this.allDisabled = true
          }
        },
        getCheckboxProps: record => ({
          props: {
            defaultChecked: record.status === 1,
            // defaultChecked: selectedRowKeys.includes(record.status == 1),
            earlyWarningInventory: record.earlyWarningInventory
          }
        })
      }
    }
  },
  methods: {
    getList() {
      const params = {
        productModel: this.tabletData.productModel
      }
      this.columns = columnsUpdate
      const TableList = []
      retriveWareData(params).then(res => {
        if (res.data.length > 0) {
          res.data.map((item, index) => {
            TableList.push({
              ...item,
              tableId: index
            })
          })
        }
        this.dataTable = TableList
      })
    },
    getWarnList() {
      this.columns = columnsAdd
      retriveLocation(this.queryParam).then(res => {
        if (res.data.length > 0) {
          this.dataTable = res.data.list.map((item, index) => {
            return {
              ...item,
              tableId: index
            }
          })
        }
      })
    },
    // 返回到主页面 子组件调用父组件的方法
    handleBack() {
      this.$emit('handleNewSN', false)
    },

    handleProvince(val) {
      console.info('已选择', val)
    },

    selectModel(value) {
      // this.form.setFieldsValue({
      //     productNameCn: ''
      // });
      // for (var i = 0; i < this.modelList.length; i++) {
      //     if (this.modelList[i].productModel === value) {
      //         this.nameCN[0] = this.modelList[i].productNameCn
      //     }
      // }
      for (var i = 0; i < this.modelList.length; i++) {
        if (this.modelList[i].productModel === value) {
          this.form.setFieldsValue({
            productName: this.modelList[i].productName
          })
        }
      }
    },

    // onChangeDegree(value) {
    //   console.log("changed", value);
    //   this.form.setFieldsValue({
    //     degree: value
    //   });
    // },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        const _that = this
        // console.log(_that.dataTable);
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            const params = {}
            if (_that.selectList.length === _that.dataTable.length) {
              params.wareHouseWaringConfigList = _that.dataTable.map(
                (item, index) => {
                  return {
                    ...item,
                    earlyWarningInventory: _that.remindDay
                  }
                }
              )
            } else {
              params.wareHouseWaringConfigList = _that.dataTable
            }
            // console.log(values.cusProductName)
            params.distProduct = {
              id: _that.tabletData.id,
              distCode: _that.tabletData.distCode,
              productModel: values.productModel,
              productName: values.productName,
              effectiveNotifyDay: values.effectiveNotifyDay,
              productCategory: values.productCategory,
              cusProductName: values.cusProductName == null ? null : values.cusProductName.replace(/\s+/g, ''),
              remark: values.remark,
              cusProductModel: values.cusProductModel == null ? null : values.cusProductModel.replace(/\s+/g, '')
            }
            // console.log(params);
            this.handleAddSN(params)
          }
        })
      }
    },

    handleAddSN(params) {
      addCusProducts(params).then(res => {
        // console.log(res);
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message
          })
        }
      })
    },
    reserveProductMo() {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.modelList = res.data
        }
      })
    }
  }
}
</script>
<style lang="less">
/* 设置库存预警 */
.inventory {
  margin-top: 32px;

  .inventory_header {
    margin-bottom: 20px;
    .inventory_title {
      color: rgba(147, 147, 147, 1);
      font-size: 14px;
      font-family: PingFang SC;
      margin-right: 12px;
    }
  }

  .ant-table-body table .ant-table-thead tr th {
    color: #3e4da8;
    font-size: 14px;
    font-weight: normal;
  }

  .ant-table-body table tr:nth-child(2n) td {
    background: #fff;
  }

  .ant-table-body table .ant-table-tbody tr:hover:nth-child(2n) td {
    background: #fff;
  }

  .ant-table-tbody > tr.ant-table-row-selected td {
    background: #fff;
  }

  .ant-input {
    width: 240px;
  }

  .table {
    position: relative;

    .titleInput {
      position: absolute;
      left: 507px;
      top: 11px;
      z-index: 999;
    }

    .tableSpan {
      margin-right: 20px;
      display: inline-block;
      width: 142px;
      text-align: right;
    }
  }
}

/* //新增页面边框 */
.proNewBorder {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 4px;
  padding: 30px 40px;
  margin-top: 20px;

  .proNew-title {
    color: rgba(84, 97, 130, 1);
    font-size: 14px;
    height: 36px;
    width: 100%;
    display: inline-block;

    .iconfont {
      color: rgba(66, 131, 255, 1);
      font-size: 26px;
    }

    span {
      float: left;
      line-height: 36px;
      font-size: 16px;
    }
  }

  /* 不可修改时的样式 */
  .ban_update {
    .addInput-title {
      .ban_small {
        float: right;
        color: rgba(62, 77, 168, 1) !important;
        opacity: 1;
      }
    }

    .adInput-input {
      .ant-input {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
      }
      .ant-select-selection {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
      }
    }
  }

  .addInput {
    margin-bottom: 30px;

    .addInput-title {
      padding: 0 0 8px 0;
      font-size: 14px;

      span {
        color: rgba(84, 97, 130, 1);
      }

      small {
        color: #e17877;
        margin-right: 5px;
        float: left;

        &.addInput-tips {
          color: rgba(170, 174, 185, 1);
        }
      }

      .icon-question {
        float: right;
      }
    }
  }

  .adInput-input {
    /* >input {
                background: rgba(247, 250, 255, 1);
                border: 1px solid rgba(205, 223, 252, 1);
                color: rgba(159, 172, 195, 1);
            } */
    .begin_date {
      .anticon-calendar {
        color: #3e4da8;
      }
    }

    .ant-select-selection--single {
      height: 42px;
    }

    .ant-select-selection__rendered {
      line-height: 42px;
    }

    .ant-form-item,
    .ant-form-item-control-wrapper,
    .ant-form-item-control {
      width: 100%;
    }

    .ant-select-selection {
      background: rgba(252, 252, 252, 1) !important;
      border: 1px solid #ececec !important;
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

  /* .addInput-tag {
            padding: 24px 0;

            .ant-tag {
                width: 168px;
                height: 36px;
                background: rgba(247, 250, 255, 1);
                border: 1px solid rgba(205, 223, 252, 1);
                border-radius: 4px;
                line-height: 36px;
                color: rgba(159, 172, 195, 1);
                font-size: 14px;
                padding: 0 12px;
                display: inline-block;
                margin: 0 8px 16px 0;

                .anticon {
                    float: right;
                    line-height: 36px;
                    color: rgba(205, 223, 252, 1);
                    font-size: 16px;
                }

                &:hover {
                    background: rgba(229, 238, 255, 1);
                    border-color: rgba(176, 204, 255, 1);
                    color: rgba(66, 131, 255, 1);
                    font-weight: bold;

                    .anticon {
                        color: rgba(66, 131, 255, 1);
                        font-weight: bold;
                    }
                }
            }
        } */
}

/* .area-select-wrap {
        display: flex;
        flex-wrap: nowrap;

        .area-select {
            background: rgba(247, 250, 255, 1);
            border: 1px solid rgba(205, 223, 252, 1);
            color: rgba(159, 172, 195, 1);
            height: 54px;
            width: 50%;
            line-height: 50px;
            display: inline-block;
            position: relative;

            .area-select-icon {
                font-family: 'iconfont';
                font-style: normal;
                position: absolute;
                right: 16px;
                top: 0;

                &:before {
                    content: "\e64b";
                }
            }

            &:first-child {
                margin-left: 0;
            }

            .area-selected-trigger {
                width: 100%;
                padding: 0 12px;
                display: inline-block;
            }

            .area-selectable-list-wrap {
                position: absolute;
                margin: -15px 0 0 0;
                width: 100%;
            }

            .area-selectable-list {
                border: 1px solid #cddffc;
                width: 100%;
                margin: 12px 0 0 0;
                padding: 0;
                list-style: none;
                z-index: 9999;
                position: absolute;
                background: #f7faff;
                max-height: 130px;
                overflow-y: auto;

                li {
                    padding: 0 12px;
                    cursor: pointer;
                    line-height: 32px;
                }
            }
        }
    } */

/* .upload {
        padding: 0 0 24px 0;
    } */

/* tile uploaded pictures */
/* .ant-upload-list {
        float: left;
        width: auto;
    } */

/* .ant-upload-list>.ant-upload-list-item {
        float: left;
        width: 168px;
        height: auto;
        display: inline-block;
        background: rgba(249, 251, 255, 1);
        border: 1px solid rgba(205, 223, 252, 1);
        border-radius: 4px;
        margin-right: 8px;
        padding: 8px;

        .ant-upload-list-item-info {
            >span {
                width: 100%;
                text-align: center;
                display: inline-block;
                height: 100%;
                padding: 0;
                margin: 0;
                min-height: 162px;

                a:first-child {
                    width: 100px;
                    height: 100px;
                    top: auto;
                    left: auto;
                    position: relative;
                    display: inline-block;
                    margin: 8px 0 0 0;

                    img {
                        width: 100px;
                        height: 100px;
                    }

                    .anticon {
                        font-size: 48px;
                        padding: 26px 0;
                        color: rgba(205, 223, 252, 1);
                    }
                }
            }

            .ant-upload-list-item-name {
                padding: 0;
                min-height: 44px;
            }
        }

        .anticon-close {
            font-size: 16px;
            color: rgba(205, 223, 252, 1);
            opacity: 1;
        }
    } */

/* .ant-upload-list>.ant-upload-animate-enter {
        animation-name: uploadAnimateInlineIn;
    }

    .ant-upload-list>.ant-upload-animate-leave {
        animation-name: uploadAnimateInlineOut;
    } */

/* .ant-upload.ant-upload-drag { */
/* border: none;
        background: none;
        text-align: left;
        float: left;
        width: auto;
        display: inline-block; */

/* .ant-upload {
            padding: 0;
        } */

/* .ant-upload-list {
            width: 168px;
            min-height: 180px;
            margin: 0 16px 0 0;

            >.ant-upload-list-item {
                height: 100%;
                min-height: 180px;
            }
        } */

/* } */
</style>
