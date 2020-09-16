<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3>{{ SNtitle }}</h3>
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
    <a-form layout="inline" :form="form">
      <a-row :gutter="16">
        <a-col :md="12" :sm="12">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>经销商名称</span>
              </div>
              <div class="adInput-input" @click="retriveCode('distCode')">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input readonly v-decorator="['distName', { rules: [{ required: true, message: '请输入经销商名称！', whitespace: true }]}]" placeholder="请输入经销商名称" style="width: 100%">
                    <a-icon slot="suffix" type="ellipsis" />
                  </a-input>
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
                <span>经销商所属大区</span>
              </div>
              <div class="adInput-input" @click="retriveCode('distCode')">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input disabled v-decorator="['districtName', { rules: [{ required: false, message: '请输入经销商所属大区！', whitespace: true }]}]" placeholder="请输入经销商所属大区" style="width: 100%" />
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
                  <a-input disabled v-decorator="['distCode', { rules: [{ required: false, message: '输入经销商代码', whitespace: true }]}]" placeholder="输入经销商代码" style="width: 100%" />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="12" :sm="12">
          <div class="proNewBorder">
            <div class="addInput" @click="retriveCode('hosCode')">
              <div class="addInput-title">
                <small>*</small>
                <span>医院名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input readonly v-decorator="['hosName', { rules: [{ required: true, message: '输入医院名称', whitespace: true }]}]" placeholder="输入医院名称" style="width: 100%">
                    <a-icon slot="suffix" type="ellipsis" />
                  </a-input>
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
                <span>医院代码</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input disabled v-decorator="['hosCode', { rules: [{ required: true, message: '请输入医院代码！', whitespace: true }]}]" placeholder="请输入医院代码" style="width: 100%" />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small class="ban_small" v-if="productM">不可修改</small> -->
                <small>*</small>
                <span>产品型号</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    showSearch
                    placeholder="请选择产品型号"
                    optionFilterProp="children"
                    @change="selectModel"
                    :filterOption="filterOption"
                    v-decorator="['productModel', { rules: [{ required: true, message: '请选择产品型号！', whitespace: true }]}]">
                    <a-select-option :value="item.productModel" v-for="(item,index) in modelList" :key="index">{{ item.productModel }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <a-modal
      :destroyOnClose="true"
      title="代码查询"
      v-model="disCodevisible"
      @ok="handleOk"
      width="800px"
      @cancel="handleCancel"
      class="codeSearch">
      <template>
        <a-input-search placeholder="请输入名称搜索" @search="onSearch(modeType)" v-model="inputName">
          <a-button slot="enterButton">搜索</a-button>
        </a-input-search>
        <a-table
          ref="table"
          :customRow="handleCheck"
          :columns="columns"
          :dataSource="tableDatas"
          :pagination="pagination"
          :loading="loading"
          :rowSelection="{type:'radio',onChange: onSelectChange,selectedRowKeys}"
          @change="handleTableChange"
          :rowKey="keyCode"
          :destroyOnClose="true"
          :modelType="modeType"></a-table>
      </template>
    </a-modal>
  </div>
</template>

<script>
import notification from 'ant-design-vue/es/notification'
import {
  retriveNameData,
  retriveHostName,
  AddDealersHost,
  findProductMo
} from '@/api/basicInfo/hosData'
const columnsDist = [{
  title: '经销商名称',
  dataIndex: 'distName'
},
{
  title: '经销商代码',
  dataIndex: 'distCode'
}, ,

  {
    title: '经销商所属大区',
    dataIndex: 'regionName'
  }
]

const columnsHost = [{
  title: '医院名称',
  dataIndex: 'hosName'
},
{
  title: '医院代码',
  dataIndex: 'hosCode'
}
]

export default {
  name: 'AddDealersHost',
  props: ['tabletData'],
  privinceData: [],
  components: {},
  data() {
    return {
      saveHosRowKey: [],
      saveHosRow: [],
      saveDistRowKey: [],
      saveDistRow: [],
      addBtn: true,
      inputName: '',
      modelList: [],
      selectedRowKeys: [],
      selectedRows: [],
      modeType: null,
      keyCode: null,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: total => `共有 ${total} 条数据`
      },
      queryParam: {
        page: 0,
        size: 10
      },
      loading: true,
      tableDatas: [],
      columns: [],
      disCodevisible: false,
      SNtitle: ''
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.reserveProductMo()
  },
  mounted() {
    // 蚂蚁金服的验证规则

    if (this.tabletData.id) {
      this.SNtitle = '修改经销商授权医院'
      this.form.setFieldsValue({
        distName: this.tabletData.distName,
        distCode: this.tabletData.distCode,
        hosName: this.tabletData.hosName,
        hosCode: this.tabletData.hosCode,
        productModel: this.tabletData.productModel,
        districtName: this.tabletData.districtName
      })
    } else {
      this.SNtitle = '新增经销商授权医院'
    }
  },
  methods: {
    handleCheck(record, index) {
      // this.selectedRows=[]
      //  this.selectedRowKeys=[]
      return {
        on: {
          click: () => {
            const code = this.modeType
            if (this.selectedRowKeys) {
              this.selectedRowKeys = []
            }
            if (this.selectedRows) {
              this.selectedRows = []
            }
            this.selectedRowKeys.push(record[code])
            this.selectedRows.push(record)
          }
        }
      }
    },
    // 模糊搜索
    onSearch(code) {
      let name = null
      if (code === 'distCode') {
        name = 'distName'
      } else if (code === 'hosCode') {
        name = 'hosName'
      } else if (code === 'cusCode') {
        name = 'cusName'
      }
      this.queryParam = {
        page: 1,
        size: 10,
        [name]: this.inputName
      }
      this.retriveCode(code)
    },
    reserveProductMo() {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.modelList = res.data
        }
      })
    },
    selectModel(value) {},
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
      //   this.queryParam = {
      //     page: pagination.current,
      //     size: pagination.pageSize
      //   };
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      if (this.modeType === 'distCode') {
        this.columns = columnsDist
        this.changeRetrive(retriveNameData, 'distCode')
      } else if (this.modeType === 'hosCode') {
        this.columns = columnsHost
        this.changeRetrive(retriveHostName, 'hosCode')
      }
    },
    changeRetrive(interfaceApi, code) {
      interfaceApi(this.queryParam).then(res => {
        if (res.message === 'SUCCESS') {
          this.keyCode = code
          this.loading = false
          const pagination = {
            ...this.pagination
          }
          pagination.total = res.data.total
          this.tableDatas = res.data.list
          this.pagination = pagination
        }
      })
      if (this.$refs.table) {
        document.getElementsByClassName('ant-modal-body')[0].scrollTop = 0
      }
      this.loading = true
    },
    // 单选
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      if (this.modeType === 'distCode') {
        this.saveDistRowKey = this.selectedRowKeys
        this.saveDistRow = this.selectedRows
        this.form.setFieldsValue({
          distCode: this.selectedRows[0].distCode,
          distName: this.selectedRows[0].distName,
          districtName: this.selectedRows[0].regionName
        })
      } else if (this.modeType === 'hosCode') {
        this.saveHosRowKey = this.selectedRowKeys
        this.saveHosRow = this.selectedRows
        this.form.setFieldsValue({
          hosCode: this.selectedRows[0].hosCode,
          hosName: this.selectedRows[0].hosName
        })
      }
      this.inputName = null
      this.disCodevisible = false
      //   this.retriveProduct();
    },
    // 返回到主页面 子组件调用父组件的方法
    handleBack() {
      this.$emit('handleNewPro', false)
    },

    handleProvince(val) {
      console.info('已选择', val)
    },

    handleChange(value) {
      console.log(`selected ${value}`)
    },

    retriveCode(code) {
      this.disCodevisible = true
      if (code === 'distCode') {
        this.columns = columnsDist
        this.selectedRowKeys = this.saveDistRowKey
        this.selectedRows = this.saveDistRow
        this.changeRetrive(retriveNameData, code)
      } else if (code === 'hosCode') {
        this.columns = columnsHost
        this.selectedRowKeys = this.saveHosRowKey
        this.selectedRows = this.saveHosRow
        this.changeRetrive(retriveHostName, code)
      }
      this.modeType = code
    },
    // 弹框的取消按钮
    handleCancel() {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1,
        size: 10
      }
      this.inputName = null
    },

    // 提交
    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        const params = {}
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            params.distHosAuth = {
              distCode: values.distCode,
              hosCode: values.hosCode
            }
            params.distHosAuthProduct = {
              productModel: values.productModel
            }
            //   if (this.tabletData.id) {
            //     params.id = this.tabletData.id;
            //   }
            this.handleAddHost(params)
          }
        })
      }
    },
    handleAddHost(params) {
      AddDealersHost(params).then(res => {
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
  },
  watch: {}
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
.codeSearch {
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
