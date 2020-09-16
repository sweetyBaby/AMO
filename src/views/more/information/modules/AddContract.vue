<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3>{{ editData.title }}</h3>
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
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>经销商</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    style="width: 100%;"
                    placeholder="选择经销商"
                    @change="handleDist"
                    v-decorator="['distCode', { rules: [{ required: true, message: '选择经销商', whitespace: true }]}]"
                  >
                    <a-select-option
                      v-for="item in distList"
                      :key="item.distCode"
                      :value="item.distCode"
                    >{{ item.distName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>合同编号</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contractNum', { rules: [{ required: true, message: '输入合同编号', whitespace: true }]}]"
                    placeholder="输入合同编号"
                    @change="handleContract"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>配送商名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['distribution', { rules: [{ required: true, message: '输入配送商名称', whitespace: true }]}]"
                    placeholder="输入配送商名称"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>医院名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    placeholder="请选择客户名称"
                    @click="handleSelectCus"
                    style="width: 100%"
                    v-decorator="['hosName', { rules: [{ required: true, message: '选择客户', whitespace: true }]}]"
                  />
                  <!--                  </a-input-group>-->
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="12" :sm="12">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>上传附件</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-upload
                    action="/amo/upload/file/add"
                    listType="picture-card"
                    :fileList="fileList"
                    @preview="uploadPreview"
                    @change="uploadChange"
                    :multiple="true"
                    :headers="headerUpload"
                    :beforeUpload="beforeUpload"
                    :data="fileData"
                  >
                    <div v-if="fileList && fileList.length < 5">
                      <i class="iconfont icon-img"></i>
                      <div class="ant-upload-text">点击上传</div>
                    </div>
                  </a-upload>
                  <a-modal
                    :visible="previewVisible"
                    :footer="null"
                    @cancel="uploadCancel"
                    width="660px"
                    class="imgModal"
                  >
                    <img alt="example" style="width: 100%" :src="previewImage"/>
                  </a-modal>
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>备注</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['remark', { rules: [{ required: false, message: '输入备注', whitespace: true }]}]"
                    placeholder="输入备注"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <select-cus-name
      v-if="selectShow"
      :visible="selectShow"
      :cusData="cusData"
      @selectCus="handleSelectOk"
      @selectCancle="handleSelectCancle"
    ></select-cus-name>
  </div>
</template>
<script>
import moment from 'moment'
import { contractAdd, contractdetail, contractUpdate } from '@/api/auditManage/auditManage'
import SelectCusName from '@/views/comPublic/modules/SelectCusName'
import { getDocumentCusList, getDocumentDistList } from '@/api/depot/wareHouse'
export default {
  name: 'AddClose',
  props: ['editData'],
  components: {
    SelectCusName
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.getDocumentDistList()
    if (this.editData.id) {
      this.getDetail({ id: this.editData.id })
    } else {
      this.form.setFieldsValue({
        remark: '',
        distribution: '',
        contractNum: '',
        hosCode: undefined,
        hosName: '',
        distCode: undefined
      })
    }
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
      supTime: null,
      headerUpload: { Authorization: 'Bearer ' + this.$store.state.user.token },
      previewImage: '',
      previewVisible: false,
      fileList: [],
      fileData: {
        fileType: 24,
        uploadType: 1,
        correlationId: ''
      },
      selectShow: false,
      cusData: {
        distCode: this.$store.state.user.info.distCode,
        type: 'all'
      },
      distCode: this.$store.state.user.info.distCode,
      cusCode: undefined,
      haAuth: 'has',
      cusName: '',
      cusList: [],
      authorize: 'has',
      hosCode: undefined,
      distList: [],
      distName: ''
    }
  },
  methods: {
    moment,
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.fileList.length > 0) {
            const picId = []
            this.fileList.forEach(item => {
              if (item.response) {
                picId.push(item.response.data.id)
              } else {
                picId.push(item.id)
              }
            })
            values.hosCode = this.hosCode
            values.picId = picId
            values.distName = this.distName
            if (this.editData.id) {
              values.id = this.editData.id
              contractUpdate(values).then(res => {
                if (res.message === 'SUCCESS') {
                  this.$notification['success']({
                    message: '合同修改成功',
                    description: '合同修改成功',
                    duration: 4
                  })
                  this.$emit('handleSubmit')
                } else {
                  this.$notification['error']({
                    message: '修改失败',
                    description: '合同修改失败！',
                    duration: 4
                  })
                }
              })
            } else {
              contractAdd(values).then(res => {
                if (res.message === 'SUCCESS') {
                  this.$notification['success']({
                    message: '合同新增成功',
                    description: '合同新增成功',
                    duration: 4
                  })
                  this.$emit('handleSubmit')
                } else {
                  this.$notification['error']({
                    message: '新增失败',
                    description: '合同新增失败！',
                    duration: 4
                  })
                }
              })
            }
          } else {
            this.$notification['error']({
              message: '错误提示',
              description: '附件不能为空！',
              duration: 4
            })
          }
        }
      })
    },
    handleCancel () {

    },
    handleBack () {
      this.$emit('handleBack', false)
    },
    handleContract (e) {
      e.target.value = e.target.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    uploadPreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    uploadCancel () {
      // 取消
      this.previewVisible = false
    },
    uploadChange ({ file, fileList }) {
      this.fileList = fileList
    },
    beforeUpload (file, fileList) {
      // 发票上传前回调
      const size = file.size / 1024 / 1024
      if (size > 5) {
        this.$notification['error']({
          message: '上传失败',
          description: '文件大小不能超过5M！',
          duration: 4
        })
        return false
      }
    },
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    handleSelectCus () {
      // console.info('3333')
      this.selectShow = true
    },
    // 选择客户名称弹框
    handleSelectOk (subVal) {
      // console.info('subVal====',subVal)
      this.hosCode = subVal.cusCode
      this.form.setFieldsValue({
        hosName: subVal.cusName
      })
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    getDetail (params) {
      // console.info('params===', params)
      contractdetail(params).then(res => {
        // console.info('res', res)
        if (res.message === 'SUCCESS') {
          this.form.setFieldsValue({
            remark: res.data.remark,
            distribution: res.data.distribution,
            contractNum: res.data.contractNum,
            hosCode: res.data.hosCode,
            hosName: res.data.hosName,
            distCode: res.data.distCode
          })
          this.distName = res.data.distName
          if (res.data.picList) {
            res.data.picList.forEach(item => {
              this.fileList.push({
                ...item,
                name: item.fileName,
                size: item.fileSize,
                uid: item.id,
                thumbUrl: item.fileUrl,
                status: 'done',
                originFileObj: {
                  name: item.fileName,
                  size: item.fileSize
                }
              })
            })
            this.$forceUpdate()
          }
        }
      })
    },
    getDocumentDistList () {
      getDocumentDistList().then(res => {
        if (res.message === 'SUCCESS') {
          this.distList = res.data
        }
      })
    },
    handleDist(val) {
      this.distList.map(item => {
        if (item.distCode === val) {
          this.distName = item.distName
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
      .inventory_title {
        color: rgba(147, 147, 147, 1);
        font-size: 14px;
        font-family: PingFang SC;
        margin-right: 12px;
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
      }

      .ant-select-selection {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
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
        background: rgba(252, 252, 252, 1);
        border: 1px solid #ececec;
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
