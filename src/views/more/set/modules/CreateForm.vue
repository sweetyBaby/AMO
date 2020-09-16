<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visibleData"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <div class="proNewCreate">
        <a-form layout="inline" :form="form">
          <div class="addInput">
            <div class="addInput-title">
              <span>名称</span>
              <small>*</small>
            </div>
            <div class="adInput-input">
              <a-form-item style="width: 100%" has-feedback>
                <a-input
                  v-decorator="['menuName', { rules: [{
                    required: true,
                    message: '请输入名称！',
                    whitespace: true
                  }]}]"
                  style="width: 100%"
                  placeholder="名称"
                />
              </a-form-item>
            </div>
          </div>
          <a-row :gutter="16">
            <a-col span="12">
              <div class="addInput">
                <div class="addInput-title">
                  <span>url</span>
                  <!-- <small class="addInput-tips">url</small> -->
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['menuUrl', { rules: [{message: '请输入url！', whitespace: true }]}]"
                      style="width: 100%"
                      placeholder="url"
                    />
                  </a-form-item>
                </div>
              </div>
            </a-col>
            <a-col span="12">
              <div class="addInput">
                <div class="addInput-title">
                  <span>Icon</span>
                  <!-- <small class="addInput-tips">Icon名称</small> -->
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['menuIcon', { rules: [{message: '请输入Icon名称！', whitespace: true }]}]"
                      style="width: 100%"
                      placeholder="icon名称"
                    />
                  </a-form-item>
                </div>
              </div>
            </a-col>
          </a-row>
          <div class="addInput" v-if="modalData.menuNo">
            <div class="addInput-title">
              <span>编码</span>
            </div>
            <div class="adInput-input">
              <a-form-item style="width: 100%" has-feedback>
                <a-input
                  v-decorator="['menuNo', { rules: [{ required: false }]}]"
                  style="width: 100%"
                  placeholder="url"
                  disabled
                />
              </a-form-item>
            </div>
          </div>
          <a-row :gutter="16">
            <a-col span="12">
              <div class="addInput">
                <div class="addInput-title">
                  <span>排序</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['menuOrder', { rules: [{required: false, message: '请输入排序！' }]}]"
                      style="width: 100%"
                      placeholder="请输入排序"
                    />
                  </a-form-item>
                </div>
              </div>
            </a-col>
            <a-col span="12">
              <div class="addInput">
                <div class="addInput-title">
                  <span>级别</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['level', { rules: [{required: false }]}]"
                      style="width: 100%"
                      placeholder="url"
                      disabled
                    />
                  </a-form-item>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  props: ['modalData', 'visibleData', 'title'],
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    console.info('this.modalData', this.modalData)
    const _that = this
    this.$nextTick(() => {
      _that.form.setFieldsValue({
        menuName: this.modalData.menuName,
        menuUrl: this.modalData.menuUrl,
        menuOrder: this.modalData.menuOrder,
        menuNo: this.modalData.menuNo,
        level: this.modalData.level,
        menuIcon: this.modalData.menuIcon
      })
    })
  },
  methods: {
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          const params = {
            menuNo: this.modalData.menuNo,
            parentNo: this.modalData.parentNo,
            ...values
          }
          // console.log('params', params)
          setTimeout(() => {
            this.$emit('ok', params)
          }, 1500)
        } else {
          console.info('0000')
        }
      })
    },
    handleCancel() {
      this.$emit('cancel', false)
    }
  }
}
</script>
<style lang="less">
/* //新增页面边框 */

.proNewCreate {
  .ant-form-item-control-wrapper {
    border-bottom: 0 !important;
  }
  .ant-row{
      div{
          border-bottom: 0 !important;
      }
  }
  width: 100%;
  //   background: rgba(255, 255, 255, 1);
  //   box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 4px;
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
  }

  .addInput {
    // margin-bottom: 30px;

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
}
</style>
