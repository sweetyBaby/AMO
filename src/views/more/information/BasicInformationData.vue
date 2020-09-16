<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="pageTitle">
        <a-row :gutter="24">
          <a-col :md="16" :sm="24">
            <h3>基础信息设置</h3>
          </a-col>
          <a-col :md="8" :sm="24">
            <div class="icons-list pageTitle-Btn">
              <!-- <span class="titleBtn" @click="handleBack()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back"></i>
                </a-tooltip>
              </span>-->
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
            <a-col :md="8" :sm="12">
              <div class="proNewBorder">
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>经销商名称</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['distName', { rules: [{ required: false, message: '输入经销商名称', whitespace: true }]}]"
                        placeholder="输入经销商名称"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>联系人</span>
                  </div>
                  <div class="adInput-input">
                    <div style="margin-bottom: 16px">
                      <a-form-item style="width: 100%" has-feedback>
                        <a-input
                          v-decorator="['contacts', { rules: [{ required: true, message: '请输入联系人！', whitespace: true }]}]"
                          placeholder="请输入联系人"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </div>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>联系方式</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        v-decorator="['contactPhone', { rules: [{ required: true,pattern:/^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的联系方式！', whitespace: true }]}]"
                        placeholder="请输入联系方式"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>联系人邮箱</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        v-decorator="['contactEmail', { rules: [{ required: true,pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱！', whitespace: true }]}]"
                        placeholder="请输入联系人邮箱"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <!-- <small>*</small> -->
                    <span>微信</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        v-decorator="['contactWechat', { rules: [{ required: false, message: '请输入微信！', whitespace: true }]}]"
                        placeholder="请输入微信"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>营业执照</span>
                  </div>
                  <div class="adInput-input">
                    <template>
                      <div class="clearfix">
                        <a-upload
                          action="/amo/dist/picUpload"
                          listType="picture-card"
                          :fileList="fileList1"
                          @preview="handlePreview"
                          @change="handleChangePicture"
                          :headers="headerUpload"
                        >
                          <div v-if="fileList1.length < 1">
                            <i class="iconfont iconzu11"></i>
                            <div class="ant-upload-text">点击上传</div>
                          </div>
                        </a-upload>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                          <img alt="example" style="width: 100%" :src="previewImage" />
                        </a-modal>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :md="8" :sm="12">
              <div class="proNewBorder">
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>省份/城市</span>
                  </div>
                  <div class="adInput-input">
                    <!-- <area-select
                      disabled
                      type="text"
                      v-model="privinceData"
                      size="large"
                      @change="handleProvince"
                      :data="pca"
                      icon="icon-arrow-down "
                    />-->
                    <a-form-item style="width: 45%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['province', { rules: [{ required: false, message: '输入所在省', whitespace: true }]}]"
                        placeholder="输入所在省"
                        style="width: 100%"
                      />
                    </a-form-item>
                    <a-form-item style="width: 45%;float:right;" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['city', { rules: [{ required: false, message: '输入所在城市', whitespace: true }]}]"
                        placeholder="输入所在城市"
                        style="width: 100%; "
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>详细地址</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['address', { rules: [{ required: false, message: '请输入详细地址！', whitespace: true }]}]"
                        placeholder="请输入详细地址"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>地区</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['regionName', { rules: [{ required: false, message: '输入地区', whitespace: true }]}]"
                        placeholder="输入地区"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <!-- <small>*</small> -->
                    <span>备注信息</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        v-decorator="['remark', { rules: [{ required: false, message: '输入备注信息', whitespace: true }]}]"
                        placeholder="输入备注信息"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <!-- <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>税率</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        v-decorator="['taxRate', { rules: [{ required: true , message: '税率只能为数字', whitespace: true ,pattern:/^[0-9]*$/}]}]"
                        placeholder="输入税率"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div> -->
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>三类备案凭证</span>
                  </div>
                  <div class="adInput-input">
                    <template>
                      <div class="clearfix">
                        <a-upload
                          action="/amo/dist/picUpload"
                          listType="picture-card"
                          :fileList="fileList2"
                          @preview="handlePreview2"
                          @change="handleChangePicture2"
                          :headers="headerUpload"
                        >
                          <div v-if="fileList2.length < 1">
                            <i class="iconfont iconzu11"></i>
                            <div class="ant-upload-text">点击上传</div>
                          </div>
                        </a-upload>
                        <a-modal :visible="previewVisible2" :footer="null" @cancel="handleCancel2">
                          <img alt="example" style="width: 100%" :src="previewImage2" />
                        </a-modal>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :md="8" :sm="12">
              <div class="proNewBorder">
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>产品失效提醒天数</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input

                        v-decorator="['productNotifyLimmit', { rules: [{ required: true, message: '输入产品失效提醒天数(大于等于0的数)', whitespace: true ,pattern:/^[0-9]*$/}]}]"
                        placeholder="输入产品失效提醒天数"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>经销商代码</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['distCode', { rules: [{ required: false, message: '请输入经销商代码！', whitespace: true }]}]"
                        placeholder="请输入经销商代码"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>统一社会信用代码</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['creditCode', { rules: [{ required: false, message: '请输入统一社会信用代码！', whitespace: true }]}]"
                        placeholder="请输入统一社会信用代码"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>有效期截止日期</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-date-picker
                        style="width: 100%"
                        v-decorator="['effectiveEnd', config]"
                        disabled
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>经营资质</span>
                  </div>
                  <div class="adInput-input">
                    <template>
                      <div class="clearfix">
                        <a-upload
                          action="/amo/dist/picUpload"
                          listType="picture-card"
                          :fileList="fileList3"
                          @preview="handlePreview3"
                          @change="handleChangePicture3"
                          :headers="headerUpload"
                        >
                          <div v-if="fileList3.length < 1">
                            <i class="iconfont iconzu11"></i>
                            <div class="ant-upload-text">点击上传</div>
                          </div>
                        </a-upload>
                        <a-modal :visible="previewVisible3" :footer="null" @cancel="handleCancel3">
                          <img alt="example" style="width: 100%;height:100%" :src="previewImage3" />
                        </a-modal>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <!-- <a-col>
              <div class="proNewBorder">
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>营业执照、二类备案凭证、经营资质各传一张</span>
                  </div>
                  <div class="adInput-input">
                    <template>
                      <div class="clearfix">
                        <a-upload
                          action="/amo/dist/picUpload"
                          listType="picture-card"
                          :fileList="fileList"
                          @preview="handlePreview"
                          @change="handleChangePicture"
                        >
                          <div v-if="fileList.length < 3">
                            <i class="iconfont iconzu11"></i>
                            <div class="ant-upload-text">点击上传</div>
                          </div>
                        </a-upload>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                          <img alt="example" style="width: 100%" :src="previewImage" />
                        </a-modal>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </a-col>-->
          </a-row>
        </a-form>
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import notification from 'ant-design-vue/es/notification'
import { AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
import { retriveMyDetail, updateMyDetail } from '@/api/information'
import moment from 'moment'
export default {
  name: 'BasicInformationData',
  // props: ['hostData'],
  components: {
    AreaSelect
  },
  data () {
    return {
      addBtn: true,
      dateTableList: [],
      headerUpload: {
        Authorization: 'Bearer' + this.$store.state.user.token
      },
      previewVisible: false,
      previewVisible2: false,
      previewVisible3: false,
      previewImage: '',
      previewImage2: '',
      previewImage3: '',
      fileList: [],
      fileList2: [],
      fileList3: [],
      fileList1: [], // 图片的信息
      upList1: [], // 图片的地址
      upList2: [], // 图片的地址
      upList3: [], // 图片的地址
      spinning: true,
      updateId: null,
      pca,
      pcaa,
      privinceData: [],
      detailData: {},
      config: {
        rules: [
          { type: 'object', required: false, message: '请选择有效期截止日期!' }
        ]
      }
    }
  },
  // 创建前的生命周期
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.getTableList()
  },
  mounted () {},
  methods: {
    // 查询数据
    getTableList () {
      this.spinning = false
      retriveMyDetail(this.queryParam).then(res => {
        if (res.data.id) {
          this.dateTableList = res.data
          this.spinning = false
          this.form.setFieldsValue({
            distName: res.data.distName,
            contacts: res.data.contacts,
            contactPhone: res.data.contactPhone,
            contactEmail: res.data.contactEmail,
            contactWechat: res.data.contactWechat,
            address: res.data.address,
            regionName: res.data.regionName,
            // effectiveEnd: moment( res.data.effectiveEnd, "YYYY-MM-DD"),
            // effectiveEnd: moment(res.data.effectiveEnd).format("YYYY-MM-DD"),
            effectiveEnd: res.data.effectiveEnd == null ? null : moment(res.data.effectiveEnd),
            taxRate: res.data.taxRate,
            remark: res.data.remark,
            productNotifyLimmit: res.data.productNotifyLimmit,
            creditCode: res.data.creditCode,
            distCode: res.data.distCode,
            province: res.data.province,
            city: res.data.city
          })
          this.updateId = res.data.id
          const picList = [
            res.data.qualificationPic1,
            res.data.qualificationPic2,
            res.data.qualificationPic3
          ]
          picList.map((item, index) => {
            if (item) {
              const fileCode = item.split('/')
              this.fileList.push({
                uid: -index,
                name: fileCode[fileCode.length - 1],
                status: 'done',
                url: item
              })
            }
          })
          if (this.fileList[0]) {
            this.fileList1[0] = this.fileList[0]
            this.upList1[0] = this.fileList[0].url
          }
          if (this.fileList[1]) {
            this.fileList2[0] = this.fileList[1]
            this.upList2[0] = this.fileList[1].url
          }
          if (this.fileList[2]) {
            this.fileList3[0] = this.fileList[2]
            this.upList3[0] = this.fileList[2].url
          }
          //   console.log(this.fileList);
        }
      })
    },

    // 提交数据
    handleSubmit (e) {
      e.preventDefault()
      let params = {}
      this.spinning = true
      if (this.upList1.length == 0) {
        notification.error({
          message: '错误',
          description: '营业执照必须上传'
        })
        this.spinning = false
      }
      if (this.upList2.length == 0) {
        notification.error({
          message: '错误',
          description: '二类备案凭证必须上传'
        })
        this.spinning = false
      }
      if (this.upList3.length == 0) {
        notification.error({
          message: '错误',
          description: '经营资质必须上传'
        })
        this.spinning = false
      }
      if (
        this.upList3.length > 0 &&
        this.upList2.length > 0 &&
        this.upList1.length > 0
      ) {
        this.form.validateFieldsAndScroll((err, values) => {
          console.log(this.upList1)
          if (!err) {
            params = {
              id: this.updateId,
              creditCode: values.creditCode,
              distName: values.distName,
              contacts: values.contacts,
              contactPhone: values.contactPhone,
              contactEmail: values.contactEmail,
              contactWechat: values.contactWechat,
              address: values.address,
              regionCode: this.dateTableList.regionCode,
              sysOrgCode: this.dateTableList.sysOrgCode,
              effectiveEnd: values.effectiveEnd ? moment(values.effectiveEnd).format('YYYY-MM-DD') : null,
              taxRate: values.taxRate,
              remark: values.remark,
              productNotifyLimmit: values.productNotifyLimmit,
              distCode: values.distCode,
              qualificationPic1: this.upList1[0],
              qualificationPic2: this.upList2[0],
              qualificationPic3: this.upList3[0]
            }
            // console.log(params);
            this.updateDetails(params)
          } else {
            this.spinning = false
          }
        })
      }
    },

    updateDetails (params) {
      updateMyDetail(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.spinning = false
          notification.success({
            message: '成功',
            description: '修改成功'
          })
        } else {
          notification.error({
            message: '错误',
            description: res.message
          })
        }
      })
    },

    handleProvince (val) {
      console.info('已选择', val)
    },

    // 上传图片
    handleCancel () {
      this.previewVisible = false
      this.upList1[0] = []
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChangePicture ({ fileList }) {
      console.log(fileList)
      const uplist = []
      this.fileList1 = fileList
      fileList.map(file => {
        if (file.response) {
          console.log(file)
          uplist.push(file.response.data[0].filePath)
        } else {
        }
      })
      this.upList1 = uplist
      if (fileList.length > 0) {
        if (fileList[0].status == 'uploading') {
          if (fileList[0].size > 6335458) {
            notification.error({
              message: '上传失败',
              description: '图片大小不能超过5MB'
            })
            this.upList1 = []
            this.fileList1 = []
          }
        }
      }
    },

    handleCancel2 () {
      this.previewVisible2 = false
      this.upList2[0] = ''
    },
    handlePreview2 (file) {
      this.previewImage2 = file.url || file.thumbUrl
      this.previewVisible2 = true
    },
    handleChangePicture2 ({ fileList }) {
      const uplist = []
      this.fileList2 = fileList
      fileList.map(file => {
        if (file.response) {
          uplist.push(file.response.data[0].filePath)
        }
      })
      this.upList2 = uplist
      if (fileList.length > 0) {
        if (fileList[0].status == 'uploading') {
          if (fileList[0].size > 6335458) {
            notification.error({
              message: '上传失败',
              description: '图片大小不能超过5MB'
            })
            this.upList2 = []
            this.fileList2 = []
          }
        }
      }
    },

    handleCancel3 () {
      this.previewVisible3 = false
      this.upList3[0] = ''
    },
    handlePreview3 (file) {
      this.previewImage3 = file.url || file.thumbUrl
      this.previewVisible3 = true
    },
    handleChangePicture3 ({ fileList }) {
      const uplist = []
      this.fileList3 = fileList
      fileList.map(file => {
        if (file.response) {
          uplist.push(file.response.data[0].filePath)
        }
      })
      this.upList3 = uplist
      if (fileList.length > 0) {
        if (fileList[0].status == 'uploading') {
          if (fileList[0].size > 6335458) {
            notification.error({
              message: '上传失败',
              description: '图片大小不能超过5MB'
            })
            this.upList3 = []
            this.fileList3 = []
          }
        }
      }
    },

    // 上传图片
    // handleCancel() {
    //   this.previewVisible = false;
    // },
    // handlePreview(file) {
    //   this.previewImage = file.url || file.thumbUrl;
    //   this.previewVisible = true;
    // },
    // handleChangePicture({ fileList }) {
    //   let uplist = [];
    //   this.fileList = fileList;
    //   fileList.map(file => {
    //     // console.log(file);
    //     if (file.response) {
    //       if (file.response.message !== "SUCCESS") {
    //         notification.error({
    //           message: "上传失败",
    //           description: file.response.message
    //         });
    //       } else {
    //         uplist.push(file.response.data[0].filePath);
    //       }
    //       // console.log(file.response.data[0].filePath);
    //       //   uplist.push(file.response.data[0].filePath);
    //     }
    //   });
    //   this.upList1 = uplist;
    // },
    // 返回到主页面 子组件调用父组件的方法
    // handleBack() {
    //     this.$emit('handleNewPro', false);
    // },

    // handleChange(value) {
    //     console.log(`selected ${value}`);
    // },

    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
<style lang="less">
/* //新增页面边框 */

.proNewBorder {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 4px;
  padding: 30px 40px;
  margin-top: 20px;
  .ant-upload-list-item-info {
    span {
      width: 100%;
      height: 100%;
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

/* 操作记录 */
.operation_records {
  margin-top: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 8px;
  padding: 37px 35px 30px 40px;

  .operation_vertical {
    width: 1px;
    height: 21px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(236, 236, 236, 1);
    opacity: 1;
    margin-left: 13px;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .operation_btn {
    color: #3e4da8;
    text-align: center;
    line-height: 34px;
    display: block;
    width: 96px;
    height: 34px;
    background: rgba(246, 246, 246, 1);
    opacity: 1;
    border-radius: 22px;
  }

  .ant-steps {
    .ant-steps-item {
      height: 90px;

      .ant-steps-item-title {
        font-size: 14px;
        font-family: PingFang SC;
        color: rgba(52, 53, 62, 1);
        opacity: 1;
        margin-bottom: 10px;
      }
    }

    .ant-steps-icon {
      color: rgba(236, 236, 236, 1) !important;
    }
  }
}
</style>
