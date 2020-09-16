<template>
  <a-modal
    :title="editData.title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
    class="addClose"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <div class="scanEdit">
        <div class="scanLeft">
          <a-form layout="inline" :form="form">
            <div class="scanMain">
              <label for=""><small>*</small>月份</label>
              <div class="scanDetail">
                <a-form-item style="width: 100%" has-feedback>
                  <a-month-picker
                    placeholder="选择月份"
                    v-decorator="['month', { rules: [{ type: 'object', required: true, message: '请选择月份！', whitespace: true }]}]"
                    @change="handleMonSelect"
                    format="YYYY-MM"
                    :disabledDate="disabledDate"
                  ></a-month-picker>
                </a-form-item>
              </div>
            </div>
            <div class="scanBorder"></div>
            <div class="scanMain">
              <label for=""><small>*</small>关账日期</label>
              <div class="scanDetail">
                <a-form-item style="width: 100%" has-feedback>
                  <a-date-picker
                    :disabledDate="disabledTime"
                    placeholder="请选择关账日期"
                    @change="handleSelect"
                    v-decorator="['closeDate', { rules: [{type: 'object', required: true, message: '请选择关账日期！', whitespace: true }]}]"
                    :format="format"
                  ></a-date-picker>
                </a-form-item>
              </div>
            </div>
            <div class="scanBorder"></div>
            <div class="scanMain">
              <label for=""><small>*</small>补传结束日期</label>
              <div class="scanDetail">
                <a-form-item style="width: 100%" has-feedback>
                  <a-date-picker
                    :disabledDate="disabledVolTime"
                    placeholder="请选择补传结束日期"
                    @change="handleChangeVol"
                    v-decorator="['supDate', { rules: [{type: 'object', required: true, message: '请选择补传结束日期！', whitespace: true }]}]"
                    :format="format"
                  ></a-date-picker>
                </a-form-item>
              </div>
            </div>
            <div class="scanBorder"></div>
            <div class="scanMain">
              <label for=""><small>*</small>申诉结束日期</label>
              <div class="scanDetail">
                <a-form-item style="width: 100%" has-feedback>
                  <a-date-picker
                    :disabledDate="disabledEndTime"
                    placeholder="请选择申诉结束日期"
                    v-decorator="['appealDate', { rules: [{ type: 'object', required: true, message: '请选择申诉结束日期！', whitespace: true }]}]"
                    :format="format"
                  ></a-date-picker>
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { closeAdd, closeUpdate } from '@/api/basicInfo/hosData'
export default {
  name: 'AddClose',
  props: ['visible', 'editData'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.getUpdate()
  },
  data () {
    return {
      confirmLoading: false,
      queryParam: {
        page: 1,
        size: 10
      },
      format: 'YYYY-MM-DD',
      monTime: null,
      closeTime: null,
      supTime: null
    }
  },
  methods: {
    moment,
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const changeDate = moment(values.month).format(this.format)
          const params = {
            year: changeDate.substr(0, 4),
            month: changeDate.substr(5, 2),
            startTime: moment(values.closeDate).format(this.format),
            endTime: moment(values.closeDate).format(this.format),
            delayTime: moment(values.supDate).format(this.format),
            appealTime: moment(values.appealDate).format(this.format)
          }
          // console.info('values====', params)
          if (this.editData.id) {
            params.id = this.editData.id
            closeUpdate(params).then(res => {
              // console.info('res', res)
              if (res.message === 'SUCCESS') {
                _that.$emit('handleSubmit')
              } else {
                this.$emit('handleClose')
                this.$notification['error']({
                  message: '提示',
                  description: '该月已设置过关账日期，请勿重复设置！',
                  duration: 4
                })
              }
            })
          } else {
            closeAdd(params).then(res => {
              // console.info('res', res)
              if (res.message === 'SUCCESS') {
                _that.$emit('handleSubmit')
              } else {
                this.$emit('handleClose')
                this.$notification['error']({
                  message: '提示',
                  description: '该月已设置过关账日期，请勿重复设置！',
                  duration: 4
                })
              }
            })
          }
        }
      })
    },
    handleCancel () {
      this.$emit('handleClose')
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    disabledTime (current) {
      if (this.monTime !== null) {
        return current.isBefore(moment(this.monTime).startOf('month')) || current.isAfter(moment(this.monTime).endOf('month').add(1, 'months'))
      }
      return current && current < moment().endOf('month')
    },
    disabledVolTime (current) {
      if (this.closeTime !== null) {
        return current.isBefore(moment(this.closeTime).add(1, 'days')) || current.isAfter(moment(this.monTime).endOf('month').add(1, 'months'))
      }
      return current && current < moment().endOf('month')
    },
    disabledEndTime (current) {
      if (this.supTime !== null) {
        return current.isBefore(moment(this.supTime).add(1, 'days')) || current.isAfter(moment(this.monTime).endOf('month').add(1, 'months'))
      }
      return current && current < moment().endOf('month')
    },
    handleMonSelect (val) {
      // console.info('val====', val)
      this.monTime = val
      // this.closeTime = moment(val).startOf('month')
    },
    handleSelect (val) {
      // console.info('val====', val)
      this.closeTime = val
    },
    handleChangeVol (val) {
      // console.info('supTime====', val)
      this.supTime = val
    },
    getUpdate () {
      if (this.editData.id) {
        const dataArr = [moment(this.editData.startTime).format(this.format), moment(this.editData.endTime).format(this.format)]
        const supStr = moment(this.editData.delayTime).format(this.format)
        const appealStr = moment(this.editData.appealTime).format(this.format)
        this.form.setFieldsValue({
          supDate: moment(supStr, this.format),
          appealDate: moment(appealStr, this.format),
          closeDate: moment(dataArr[1], this.format),
          month: moment(this.editData.year + '-' + this.editData.month, this.format)
        })
        this.monTime = moment(this.editData.year + '-' + this.editData.month, this.format)
        this.closeTime = moment(dataArr[1], this.format)
        this.supTime = moment(supStr, this.format)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .addClose{
    .ant-modal-content {
      .ant-modal-body{
        padding: 0;
        .scanEdit{
          position: relative;
          .scanLeft{
            width: 100%;
            /*padding: 24px 32px;*/
            box-sizing: border-box;
          }
          .scanMain{
            display: inline-block;
            width: 100%;
            label{
              font-size: 14px;
              color: rgba(147, 147, 147, 1);
              padding: 0 16px 0 0;
              width: 30%;
              display: inline-block;
              text-align: right;
              line-height: 39px;
              float: left;
              small{
                color: red;
                padding: 0 4px 0 0;
              }
            }
            .scanDetail{
              display: inline-block;
              .ant-calendar-picker{
                min-width: 240px;
                width: 100%;
              }
              .ant-form-item-control-wrapper,.ant-form-item-control{
                width: 70%;
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
      }
    }
  }
</style>
