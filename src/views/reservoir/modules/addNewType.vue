<template>
  <a-modal
    title="选择库位"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
    class="addWhType"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <div class="scanEdit">
        <a-form layout="inline" :form="form">
          <div class="scanMain">
            <p class="whTypeText">请为未带出原始库位的产品选择一个统一的原始库位，不影响已带出库位的产品。</p>
            <p>一单只能手工选择一个原始库位，如果需要手动选择多个不同的原始库位，请分单操作。</p>
            <label for="">选择库位</label>
            <div class="scanDetail">
              <a-select
                style=" width: 100%;"
                placeholder="选择库位名称"
                @change="handleOpt"
                v-model="whCode"
              >
                <a-select-option
                  v-for="item in whList"
                  :key="item.whCode"
                  :value="item.whCode"
                >{{ item.whName }}</a-select-option>
              </a-select>
            </div>
          </div>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { findJsList } from '@/api/depot/wareHouse'

export default {
  name: 'EditScan',
  props: ['visible', 'distCode'],
  components: {
    moment
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  data () {
    // console.info('distCode---',this.distCode)
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      whCode: undefined,
      whName: '',
      whList: []
    }
  },
  mounted () {
    this.getFirst()
  },
  methods: {
    handleSubmit () {
      // console.info('proData----',this.proData)
      this.$emit('checkWh', { whCode: this.whCode, whName: this.whName })
    },
    handleCancel () {
      this.$emit('checkCancle')
    },
    getFirst () {
      const params = {
        distCode: this.distCode
      }
      findJsList(params).then(res => {
        // console.info(res)
        this.whList = res.data
      })
    },
    handleOpt (val) {
      this.whCode = val
      this.whList.map(item => {
        if (item.whCode === val) {
          this.whName = item.whName
        }
      })
    }

  }
}
</script>
<style lang="less">
  .addInput{
    margin: 16px 0 0 0;
    .addInput-title{
      padding: 0 0 8px 0;
      font-size: 14px;
     span{
        font-weight: bold;;
        color: rgba(84, 97, 130, 1);
      }
      small{
        color: rgba(66, 131, 255, 1);
        float: right;
        &.addInput-tips{
          color: rgba(170, 174, 185, 1);
        }
      }
    }
  }
  .adInput-input{
    .ant-select-selection--single{
      height: 54px;
    }
    .ant-select-selection__rendered{
      line-height: 54px;
    }
    .ant-form-item,.ant-form-item-control-wrapper,.ant-form-item-control{
      width: 100%;
    }
    .ant-input{
      height: 54px;
      width: 100%;
      line-height: 54px;
      background:rgba(247,250,255,1);
      border:1px solid rgba(233, 233, 233, 1);
    }
    .ant-input-affix-wrapper .ant-input-suffix{
      .icon-cancle{
        color: rgba(205, 223, 252, 1);
        font-size: 24px;
      }
    }
  }
  .addWhType{
  .ant-modal-content {
    .ant-modal-body{
      padding: 24px;
      .scanEdit{
        position: relative;
        padding: 0;
        .scanMain{
          display: inline-block;
          width: 100%;
          p{
            margin: 0;
            color: rgba(0,0,0,0.5);
            font-size: 12px;
            line-height: 22px;
            &.whTypeText{
              font-size: 14px;
              color:  rgba(0,0,0,1);
              line-height: 32px;
            }
          }
          label{
            font-size: 14px;
            color: rgba(147, 147, 147, 1);
            padding: 18px 0 0 0;
            width: 100%;
            line-height: 32px;
            min-height: 32px;
            display: inline-block;
            small{
              color: red;
              padding: 0 4px 0 0;
            }
          }
          .scanDetail{
            .ant-form-item-control-wrapper,.ant-form-item-control{
              width: 100%;
            }
            span.scanCon{
              color: rgba(52, 53, 62, 1);
              font-size: 18px;
              font-weight: bold;
              height: 44px;
              line-height: 44px;
              margin: 8px 0 0 0;
              display: inline-block;
            }
            .ant-input,.ant-input-number,.ant-select-selection{
              height: 44px;
              line-height: 44px;
              margin: 8px 0 0 0;
              font-size: 14px;
              color: rgba(52, 53, 62, 1);
              font-weight: bold;
              &::-webkit-input-placeholder {
                color: rgba(52, 53, 62, 1) !important;
              }
              .ant-select-selection__rendered{
                line-height: 42px;
              }
            }
          }
        }
        .scanBorder{
          width: 100%;
          height: 1px;
          background: rgba(235, 235, 235, 1);
          display: block;
          margin: 18px 0;
        }
      }
      .modal-info{
        .ant-spin-container{
          .ant-row{
            & > div{
              padding: 0;
              border:none;
            }
          }
        }
      }
    }
  }
  }
</style>
