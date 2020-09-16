<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ headTitle }}</h3>
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
      </a-row>
    </div>
    <a-form layout="inline" :form="form">
      <a-row :gutter="16">
        <a-col :md="12" :sm="12">
          <div class="proNewBorder">
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>配送商名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['cusName', { rules: [{ required: true, message: '请输入配送商名称！', whitespace: true }]}]"
                    placeholder="请输入配送商名称"
                    style="width: 100%"
                  >
                    <!-- <a-icon slot="suffix" type="ellipsis" /> -->
                  </a-input>
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <span>配送商代码</span>
                <small class="ban_small">不可修改</small>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    disabled
                    v-decorator="['cusCode', { rules: [{ required: true, message: '输入配送商代码', whitespace: true }]}]"
                    placeholder="输入配送商代码"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>联系方式</span>
                <!-- <small>*</small> -->
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactPhone', { rules: [{ required: false, message: '请输入正确的手机号', whitespace: true,pattern:/^1[3|4|5|7|8][0-9]\d{8}$/ }]}]"
                    placeholder="输入联系方式"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>联系人邮箱</span>
                <!-- <small>*</small> -->
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactEmail', { rules: [{ required: false, message: '请输入正确的邮箱', whitespace: true,pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ }]}]"
                    placeholder="输入联系人邮箱"
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
                <small v-else></small>
                <span>省份/城市</span>
              </div>
              <div class="adInput-input">
                <!-- <area-select
                  v-model="privinceData"
                  size="large"
                  @change="handleProvince"
                  :data="pca"
                  icon="icon-arrow-down"
                  type="text"
                   :disabled="!orUpdata"
                />-->
                <a-form-item style="width: 45%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['province', { rules: [{ required: true, message: '输入所在省', whitespace: true }]}]"
                    placeholder="输入所在省"
                    style="width: 100%"
                  />
                </a-form-item>
                <a-form-item style="width: 45%;float:right;" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['city', { rules: [{ required: true, message: '输入所在城市', whitespace: true }]}]"
                    placeholder="输入所在城市"
                    style="width: 100%; "
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else></small>
                <span>详细地址</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['detail', { rules: [{ required: false }]}]"
                    placeholder="输入地址"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>联系人</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contacts', { rules: [{ required: false, message: '请输入联系人！', whitespace: true }]}]"
                    placeholder="请输入联系人"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <!-- <div class="addInput">
                            <div class="addInput-title">
                                <span>微信</span>
                                <small>*</small>
                            </div>
                            <div class="adInput-input">
                                <a-form-item style="width: 100%" has-feedback>
                                    <a-input
                                        v-decorator="['contactWechat', { rules: [{ required: false, message: '输入微信', whitespace: true }]}]"
                                        placeholder="输入微信" style="width: 100%" />
                                </a-form-item>
                            </div>
            </div>-->
          </div>
        </a-col>
      </a-row>
    </a-form>
    <a-modal
      title="代码查询"
      v-model="disCodevisible"
      @ok="handleOk"
      width="800px"
      @cancel="handleCancel"
      class="codeSearch"
    >
      <template>
        <a-input-search placeholder="请输入名称搜索" @search="onSearch(modeType)" v-model="inputName">
          <a-button slot="enterButton">搜索</a-button>
        </a-input-search>
        <a-table
          :columns="columns"
          :dataSource="tableDatas"
          :pagination="pagination"
          :loading="loading"
          :rowSelection="{type:'radio',onChange: onSelectChange,selectedRowKeys}"
          @change="handleTableChange"
          rowKey="cusCode"
          :destroyOnClose="true"
        ></a-table>
      </template>
    </a-modal>
  </div>
</template>
<script>
import notification from 'ant-design-vue/es/notification'
import { addDistData, retriveCustName } from '@/api/basicInfo/hosData'
import { AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
const columns = [
  {
    title: '配送商名称',
    dataIndex: 'cusName'
  },
  {
    title: '配送商代码',
    dataIndex: 'cusCode'
  }
]
export default {
  name: 'AddDealersDistributors',
  props: ['tableData'],
  components: {
    AreaSelect
  },
  data() {
    return {
      addBtn: true,
      inputName: '',
      orUpdata: true,
      loading: true,
      tableDatas: [],
      columns,
      disCodevisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      },
      queryParam: {
        page: 0,
        size: 10
      },
      privinceData: [],
      pca,
      pcaa,
      headTitle: null
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {},
  mounted() {
    // 蚂蚁金服的验证规则
    if (this.tableData.id) {
      this.orUpdata = false
      this.headTitle = '修改配送商信息'
      this.form.setFieldsValue({
        cusName: this.tableData.cusName,
        cusCode: this.tableData.cusCode,
        detail: this.tableData.detail,
        contactPhone: this.tableData.contactPhone,
        contactEmail: this.tableData.contactEmail,
        contacts: this.tableData.contacts,
        // contactWechat: this.tableData.contactWechat,
        province: this.tableData.province,
        city: this.tableData.city
      })
      //   this.privinceData = [this.tableData.province, this.tableData.city];
    } else {
      this.headTitle = '添加配送商信息'
    }
  },
  methods: {
    // 模糊搜索
    onSearch(code) {
      let name = null
      if (code === 'distCode') {
        name = 'distName'
      } else if (code === 'hosCode') {
        name = 'hosName'
      }
      this.queryParam = {
        page: 1,
        size: 10,
        [name]: this.inputName
      }
      this.retriveCode(code)
    },
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
      this.changeRetrive()
    },

    changeRetrive() {
      retriveCustName(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.loading = false
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.tableDatas = res.data.list
          this.pagination = pagination
        }
      })
      this.loading = true
    },
    retriveCode() {
      this.disCodevisible = true
      this.changeRetrive()
    },
    handleOk() {
      this.form.setFieldsValue({
        cusCode: this.selectedRows[0].cusCode,
        cusName: this.selectedRows[0].cusName
      })

      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1,
        size: 10
      }
      this.disCodevisible = false
    },
    // 弹框的取消按钮
    handleCancel() {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1,
        size: 10
      }
    },
    // 单选
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 返回到主页面
    handleBack() {
      this.$emit('handleNewPro', false)
    },

    handleProvince(val) {
      console.info('已选择', val)
    },

    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            const params = {
              cusName: values.cusName,
              cusCode: values.cusCode,
              detail: values.detail,
              contactPhone: values.contactPhone,
              contactEmail: values.contactEmail,
              contacts: values.contacts,
              contactWechat: values.contactWechat,
              province: this.privinceData[0],
              city: this.privinceData[1]
            }
            if (this.tableData.id) {
              params.id = this.tableData.id
            }
            //   console.log(params);
            this.handleAddSN(params)
          }
        })
      }
    },

    handleAddSN(params) {
      addDistData(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewPro', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
// /* //新增页面边框 */
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

  /* 城市2级联动样式 */
  .area-select-wrap {
    display: flex;
    flex-wrap: nowrap;

    .area-select {
      background: #fcfcfc;
      border: 1px solid #ececec;
      color: rgba(159, 172, 195, 1);
      height: 42px;
      width: 50%;
      line-height: 42px;
      display: inline-block;
      position: relative;

      .area-select-icon {
        font-family: "iconfont";
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
        border: 1px solid #ececec;
        width: 100%;
        margin: 12px 0 0 0;
        padding: 0;
        list-style: none;
        z-index: 9999;
        position: absolute;
        background: #fcfcfc;
        max-height: 130px;
        overflow-y: auto;

        li {
          padding: 0 12px;
          cursor: pointer;
          line-height: 32px;
        }
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
      /* width: 100%; */
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
.codeSearch{
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
