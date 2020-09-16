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
            <!-- <span class="titleBtn">
              <a-tooltip placement="top">
                <a-upload
                  name="file"
                  :multiple="true"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  :headers="headers"
                >
                  <template slot="title">
                    <span>导入数据</span>
                  </template>

                  <i class="iconfont icon-up"></i>
                </a-upload>
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
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="addPage">
      <a-form layout="inline" :form="form">
        <a-row :gutter="16">
          <a-col :md="8" :sm="12">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>公告标题</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['noticeTitle', { rules: [{ required: true, message: '输入公告标题', whitespace: true }]}]"
                    placeholder="输入公告标题"
                    style="width: 100%;height:44px;"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>发送时间</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-radio-group v-model="noticeType" @change="onChangeRadio">
                    <a-radio value="1&1&1" style="width:27%">立即发送</a-radio>
                    <a-radio value="2&1&2" style="width:67%">
                      选择时间
                      <a-date-picker
                        :disabledDate="disabledDate"
                        v-if="openDate"
                        v-model="postDate"
                      />
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>
          </a-col>
          <a-col :md="16" :sm="12">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>公告内容</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%">
                  <a-textarea
                    @change="handleChange"
                    v-decorator="['noticeContent', { rules: [{ required: true, message: '输入公告内容', whitespace: true }]}]"
                    placeholder="输入公告内容"
                    style="width: 100%;"
                    :rows="6"
                  />
                </a-form-item>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="updateDist" v-if="!showTable">
      <div>
        <i class="iconfont iconupload" />
      </div>
      <p class="postScope">发送范围</p>
      <a-upload
        name="file"
        :multiple="true"
        action="/amo/notice/send/his/receiverImport"
        :headers="headerUpload"
        @change="uploadChange"
      >
        <a-button>
          点击添加
          <span style="color:#3E4DA8">"发送范围"</span>
        </a-button>
      </a-upload>
    </div>
    <div v-else class="ShowTable">
      <div class="tableTitle">
        <span style="color:#939393">发送范围</span>
        <span style="float:right;color:#3E4DA8;cursor:pointer" @click="clearTable">清除全部</span>
      </div>
      <a-table :columns="columns" :dataSource=" this.tableList" :rowKey="this.tableList.distCode" />
    </div>
  </div>
</template>

<script>
import { addAffiche, updateAffiche } from '@/api/unusualRemind'
import notification from 'ant-design-vue/es/notification'
import moment from 'moment'
import { fileURLToPath } from 'url'
// import DistTable from "./DistTable";
const columns = [
  {
    width: 150,
    title: '经销商名称',
    dataIndex: 'distName',
    key: 'distName'
  },
  {
    width: 150,
    title: '经销商代码',
    dataIndex: 'distCode',
    key: 'distCode'
  }
]
export default {
  name: 'AddAfficheManage',
  props: ['tabletData'],
  privinceData: [],
  components: {
    // DistTable
  },
  data() {
    return {
      udiList: '',
      addBtn: true,
      postDate: null,
      noticeType: '1&1&1',
      columns,
      tableList: [],
      showTable: false,
      fileObject: {},
      choiceDate: null,
      openDate: false,
      SNtitle: '',
      headerUpload: {
        Authorization: 'Bearer' + this.$store.state.user.token
      }
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {},
  mounted() {
    // 蚂蚁金服的验证规则
    if (this.tabletData.id) {
      if (this.tabletData.receiverInfos.length > 0) {
        this.showTable = true
        this.tableList = this.tabletData.receiverInfos
      } else {
        this.showTable = false
      }
      this.SNtitle = '修改公告'
      console.log(this.tabletData.noticeType)
      if (this.tabletData.noticeType == '1&1&1') {
        this.noticeType = '1&1&1'
      } else if (this.tabletData.noticeType == '2&1&2') {
        this.noticeType = '2&1&2'
        this.openDate = true
        this.postDate = moment(this.tabletData.sendTime)
      }
      this.form.setFieldsValue({
        noticeTitle: this.tabletData.noticeTitle,
        noticeContent: this.tabletData.noticeContent.replace(/<br\/>/g, '\n')
      })
    } else {
      this.SNtitle = '新增公告'
    }
  },

  methods: {
    handleChange(e) {
      this.udiList = e.target.value.replace(/\n/g, '<br/>')
    //  const contentList= e.target.value.split("\n");
    //   let content=""
    //  contentList.map(item=>{
    //      content=content+item+"<br/>"
    //  })
    //   this.udiList=content;
    //   console.log( "=====",content);
    },
    clearTable() {
      this.tableList = []
      this.showTable = false
    },
    uploadChange(info) {
      console.log(info.file)
      if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      } else if (info.file.status === 'done') {
        if (info.file.response.message == 'ERROR') {
          this.$message.error(`${info.file.name} ${info.file.response.data}.`)
        } else {
          this.showTable = true
          this.fileObject = info.file
          this.tableList = info.file.response.data
          console.log(info.file.response.data)
        }
      }
    },
    onChangeRadio(e) {
      console.log('radio checked', e.target.value)
      this.noticeType = e.target.value
      if (e.target.value == '2&1&2') {
        this.openDate = true
      } else {
        this.openDate = false
      }
    },
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    // 返回到主页面 子组件调用父组件的方法
    handleBack() {
      this.$emit('handleNewSN', false)
    },
    // headerUpload() {
    //   return {
    //     Authorization: "Bearer " + this.$store.state.user.token
    //   };
    // },
    // 提交
    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        this.form.validateFieldsAndScroll((err, values) => {
          const _that = this
          if (!err) {
            this.addBtn = false
            const params = {
              noticeTitle: values.noticeTitle,
              noticeContent: _that.udiList,
              noticeType: _that.noticeType
            }
            if (_that.noticeType == '2&1&2') {
              params.sendTime = moment(_that.postDate).format('YYYY-MM-DD')
            }
            params.receiverList = _that.tableList.map((item, index) => {
              return item.distCode
            })
            if (_that.tabletData.id) {
              console.log(_that.tabletData.id)
              params.id = _that.tabletData.id
              this.handleupdateHost(params)
            } else {
              this.handleAddHost(params)
            }
            console.log(params)
          }
        })
      }
    },
    handleupdateHost(params) {
      console.log(params)
      updateAffiche(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message
          })
        }
      })
    },
    handleAddHost(params) {
      addAffiche(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
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
/* //新增页面边框 */
// .components-input-demo-presuffix .anticon-close-circle {
//   cursor: pointer;
//   color: #ccc;
//   transition: color 0.3s;
//   font-size: 12px;
// }

.addPage {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(67, 67, 69, 0.2);
  opacity: 1;
  border-radius: 8px;
  padding: 30px 40px;
  margin-top: 20px;
  border: 10px solid transparent;
  border-image: url("../../../../assets/border.png") 16 15 16 round;

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
      max-width: 68% !important;
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
      //   height: 44px;
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

    .ant-form-item-children {
      width: 100%;
      display: block;
      .ant-radio-group {
        display: block;
      }
    }
  }
}
//上传数据
.updateDist {
  width: 200px;
  height: 200px;
  margin: 70px auto 0;
  text-align: center;
  .iconupload {
    color: #ececec;
    font-size: 104px;
  }
  .postScope {
    font-size: 16px;
    color: #939393;
    margin-bottom: 4px;
  }
  .ant-upload {
    color: #b1b1b1;
    .ant-btn {
      border: 0px;
    }
    .ant-btn:hover {
      color: #939393;
    }
  }
}
.ShowTable {
  margin-top: 30px;
  .tableTitle {
    padding: 17px 30px 15px 20px;
    height: 52px;
    background: rgba(249, 249, 249, 1);
    border: 1px solid rgba(239, 239, 239, 1);
    opacity: 1;
    border-radius: 8px 8px 0px 0px;
  }
}
</style>
