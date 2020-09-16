<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ hostTitle }}</h3>
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
                <span>医院名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['hosName', { rules: [{ required: false, message: '请输入医院名称！', whitespace: true }]}]"
                    placeholder="请输入医院名称"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <span>医院代码</span>
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['hosCode', { rules: [{ required: false, message: '输入医院代码', whitespace: true }]}]"
                    placeholder="输入医院代码"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>医院类型</span>
                <small>*</small>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    v-decorator="['hosCategoryName', { rules: [{ required: true, message: '请选择医院类型', whitespace: true }]}]"
                    placeholder="请选择医院类型"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="(item,index) in hospitalType"
                      :key="index"
                    >
                      {{ item.dictName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>医院性质</span>
                <small>*</small>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    v-decorator="['hosTypeName', { rules: [{ required: true, message: '请选择医院性质', whitespace: true }]}]"
                    placeholder="请选择医院性质"
                    style="width: 100%"
                  >
                    <a-select-option
                      :value="item.dictCode"
                      v-for="(item,index) in hospitalNature"
                      :key="index"
                    >{{ item.dictName }}</a-select-option>
                  </a-select>
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
                <span>医院所属地址</span>
              </div>
              <div class="adInput-input">
                <!-- <area-select
                  v-model="privinceData"
                  size="large"
                  @change="handleProvince"
                  :data="pca"
                  icon="icon-arrow-down"
                  type="text"
                />-->
                <a-form-item style="width: 45%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['province', { rules: [{ required: false, message: '输入所在省', whitespace: true }]}]"
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
                <small v-else>*</small>
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
                <span>地区</span>
                <!-- <small>*</small> -->
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    v-decorator="['regionName', { rules: [{ required: false, message: '请选择医院所在地区', whitespace: true }]}]"
                    placeholder="请选择医院所在地区"
                    style="width: 100%"
                  >
                    <a-select-option
                      :value="item.dictCode"
                      v-for="(item,index) in hospitalArea"
                      :key="index"
                    >{{ item.dictName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>区域</span>
                <!-- <small>*</small> -->
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    v-decorator="['districtName', { rules: [{ required: false, message: '请选择医院所在区域', whitespace: true }]}]"
                    placeholder="请选择医院所在区域"
                    style="width: 100%"
                  >
                    <a-select-option
                      :value="item.dictCode"
                      v-for="(item,index) in hospitalZone"
                      :key="index"
                    >{{ item.dictName }}</a-select-option>
                  </a-select>
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
import notification from 'ant-design-vue/es/notification'
import { addHosData, retriveHost } from '@/api/basicInfo/hosData'
import { AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
export default {
  name: 'AddHostBasic',
  props: ['hostData'],

  components: {
    AreaSelect
  },
  data() {
    return {
      addBtn: true,
      hostTitle: null,
      orUpdata: true, // true可以修改 false时不可修改
      hospitalType: [], // 医院类型
      hospitalNature: [], // 医院性质
      hospitalArea: [], // 医院地区
      hospitalZone: [], // 医院区域
      privinceData: [],
      pca,
      pcaa
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.getHostAllData()
  },
  mounted() {
    // 蚂蚁金服的验证规则
    if (this.hostData.id) {
      this.hostTitle = '修改医院主数据'
      this.orUpdata = false
      this.form.setFieldsValue({
        hosName: this.hostData.hosName,
        hosCode: this.hostData.hosCode,
        hosTypeName: this.hostData.hosType,
        hosCategoryName: this.hostData.hosCategory,
        detail: this.hostData.detail,
        regionName: this.hostData.regionId,
        districtName: this.hostData.districtId,
        province: this.hostData.province,
        city: this.hostData.city
      })
      //   this.privinceData = [this.hostData.province, this.hostData.city];
    } else {
      this.hostTitle = '新增医院主数据'
    }
  },
  methods: {
    getHostAllData() {
      const params = {
        dictType: ''
      }
      retriveHost(params).then(res => {
        if (res.message === 'SUCCESS') {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].dictType === '1') {
              this.hospitalType.push(res.data[i])
            } else if (res.data[i].dictType === '2') {
              this.hospitalNature.push(res.data[i])
            } else if (res.data[i].dictType === '3') {
              this.hospitalArea.push(res.data[i])
            } else if (res.data[i].dictType === '4') {
              this.hospitalZone.push(res.data[i])
            }
          }
        }
      })
    },

    // 提交
    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            const params = {
              hosName: values.hosName,
              hosCode: values.hosCode,
              hosCategory: values.hosCategoryName,
              hosType: values.hosTypeName,
              // province: this.privinceData[0],
              // city: this.privinceData[1],
              province: values.province,
              city: values.city,
              detail: values.detail,
              regionId: values.regionName,
              districtId: values.districtName
            }
            if (this.hostData.id) {
              params.id = this.hostData.id
            }
            //   console.log(params);
            this.handleAddHost(params)
          }
        })
      }
    },

    handleAddHost(params) {
      addHosData(params).then(res => {
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
    },
    // 返回到主页面
    handleBack() {
      this.$emit('handleNewPro', false)
    },

    handleProvince(val) {
      // console.info('已选择', val)
    }
  },
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
