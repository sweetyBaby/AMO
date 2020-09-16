<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>
            <span>库存统计</span>
          </h3>
        </a-col>
        <a-col :md="12">
          <div class="scanInput">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handelBack">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back" />
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleSubmit">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>提交</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-save" />
                  </a-button>
                </a-tooltip>
              </span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline" :form="form">
      <!-- <p class="inlintTitle">库存统计（请在下方输入有效期内的无码型号的数量）</p> -->
      <div class="basicTable">
        <p class="inlintTitle">库存统计（请在下方输入有效期内的无码型号的数量）</p>
        <a-row :gutter="24">
          <a-col span="24">
            <label for class="basicTitle">蝴蝶夹(三片式)</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%">
                <span>数量</span>
                <a-input
                  style="width:60%"
                  v-decorator="['EMERALDC', { rules: [{ required: false, message: '数量只能为整数', whitespace: true ,pattern:/^(-|\+)?\d+$/}]}]"
                />
                <span style="margin-left:10px">个</span>
              </a-form-item>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <label for class="basicTitle">蝴蝶夹(一片式)</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%">
                <span>数量</span>
                <a-input
                  style="width:60%"
                  v-decorator="['1MTEC30', { rules: [{ required: false, message: '数量只能为整数', whitespace: true ,pattern:/^(-|\+)?\d+$/}]}]"
                />
                <span style="margin-left:10px">个</span>
              </a-form-item>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <label for class="basicTitle">Healon</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%">
                <span>数量</span>
                <a-input
                  style="width:60%"
                  v-decorator="['Healon', { rules: [{ required: false, message: '数量只能为整数', whitespace: true ,pattern:/^(-|\+)?\d+$/}]}]"
                />
                <span style="margin-left:10px">盒</span>
              </a-form-item>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
  </a-card>
</template>
<script>
import { retriveList, saveList } from '@/api/depot/depot'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'AddNoCode',
  data() {
    return {
      isBtn: false,
      addBtn: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  components: {},
  // 当监听到值的改变
  created() {},

  mounted() {
    this.handelTable()
  },
  methods: {
    // 返回上一级的方法
    handelBack() {
      this.$emit('back', 'table')
    },
    handelTable() {
      const params = {}
      this.form.setFieldsValue({
        EMERALDC: 0,
        '1MTEC30': 0,
        Healon: 0
      })
      retriveList(params).then(res => {
        if (res.message == 'SUCCESS') {
          this.form.setFieldsValue({
            EMERALDC: res.data.EMERALDC ? res.data.EMERALDC : 0,
            '1MTEC30': res.data['1MTEC30'] ? res.data['1MTEC30'] : 0,
            Healon: res.data.Healon ? res.data.Healon : 0
          })
        }
      })
    },
    handleSubmit() {
      if (this.addBtn) {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            const params = {
              EMERALDC: values.EMERALDC,
              '1MTEC30': values['1MTEC30'],
              Healon: values.Healon
            }
            saveList(params).then(res => {
              if (res.message === 'SUCCESS') {
                this.$emit('back', 'table')
              } else {
                this.addBtn = true
                notification.error({
                  message: '错误',
                  description: res.message
                })
              }
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
.pageTitle {
  h3 {
    & > span {
      float: left;
    }
  }
  .showBasic {
    color: rgba(147, 147, 147, 1);
    display: inline-block;
    line-height: 22px;
    span {
      float: left;
      font-size: 12px;
      padding: 4px 12px 0 40px;
    }
    &:hover {
      span {
        color: rgba(62, 77, 168, 1);
      }
    }
    .iconfont {
      font-size: 12px;
      float: left;
      padding: 4px 0 0 0;
    }
  }
}

.basicTable {
  border-radius: 8px;
  border: 1px solid rgba(233, 233, 233, 1);
  margin-top: -1px;
  overflow: hidden;
  .inlintTitle {
    height: 54px;
    line-height: 54px;
    background: rgba(251, 251, 251, 1);
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    opacity: 1;
    color: #3e4da8;
    padding-left: 40px;
    margin: 0;
  }
  > .ant-row {
    > div {
      display: flex;
      flex-wrap: nowrap;
      //   height: 56px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      padding: 0 !important;
      label.basicTitle {
        width: 30%;
        flex-grow: 1;
        margin-left: 40px;
        line-height: 56px;
        padding: 0 12px;
        display: inline-block;
        color: #34353e;
      }
      .basicInfo {
        flex-grow: 1;
        width: 70%;
        border-left: 1px solid rgba(233, 233, 233, 1);
        border-right: 1px solid rgba(233, 233, 233, 1);
        display: inline-block;
        padding: 12px;
        color: #939393;
        &:nth-child(3n) {
          border-right: none;
        }
        .ant-form-inline .ant-form-item-with-help {
          margin-bottom: 0;
        }
        span {
          //   margin-left: 22px;
          margin-right: 20px;
        }
      }
    }
  }
  .ant-input,
  .ant-select-selection {
    background: #ececec;
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 4px;
  }
}
</style>
