<template>
  <div class="registra">
    <a-input-search placeholder="请输入名称搜索" @search="onSearch" v-model="inputName">
      <a-button slot="enterButton">搜索</a-button>
    </a-input-search>
    <div class="registra_card">
      <div class="registra_card_add">
        <a href="javascript:;" class="add_icon" @click="addCard">
          <i class="iconfont icon-plus" />
        </a>
        <p class="add">添加</p>
      </div>
      <div class="card_contain" v-for="(item,index) in showCardLinst " :key="index">
        <div
          class="show_card"
          v-if="item.orUpdate"
          :style="{background:item.status==0?'':'#ececec'}"
        >
          <p class="card_line"></p>

          <div class="card_num">
            注册证号
            <label>{{ item.registration }}</label>
          </div>
          <div class="card_date">
            <p class="card_begin">
              生产日期
              <label>{{ moment(item.effectiveDateBegin).format('YYYY-MM-DD') }}</label>
            </p>
            <p class="card_end">
              失效日期
              <label>{{ moment(item.effectiveDateEnd).format('YYYY-MM-DD') }}</label>
            </p>
          </div>
          <div class="card_icon">
            <a-tooltip placement="top">
              <template slot="title">
                <span>修改</span>
              </template>
              <a href="javascript:;" class="card_edit" @click="updateDate(item)">
                <i class="iconfont icon-card-edit" />
              </a>
            </a-tooltip>
            <a-tooltip placement="top" v-if="item.status==0">
              <template slot="title">
                <span>禁用</span>
              </template>
              <a href="javascript:;" class="card_ban" @click="changeBan(item)">
                <i class="iconfont icon-unuse" />
              </a>
            </a-tooltip>
            <a-tooltip placement="top" v-else-if="item.status==1">
              <template slot="title">
                <span>启用</span>
              </template>
              <a href="javascript:;" class="card_ban" @click="changeUsing(item)">
                <i class="iconfont icon-use" />
              </a>
            </a-tooltip>
          </div>
        </div>

        <div class="show_card" v-else>
          <a-form layout="inline" :form="form" style="width:95%">
            <div class="card_add_num">
              <a-form-item has-feedback :validate-status="item.num" style="width: 100%">
                <a-input placeholder="注册证号" :disabled="!item.isAdd" v-model="item.registration" />
              </a-form-item>
            </div>
            <div class="card_add-date">
              <a-form-item
                has-feedback
                :validate-status="item.beginDate"
                style="width: 38%;margin-right:20px;"
              >
                <a-date-picker
                  placeholder="生产日期"
                  class="card_begin_date"
                  @change="onChangeBegin"
                  v-model="item.effectiveDateBegin"
                  :disabledDate="disabledStartDate"
                />
              </a-form-item>
              <a-form-item has-feedback :validate-status="item.endDate" style="width: 38%">
                <a-date-picker
                  placeholder="失效日期"
                  @change="onChangeEnd"
                  v-model="item.effectiveDateEnd"
                  :disabledDate="disabledEndDate"
                />
              </a-form-item>
            </div>
          </a-form>
          <div class="show_icon">
            <a-tooltip placement="top">
              <template slot="title">
                <span>保存</span>
              </template>
              <a href="javascript:;" class="card_edit" @click="savelUpdate(item)">
                <i class="iconfont icon-save" />
              </a>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>删除</span>
              </template>
              <a class="card_save" href="javascript:;" @click="delelAdd(item)" v-if="item.orDele">
                <i class="iconfont icondele" />
              </a>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'ProductRegistration',
  props: ['productRegistrations'],
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {},
  components: {},
  data() {
    return {
      currentIndex: 0,
      newRegistList: [],
      inputName: null,
      showCardLinst: [],
      startValue: null,
      endValue: null
    }
  },
  mounted() {
    if (this.productRegistrations.length > 0) {
      this.showCardLinst = this.productRegistrations.map((item, index) => {
        return {
          orUpdate: true,
          isAdd: false,
          beginDate: 'success',
          endDate: 'success',
          num: 'success',
          beginTip: null,
          endTip: null,
          numTip: null,
          orDele: false,
          ...item,
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
    changeBan(val) {
      val.status = 1
      const index = this.newRegistList.findIndex((value, index) => {
        return val.degree == value.degree
      })
      if (index >= 0) {
        this.newRegistList[index] = val
      } else {
        this.newRegistList.push(val)
      }
    },
    changeUsing(val) {
      val.status = 0
      const index = this.newRegistList.findIndex((value, index) => {
        return val.degree == value.degree
      })
      if (index >= 0) {
        this.newRegistList[index] = val
      } else {
        this.newRegistList.push(val)
      }
    },
    addCard() {
      const obj = {
        beginDate: '',
        endDate: '',
        num: '',
        beginTip: null,
        endTip: null,
        numTip: null,
        registration: '',
        effectiveDateBegin: null,
        effectiveDateEnd: null,
        orUpdate: false,
        isAdd: true,
        orDele: true,
        status: 0
      }
      this.startValue = null
      this.endValue = null
      this.showCardLinst.map((item, index) => {
        if (item.orUpdate == false) {
          this.currentIndex++
          this.savelUpdate(item)
        }
      })
      if (this.currentIndex == 0) {
        this.showCardLinst.unshift(obj)
      }
    },
    onChangeBegin(date, dateString) {
      this.startValue = date
    },
    onChangeEnd(date, dateString) {
      this.endValue = date
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
      if (val.registration == '') {
        val.num = 'error'
        notification.error({
          message: '错误',
          description: '注册证号不能为空'
        })
      } else if (val.registration) {
        let j = 0
        for (let i = 0; i < this.showCardLinst.length; i++) {
          if (
            val.registration.trim() ===
            this.showCardLinst[i].registration.trim()
          ) {
            j++
          }
        }
        if (j > 1) {
          val.num = 'error'
          notification.error({
            message: '错误',
            description: '注册证号不能重复'
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
        val.orDele = false
        val.orUpdate = true
        const index = this.newRegistList.findIndex((value, index) => {
          return val.degree == value.degree
        })
        if (index >= 0) {
          this.newRegistList[index] = val
        } else {
          this.newRegistList.push(val)
        }
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
    onSearch() {
      this.showCardLinst = this.productRegistrations.map((item, index) => {
        return {
          orUpdate: true,
          isAdd: false,
          beginDate: 'success',
          endDate: 'success',
          num: 'success',
          beginTip: null,
          endTip: null,
          numTip: null,
          orDele: false,
          ...item,
          effectiveDateEnd: moment(item.effectiveDateEnd, 'YYYY-MM-DD'),
          effectiveDateBegin: moment(item.effectiveDateBegin, 'YYYY-MM-DD')
        }
      })
      if (this.inputName != '' && this.inputName != null) {
        this.showCardLinst = this.showCardLinst.filter(item => {
          if (item.registration == null) {

          } else {
            return item.registration.indexOf(this.inputName) >= 0
          }
        })
      } else {
        this.showCardLinst = this.showCardLinst
      }
    }
  },
  watch: {
    newRegistList: {
      handler(after, before) {
        this.$emit('getParameter', after, 'regist')
      },
      deep: true
    },
    showCardLinst: {
      handler(after, before) {
        after.map((item, index) => {
          this.$emit('checkSave', after, 'regist')
        })
      },
      deep: true
    },
    endValue(val) {
      console.log('endValue', val)
    },
    startValue(val) {
      console.log('startValue', val)
    }
  }
}
</script>
<style lang="less">
.registra {
  .ant-input::placeholder {
    color: #34353e;
  }
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

  .registra_card {
    display: flex;
    flex-wrap: wrap;
    .card_contain {
      .show_card:hover {
        box-shadow: 0px 5px 20px rgba(227, 227, 238, 1);
        .card_line {
          background: rgba(251, 199, 115, 1);
        }
      }
      .show_card {
        margin-right: 30px;
        margin-bottom: 20px;
        width: 400px;
        height: 127px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 20px rgba(246, 246, 248, 1);
        opacity: 1;
        border-radius: 8px;
        padding: 30px 22px;

        .card_add_num {
          margin-bottom: 12px;
          .ant-form-item-control-wrapper {
            width: 90%;
            .ant-form-item-control {
              width: 90%;
            }
          }
          .ant-input {
            width: 100%;
          }
        }
        .card_add-date {
          .ant-calendar-picker {
            width: 100%;
          }
          .ant-form-item {
            margin-right: 0;
          }

          .card_begin_date {
            // margin-right: 20px;
            width: 100%;
          }
        }
        .show_icon {
          float: right;
          margin-top: -58px;
          a {
            display: inline-block;
            text-decoration: none;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            opacity: 1;
            text-align: center;
            line-height: 38px;
            .iconfont {
              color: #cfcfcf;
              font-size: 28px;
            }
          }
          .card_edit:hover {
            background: #fbc773;
            .iconfont {
              color: #fff;
            }
          }
          .card_save:hover {
            background: #60c697;
            .iconfont {
              color: #fff;
            }
          }
        }
        .card_icon {
          float: right;
          margin-top: -37px;
          a {
            display: inline-block;
            text-decoration: none;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            opacity: 1;
            text-align: center;
            line-height: 38px;
            .iconfont {
              color: #cfcfcf;
              font-size: 28px;
            }
          }
          .card_edit {
            margin-right: 10px;
          }
          .card_edit:hover {
            background: rgba(96, 198, 151, 1);
            .iconfont {
              color: #fff;
            }
          }
          .card_ban:hover {
            background: #fbc773;
            .iconfont {
              color: #fff;
            }
          }
        }
        .card_line {
          width: 60px;
          height: 2px;
          background: rgba(246, 246, 248, 1);
          opacity: 1;
          border-radius: 4px;
        }
        .card_date {
          font-size: 12px;
          color: #34353e;
          .card_begin {
            margin-right: 22px;
          }
          p {
            display: inline-block;
            margin: 0;
          }
        }
        .card_num {
          color: #3e4da8;
          margin-bottom: 10px;
        }
      }
    }
    .registra_card_add {
      margin-right: 30px;
      width: 400px;
      height: 127px;
      background: rgba(251, 251, 251, 1);
      border: 1px solid rgba(247, 247, 247, 1);
      opacity: 1;
      border-radius: 8px;
      text-align: center;
      .add_icon {
        width: 32px;
        height: 32px;
        border: 2px solid rgba(233, 233, 233, 1);
        border-radius: 50%;
        opacity: 1;
        text-decoration: none;
        display: block;
        margin: 35px auto 0;
        .icon-plus {
          color: #cfcfcf;
          font-size: 18px;
        }
      }
      .add {
        margin-top: 12px;
        margin-bottom: 0;
        color: #cfcfcf;
      }
    }
    .registra_card_add:hover {
      .add_icon {
        border: 2px solid #3e4da8;
        .icon-plus {
          color: #3e4da8;
        }
      }
      .add {
        color: #3e4da8;
      }
    }
  }
}
</style>
