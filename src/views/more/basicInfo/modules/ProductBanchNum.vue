<template>
  <div class="branch">
    <a-input-search placeholder="请输入名称搜索" @search="onSearch" v-model="inputName">
      <a-button slot="enterButton">搜索</a-button>
    </a-input-search>
    <div class="branch_card">
      <div class="card_Child card_add">
        <a class="add_cont" href="javascript:;" @click="addCard">
          <i class="iconfont icon-plus" />
        </a>
        <p class="add">添加</p>
      </div>
      <div v-for="(item,index) in showCardLinst " :key="index">
        <div
          class="card_Child show_cad"
          v-if="item.orUpdate"
          :style="{ background: item.status == 0 ? '': '#ececec'}"
        >
          <p class="card_title"></p>
          <div class="branch_num">
            <p>
              批号
              <span>{{ item.batchNumber }}</span>
            </p>
          </div>
          <div class="begin_date">
            <p>
              生产日期
              <span>{{ moment(item.effectiveDateBegin).format('YYYY-MM-DD')=='Invalid date'?'':moment(item.effectiveDateBegin).format('YYYY-MM-DD') }}</span>
            </p>
          </div>
          <div class="end_date">
            <p>
              失效日期
              <span>{{ moment(item.effectiveDateEnd).format('YYYY-MM-DD')=='Invalid date'?'':moment(item.effectiveDateEnd).format('YYYY-MM-DD') }}</span>
            </p>
          </div>
          <div v-if="item.orUpdate" class="card_btn">
            <a-tooltip placement="top">
              <template slot="title">
                <span>修改</span>
              </template>
              <a class="card_i" @click="updateDate(item)">
                <i class="iconfont icon-card-edit" />
              </a>
            </a-tooltip>
            <a-tooltip placement="top" v-if="item.status==0">
              <template slot="title">
                <span>禁用</span>
              </template>
              <a class="card_ban" @click="changeBan(item)">
                <i class="iconfont icon-unuse" />
              </a>
            </a-tooltip>
            <a-tooltip placement="top" v-else-if="item.status==1">
              <template slot="title">
                <span>启用</span>
              </template>
              <a class="card_ban" @click="changeUsing(item)">
                <i class="iconfont icon-use" />
              </a>
            </a-tooltip>
          </div>
        </div>
        <div class="card_Child show_cad" v-else>
          <a-form layout="inline" :form="form">
            <div class="input_num">
              <a-form-item
                style="width: 100%"
                has-feedback
                :validate-status="item.num"
                :help="item.numTip"
              >
                <a-input placeholder="批号" v-model="item.batchNumber" :disabled="!item.isAdd" />
              </a-form-item>
            </div>
            <div class="input_date">
              <a-form-item
                style="width: 100%"
                has-feedback
                :validate-status="item.beginDate"
                :help="item.beginTip"
              >
                <a-date-picker
                  placeholder="生产日期"
                  @change="onChangeBegin"
                  v-model="item.effectiveDateBegin"
                  :disabledDate="disabledStartDate"
                  :showToday="false"
                />
              </a-form-item>
            </div>
            <div class="end_date">
              <a-form-item
                style="width: 100%"
                has-feedback
                :validate-status="item.endDate"
                :help="item.endTip"
              >
                <a-date-picker
                  @change="onChangeEnd"
                  :disabledDate="disabledEndDate"
                  v-model="item.effectiveDateEnd"
                  placeholder="失效日期"
                  :showToday="false"
                />
              </a-form-item>
            </div>
            <a-tooltip placement="top">
              <template slot="title">
                <span>保存</span>
              </template>
              <a class="card_save" href="javascript:;" @click="savelUpdate(item)">
                <i class="iconfont icon-save" />
              </a>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>删除</span>
              </template>
              <a
                class="card_save card_dele"
                href="javascript:;"
                @click="delelAdd(item)"
                v-if="item.orDele"
              >
                <i class="iconfont icondele" />
              </a>
            </a-tooltip>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'ProductBanchNum',
  props: ['branchData'],
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  components: {
    moment
  },
  data() {
    return {
      currentIndex: 0,
      newbanchList: [],
      beginDate: '',
      beginTip: null,
      endDate: '',
      endTip: null,
      orUpdate: false,
      branch: null,
      startValue: null,
      endValue: null,
      showCardLinst: [],
      inputName: null,
      format: 'YYYY-MM-DD'
    }
  },

  destroyed() {},
  mounted() {
    if (this.branchData.length > 0) {
      this.showCardLinst = this.branchData.map((item, index) => {
        return {
          orUpdate: true,
          isAdd: false,
          beginDate: '',
          endDate: '',
          num: '',
          beginTip: null,
          endTip: null,
          numTip: null,
          orDele: false,
          ...item,
          status: item.status,
          effectiveDateEnd: moment(item.effectiveDateEnd, 'YYYY-MM-DD'),
          effectiveDateBegin: moment(item.effectiveDateBegin, 'YYYY-MM-DD')
        }
      })
    } else {
      this.showCardLinst = []
    }
  },
  methods: {
    moment,
    delelAdd(item) {
      this.showCardLinst.splice(0, 1)
      this.currentIndex = 0
    },

    onSearch() {
      this.showCardLinst = this.branchData.map((item, index) => {
        return {
          orUpdate: true,
          isAdd: false,
          beginDate: '',
          endDate: '',
          num: '',
          numTip: null,
          beginTip: null,
          endTip: null,
          orDele: false,
          status: item.status,
          ...item,
          effectiveDateEnd: moment(item.effectiveDateEnd, 'YYYY-MM-DD'),
          effectiveDateBegin: moment(item.effectiveDateBegin, 'YYYY-MM-DD')
        }
      })
      if (this.inputName != '' && this.inputName != null) {
        console.log(this.showCardLinst)
        this.showCardLinst = this.showCardLinst.filter(item => {
          if (item.batchNumber == null) {

          } else {
            return item.batchNumber.indexOf(this.inputName) >= 0
          }
        })
      } else {
        this.showCardLinst
      }
    },
    changeBan(val) {
      val.status = 1
      const index = this.newbanchList.findIndex((value, index) => {
        return val.batchNumber == value.batchNumber
      })
      if (index >= 0) {
        this.newbanchList[index] = val
      } else {
        this.newbanchList.push(val)
      }
    },
    changeUsing(val) {
      val.status = 0
      const index = this.newbanchList.findIndex((value, index) => {
        return val.batchNumber == value.batchNumber
      })
      if (index >= 0) {
        this.newbanchList[index] = val
      } else {
        this.newbanchList.push(val)
      }
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    onChangeBegin(date, dateString) {
      this.startValue = date
    },
    onChangeEnd(date, dateString) {
      console.log(date, dateString)
      this.endValue = date
    },

    addCard() {
      const obj = {
        batchNumber: '',
        effectiveDateBegin: null,
        effectiveDateEnd: null,
        orUpdate: false,
        isAdd: true,
        status: 0,
        beginDate: '',
        endDate: '',
        num: '',
        beginTip: null,
        endTip: null,
        numTip: null,
        orDele: true
      }

      this.showCardLinst.map((item, index) => {
        if (item.orUpdate == false) {
          this.currentIndex++

          this.savelUpdate(item)
        }
      })

      if (this.currentIndex == 0) {
        this.showCardLinst.unshift(obj)
      }
      this.startValue = null
      this.endValue = null
    },
    updateDate(val) {
      this.showCardLinst.map((item, index) => {
        if (item.orUpdate == false) {
          this.currentIndex++
          this.savelUpdate(item)
        }
      })
      if (this.currentIndex == 0) {
        val.orUpdate = false
      }

      val.orDele = false
      this.startValue = null
      this.endValue = null
      this.startValue = moment(val.effectiveDateBegin, 'YYYY-MM-DD')
      this.endValue = moment(val.effectiveDateEnd, 'YYYY-MM-DD')
    },
    savelUpdate(val) {
      const re = /^[0-9a-zA-Z]{1,}$/
      if (val.effectiveDateEnd == null) {
        val.endDate = 'error'
        notification.error({
          message: '错误',
          description: '失效日期不能为空'
        })
      } else {
        val.endDate = 'success'
      }
      if (val.effectiveDateBegin == null) {
        val.beginDate = 'error'
        notification.error({
          message: '错误',
          description: '生产日期不能为空'
        })
      } else {
        val.beginDate = 'success'
      }
      if (val.batchNumber == '') {
        val.num = 'error'
        notification.error({
          message: '错误',
          description: '批号不能为空'
        })
      } else if (!re.test(val.batchNumber.trim())) {
        val.num = 'error'
        notification.error({
          message: '错误',
          description: '批号只能数字和字母！'
        })
      } else if (val.batchNumber) {
        let j = 0
        for (let i = 0; i < this.showCardLinst.length; i++) {
          if (
            val.batchNumber.trim() === this.showCardLinst[i].batchNumber.trim()
          ) {
            j++
          }
        }
        if (j > 1) {
          val.num = 'error'
          notification.error({
            message: '错误',
            description: '批号不能重复'
          })
        } else {
          val.num = 'success'
        }
      } else {
        val.num = 'success'
      }
      if (
        val.num == 'success' &&
        val.beginDate == 'success' &&
        val.endDate == 'success'
      ) {
        this.currentIndex = 0
        val.orUpdate = true
        val.orDele = false
        const index = this.newbanchList.findIndex((value, index) => {
          return val.batchNumber == value.batchNumber
        })
        if (index >= 0) {
          this.newbanchList[index] = val
        } else {
          this.newbanchList.push(val)
        }
      }
    }
  },

  watch: {
    newbanchList: {
      handler(after, before) {
        console.log(after)
        this.$emit('getParameter', after, 'branch')
      },
      deep: true
    },
    showCardLinst: {
      handler(after, before) {
        after.map((item, index) => {
          this.$emit('checkSave', after, 'branch')
        })
      },
      deep: true
    },
    endValue(val) {},
    startValue(val) {}
  }
}
</script>
<style lang="less">
//弹框中的搜索框
.branch {
  .ant-input-affix-wrapper {
    margin-bottom: 20px;
    width: 385px;
    height: 32px;
  }
  .ant-input-suffix {
    .ant-btn {
      background-color: #e9e9e9;
      border-color: #e9e9e9;
    }
  }
  .branch_card {
    display: flex;
    flex-wrap: wrap;
    .card_add:hover {
      .add_cont {
        border: 2px solid #3e4da8;
        .icon-plus {
          color: #3e4da8;
        }
      }
      .add {
        color: #3e4da8;
      }
    }
    .card_add {
      background: #f7f7f7 !important;
      text-align: center;
      .add_cont {
        text-decoration: none;
        display: block;
        line-height: 28px;
        width: 32px;
        height: 32px;
        border: 2px solid rgba(233, 233, 233, 1);
        border-radius: 50%;
        opacity: 1;
        margin: 59px auto 0;
        .icon-plus {
          color: #cfcfcf;
        }
      }
      .add {
        margin-top: 12px;
        color: #cfcfcf;
      }
    }
    .card_Child:hover {
      .card_title {
        background: #fbc773;
      }
    }
    .show_cad {
      text-align: center;
      box-shadow: 0px 3px 20px rgba(246, 246, 248, 1);
    }
    .show_cad:hover {
      box-shadow: 0px 5px 20px rgba(227, 227, 238, 1);
    }
    .card_Child {
      margin-right: 16px;
      margin-top: 30px;
      //   text-align: center;
      padding: 20px;
      width: 200px;
      height: 239px;
      background: rgba(255, 255, 255, 1);

      opacity: 1;
      border-radius: 8px;
      .card_save {
        color: #cfcfcf;
        margin-right: 10px;
        text-align: center;
        width: 38px;
        height: 38px;
        display: inline-block;
        text-decoration: none;
        border-radius: 50%;
        opacity: 1;
        line-height: 38px;
        .iconfont {
          color: #cfcfcf;
          font-size: 28px;
        }
      }
      .card_dele:hover {
        background: #60c697 !important;
        .icondele {
          color: #fff;
          font-size: 28px;
        }
      }
      .card_save:hover {
        background: #fbc773;
        .icon-save {
          color: #fff;
          font-size: 28px;
        }
      }
      .ant-input::placeholder {
        color: #34353e;
      }
      .card_title {
        width: 60px;
        height: 2px;
        background: #f6f6f8;
        opacity: 1;
        border-radius: 4px;
        margin: 0 auto 30px;
      }

      .input_num {
        color: rgba(62, 77, 168, 1);
        margin-bottom: 15px;
        // height: 60px;
      }
      .ant-calendar-picker-input {
        //   border:0px;
        //   padding:0px;
      }
      .input_date {
        margin-bottom: 15px;
        // height: 60px;
      }
      .end_date {
        margin-bottom: 25px;
        // height: 60px;
      }
      .card_btn {
        text-align: center;
        .iconfont {
          color: #cfcfcf;
          font-size: 28px;
        }
        .card_i {
          margin-right: 10px;
          text-align: center;
          width: 38px;
          height: 38px;
          display: inline-block;
          text-decoration: none;
          border-radius: 50%;
          opacity: 1;
          line-height: 38px;
          color: #cfcfcf;
        }
        .card_ban {
          text-align: center;
          width: 38px;
          height: 38px;
          display: inline-block;
          text-decoration: none;
          border-radius: 50%;
          opacity: 1;
          line-height: 38px;
          .icon-card-edit {
            color: #cfcfcf;
            font-size: 28px;
          }
        }
        .card_ban:hover {
          .icon-use,
          .icon-unuse {
            color: #fff;
          }
        }
        .card_i:hover {
          background: rgba(96, 198, 151, 1);
          .icon-card-edit {
            color: #fff;
          }
        }

        .card_ban:hover {
          background: #fbc773;
          .icon-card-edit {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
