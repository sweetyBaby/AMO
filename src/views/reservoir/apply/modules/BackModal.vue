<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="backData.visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-form layout="inline" :form="form">
        <div class="model_Input">
          <div class="addInput-title">
            <span>经销商名称</span>
            <small>*</small>
          </div>
          <div class="adInput-input">
            <a-form-item style="width: 100%" has-feedback>
              <a-select
                showSearch
                :filterOption="filterOption"
                v-decorator="['distCode', { rules: [{ required: true, message: '请选择经销商名称！', whitespace: true }]}]"
                placeholder="请选择经销商名称"
                style="width: 100%"
              >
                <a-select-option
                  v-for=" (item,index) in distList"
                  :value="item.distCode"
                  :key="index"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>
        <div class="model_Input">
          <div class="addInput-title">
            <span>{{ title }}</span>
            <small>*</small>
          </div>
          <div class="adInput-input">
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                v-decorator="['remark', { rules: [{ required: true, message: '请输入理由！', whitespace: true }]}]"
                placeholder="请输入理由"
                style="width: 100%;"
              />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { userDistRange } from '@/api/depot/wareHouse'
export default {
  name: 'BackModal',
  props: ['backData', 'type'],
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    if (this.type == 'refuseAccept') {
      this.title = '拒收原因'
    } else if (this.type == 'ReturnGoods') {
      this.title = '退货原因'
    }
  },
  created() {
    const params = {
      distCode: this.$store.state.user.info.distCode
    }
    userDistRange(params).then(res => {
      // console.info('====',res)
      this.distList = res.data
    })
  },
  data() {
    return {
      title: null,
      confirmLoading: false,
      distList: []
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleSubmit(e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$emit('handleSub', values)
        }
      })
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less">
/* //新增页面边框 */

.model_Input {
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

  .adInput-input {
    .ant-form-item-control-wrapper {
      border: 0 !important;
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
}
</style>
