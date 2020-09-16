<template>
  <div>
    <div class="pageTitle">
      <a-col :md="16" :sm="24">
        <h3>手动添加出库单</h3>
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
        </div>
      </a-col>
    </div>
    <a-form layout="inline" :form="form" style="margin-top: 40px;">
      <a-row :gutter="16">
        <a-col :md="9" :sm="9">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>出入库单凭证单据号</span>
              </div>
              <div class="adInput-input" @click="retriveCode()" style=" cursor: pointer;">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input class="outCode" v-decorator="['docNo', { rules: [{ required: true, message: '请输入出入库单凭证单据号！', whitespace: true }]}]" placeholder="请输入出入库单凭证单据号" style="width: 100%" :disabled="true">
                    <a-icon slot="suffix" type="ellipsis" style="font-size:28px;" />
                  </a-input>
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
                <span>经销商名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input disabled placeholder="经销商名称" v-model="formList.distName" style="width: 100%" />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
                <span>客户名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input placeholder="客户名称" v-model="formList.cusName" style="width: 100%" />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <span>销量月份</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input placeholder="客户名称" v-model="formList.cusName" style="width: 100%" />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
                <span>单据类型</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input placeholder="单据类型" v-model="formList.billType" style="width: 100%" />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <span>原凭证单据号</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input placeholder="原凭证单据号" v-model="formList.createTime" style="width: 100%" />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import {
  getWareList,
  proDetail
} from '@/api/depot/wareHouse'
import {
  addUpload,
  deleteImg,
  getNoPicDoc
} from '@/api/auditManage/auditManage'
import {
  outVoucherVadd
} from '@/api/auditManage/outVoucher'
import notification from 'ant-design-vue/es/notification'
import moment from 'moment'
const outVoucher = [{
  title: '单据号码',
  dataIndex: 'docNo'
}, {
  title: '单据类型',
  dataIndex: 'docType',
  customRender: (text) => {
    switch (text) {
      case '01':
        return '进货入库'
        break
      case '02':
        return '退货入库'
        break
      case '03':
        return '换货入库'
        break
      case '04':
        return '调拨入库'
        break
      case '11':
        return '销售出库'
        break
      case '12':
        return '退货出库'
        break
      case '13':
        return '换货出库'
        break
      case '14':
        return '报废出库'
        break
      case '15':
        return '污损出库'
        break
      case '16':
        return '调拨出库'
        break
      case '20':
        return '库位调拨'
        break
      case '30':
        return '库存上报'
        break
      default:
    }
  }
}, {
  title: '单据日期',
  dataIndex: 'docDate',
  customRender: (text) => {
    return moment(text).format('YYYY-MM-DD')
  }
}, {
  title: '经销商名称',
  dataIndex: 'distName'
}, {
  title: '客户名称',
  dataIndex: 'cusName'
}]
export default {
  name: 'VoucherDetails',
  props: ['tabletData', 'voucherStatus'],
  privinceData: [],
  components: {},
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      selectedRowKeys: [],
      selectedRows: [],
      uploadData: {
        fileType: 3,
        uploadType: 1
      },
      keyCode: null,
      outVoucher,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      queryParam: {
        page: 1,
        size: 10,
        docNo: ''
      },
      loading: true,
      tableDatas: [],
      disCodevisible: false,
      docNo: '',
      formList: {
        distName: '',
        cusName: '',
        billType: '',
        createTime: ''
      },
      saveData: {},

      saveStatus: false
    }
  },
  computed: {
    headerUpload() {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleCheck(record) { // 点击表格列选中
      return {
        on: {
          click: () => {
            this.selectedRowKeys = []
            this.selectedRows = []
            this.selectedRowKeys.push(record.docNo)
            this.selectedRows.push(record)
          }
        }
      }
    },

    // 模糊搜索
    onSearch() {
      this.retriveCode()
    },
    // 单选
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      this.form.setFieldsValue({
        docNo: this.selectedRows[0].docNo
      })
      let docType = ''
      switch (this.selectedRows[0].docType) {
        case '01':
          docType = '进货入库'
          break
        case '02':
          docType = '退货入库'
          break
        case '03':
          docType = '换货入库'
          break
        case '04':
          docType = '调拨入库'
          break
        case '11':
          docType = '销售出库'
          break
        case '12':
          docType = '退货出库'
          break
        case '13':
          docType = '换货出库'
          break
        case '14':
          docType = '报废出库'
          break
        case '15':
          docType = '污损出库'
          break
        case '16':
          docType = '调拨出库'
          break
        case '20':
          docType = '库位调拨'
          break
        case '30':
          docType = '库存上报'
          break
        default:
      }
      this.formList = {
        distName: this.selectedRows[0].distName,
        cusName: this.selectedRows[0].cusName,
        billType: docType,
        createTime: moment(this.selectedRows[0].docDate).format('YYYY-MM-DD')
      }
      this.saveData.docNo = this.selectedRows[0].docNo
      this.saveData.docDate = moment(this.selectedRows[0].docDate).format('YYYY-MM-DD')
      this.saveData.docType = this.selectedRows[0].docType
      this.saveData.distCode = this.selectedRows[0].distCode
      this.saveData.distName = this.selectedRows[0].distName
      this.saveData.cusCode = this.selectedRows[0].cusCode
      this.saveData.cusName = this.selectedRows[0].cusName
      this.saveData.status = 1

      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1,
        size: 10,
        docType: '02',
        docNo: ''
      }
      this.disCodevisible = false
    },
    // 返回到主页面 子组件调用父组件的方法
    handleBack() {
      this.$emit('voucherDetails', 'index')
    },

    handleProvince(val) {
      console.info('已选择', val)
    },

    handleChange(value) {
      console.log(`selected ${value}`)
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },

    // 分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam = {
        page: pagination.current,
        size: pagination.pageSize,
        docNo: ''
      }
      this.changeRetrive()
    },

    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
    },
    changeRetrive() {
      getNoPicDoc(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.loading = false
          const pagination = {
            ...this.pagination
          }
          pagination.total = res.data.total
          this.tableDatas = res.data.list
          this.pagination = pagination
        }
      })
      this.loading = true
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.voucherStatus) {
            this.saveData.voucherStatus = this.voucherStatus.voucherStatus
          }

          outVoucherVadd(this.saveData).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '保存成功！',
                duration: 4
              })
              this.$emit('voucherDetails', 'index')
            } else {
              this.$notification['error']({
                message: '保存失败',
                description: res.message,
                duration: 4
              })
            }
            this.saveStatus = false
          })
        }
      })
    },
    // 点击输入框弹出弹框
    retriveCode() {
      this.disCodevisible = true
      this.changeRetrive()
    },
    // 弹框的取消按钮
    handleCancel() {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1,
        size: 10,
        docNo: ''
      }
    }
  }
}
</script>

<style lang="less">
/*模态框按钮*/
.imgModal {
    .anticon-close {
        color: #000 !important;
        border: none !important;
    }
}

.pageTitle {
    border: none;
}

.voucherTitle {
    font-size: 14px;
    color: #939393;
}

.voucherUpload {
    .ant-upload-select-picture-card:hover {
        color: #3e4da8;
        border-color: #3e4da8;

        .iconfont {
            color: #3f4da8;
        }

        .ant-upload-text {
            color: #3f4da8 !important;
        }
    }
}

.proNewBorder {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
    opacity: 1;
    border-radius: 4px;
    padding: 30px 40px;
    margin-top: 20px;
    height: 574px;

    .outCode {
        .ant-input-disabled {
            cursor: pointer;
        }
    }

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
        }

        .area-select {
            background: #ececec !important;
            color: #c1c1c1 !important;
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
        }
    }

    .adInput-input {
        .ant-calendar-picker {
            max-width: 100% !important;
        }

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
            margin-right: 0px;
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

        .ant-input-affix-wrapper {
            border: 0;
        }

        .ant-input-affix-wrapper .ant-input-suffix {
            cursor: pointer;
            right: 26px;

            .icon-cancle {
                color: rgba(205, 223, 252, 1);
                font-size: 24px;
            }
        }
    }

    /* 上传图片 */
    .clearfix {
        .ant-upload-select-picture-card i {
            font-size: 32px;
            color: #999;
        }

        .ant-upload-select-picture-card {
            .ant-upload-text {
                margin-top: 8px;
                color: #666;
            }
        }

        .ant-upload-select-picture-card {
            width: 119px;
            height: 119px;

            .ant-upload-text {
                margin-top: 0px;
                color: #b6b3b3;
            }
        }

        .ant-upload-list-picture-card {
            width: 100%;

            .ant-upload-list-item-error {
                border: 0;
            }

            .ant-upload-list-item {
                margin-right: 10px;
                margin-bottom: 10px;
                background: rgba(252, 252, 252, 1);
                border: 1px solid rgba(236, 236, 236, 1);
                opacity: 1;
                border-radius: 4px;
            }

            .ant-upload-list-item {
                width: 119px;
                height: 119px;

                padding: 0;
            }
        }
    }
}

//弹框中的搜索框
.inoutWrap {
    .ant-modal-content {
        .ant-input-affix-wrapper {
            margin-bottom: 20px;
            width: 328px;
            height: 32px;
        }

        .ant-input-suffix {
            .ant-btn {
                background-color: #e9e9e9;
                border-color: #e9e9e9;
            }
        }
    }
}
</style>
