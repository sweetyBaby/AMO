<template>
  <a-drawer
    :placement="placement"
    @close="onClose"
    :visible="drawData.visible"
    :width="340"
    wrapClassName="wrapClassName"
  >
    <div class="userInfor">
      <div class="userTop">
        <span>
          <i class="iconfont icon-users"></i>
        </span>
      </div>
      <div class="userName">
        <div class="userEdit">
          <span>
            {{ userDatas.nickName }}
            <a-tooltip placement="top" @click="handleToUser">
              <template slot="title">
                <span>个人中心</span>
              </template>
              <i class="iconfont icon-table-edit" />
            </a-tooltip>
          </span>
        </div>
        <p>{{ userDatas.mobile }}</p>
      </div>
      <div class="userChange">
        <a-row :gutter="24">
          <a-col :span="8" class="gutter-row">
            <a @click="handlePsw" class="passHover">
              <i class="iconfont icon-psw"></i>
              <span>修改密码</span>
            </a>
          </a-col>
          <a-col :span="8" class="gutter-row">
            <a @click="handleMobile" class="phoneHover">
              <i class="iconfont icon-mobile"></i>
              <span>更换手机</span>
            </a>
          </a-col>
          <a-col :span="8" class="gutter-row">
            <a @click="handleLogout" class="numberHover">
              <i class="iconfont icon-checkOut"></i>
              <span>切换账号</span>
            </a>
          </a-col>
        </a-row>
      </div>
      <div class="distChange">
        <h4>
          <span>切换厂商</span>
          <!--          <a-button><i class="iconfont icon-plus" /></a-button>-->
        </h4>
        <div class="distList" v-for="item in distList" :key="item.id">
          <span class="distImg"><i class=" iconfont icon-distLogo" style="font-size:40px;"/></span>
          <span>{{ item.distName }}</span>
          <i :class="item.isChecked ? checked : unchecked" @click="handleCheck(item.id)"></i>
        </div>
      </div>
    </div>
    <first-login ref="passCode" />
    <change-phone ref="phoneCode" />
  </a-drawer>
</template>

<script>
import FirstLogin from './FirstLogin'
import ChangePhone from './ChangePhone'
import { mapActions, mapGetters } from 'vuex'
const distList = [
  {
    id: 'dist001',
    distName: '眼力健(上海)医疗器械贸易有限公司',
    isChecked: true
  }
]
export default {
  name: 'ChangeCooper',
  props: ['drawData'],
  components: {
    FirstLogin,
    ChangePhone
  },
  mounted() {
    // console.log(this.$store);
    // console.log(this.$store.state.user.info);
    this.userDatas = this.$store.state.user.info
  },
  data() {
    return {
      placement: 'left',
      visible: false,
      isEdit: false,
      userName: '李三',
      pswDatas: [],
      phoneData: false,
      userDatas: [],
      distList,
      isChecked: false,
      unchecked: 'iconfont icon-distCheck',
      checked: 'iconfont icon-distCheck active'
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    onClose() {
      this.$emit('close', false)
    },
    handleEdit(e) {
      this.isEdit = true
    },
    onSearch() {},
    handlePsw() {
      this.$refs.passCode.showPass(this.$store.state.user.info.sysUserCode)
    },
    handleToUser() {
      this.$emit('close', false)
      this.$router.push({ name: 'PersonalCenterData' })
    },
    handleMobile() {
      this.$refs.phoneCode.showphone(this.$store.state.user.info.sysUserCode)
    },
    handleCheck(val) {
      distList.map(item => {
        if (item.id === val) {
          item.isChecked = true
        } else {
          item.isChecked = false
        }
      })
    },
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        }
      })
    }
  }
}
</script>

<style lang="less">
.icon-distLogo{
    font-size: 40px;
}
// 弹框
.ant-modal {
  .bounced {
    .addInput {
      margin-top: 30px;
      .addInput-title {
        margin-bottom: 9px;
        span {
          color: #9c9c9e;
          margin-left: 10px;
        }
        small {
          color: #e17877;
        }
      }
      .adInput-input {
        .ant-btn {
          height: 44px;
          border-radius: 4px;
          background: #fbfbfb;
          border: 0;
          margin-left: 10px;
          float: right;
          //   width: 30%;
          color: #3e4da8;
        }

        .ant-btn:hover {
          background: #ececec !important;
        }

        .ant-form-item-control-wrapper {
          width: 100%;
          .ant-input {
            height: 44px;
            background: rgba(252, 252, 252, 1);
            border: 1px solid rgba(236, 236, 236, 1);
            opacity: 1;
            border-radius: 4px;
          }
        }
        .has-feedback {
          width: 100%;
        }
      }
    }
  }
}
.wrapClassName .ant-drawer-wrapper-body {
  background: rgba(62, 77, 168, 1);
  padding: 40px 0;
  color: rgba(203, 210, 252, 1);
  .ant-drawer-body {
    padding: 0 24px 24px 24px;
  }
}
.ant-drawer-close-x {
  .anticon {
    color: white;
  }
}
.userInfor {
  .userTop {
    width: 108px;
    height: 108px;
    margin: 0 auto;
    border: 2px dashed rgba(73, 88, 180, 1);
    border-radius: 54px;
    padding: 14px;
    box-sizing: border-box;
    span {
      background: rgba(95, 110, 201, 1);
      width: 76px;
      height: 76px;
      border-radius: 40px;
      display: block;
      text-align: center;
      .iconfont {
        font-size: 64px;
        padding: 16px 0 0 0;
        color: rgba(62, 77, 168, 1);
      }
    }
  }
  .userName {
    text-align: center;
    padding: 20px 0;
    .userEdit {
      a {
        color: rgba(95, 110, 201, 1);
      }
      .icon-table-edit {
        color: #5f6ec9;
      }
      .icon-table-edit:hover{
          color:#CBD2FC;
      }
      .iconfont {
        font-size: 24px;
        margin: 0 0 0 12px;
        cursor: pointer;
      }
    }
    p {
      padding: 8px 0;
      color: rgba(138, 152, 208, 1);
    }
  }
  .userChange {
    .ant-row {
      .ant-col-8 {
        .passHover:hover {
          background: #65c296;
          .icon-psw {
            color: #fff;
          }
          span {
            color: #fff;
          }
        }
        .phoneHover:hover {
          background: #65c296;
          .icon-mobile {
            color: #fff;
          }
          span {
            color: #fff;
          }
        }
        .numberHover:hover {
          background: #fbc773;
          .icon-checkOut {
            color: #fff;
          }
          span {
            color: #fff;
          }
        }
        a {
          background: rgba(69, 84, 174, 1);
          cursor: pointer;
          text-align: center;
          display: inline-block;
          padding: 12px 0;
          width: 100%;
          border-radius: 8px;
          .iconfont {
            font-size: 22px;
            color: rgba(203, 210, 252, 1);
            display: inline-block;
          }
          span {
            display: block;
            width: 100%;
            color: rgba(176, 185, 243, 1);
            font-size: 12px;
          }
        }
      }
    }
  }
  .distChange {
    padding: 54px 0 28px 0;
    h4 {
      font-size: 14px;
      color: rgba(147, 155, 211, 1);
    }
    .distList {
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding: 16px 0 17px 0;
      line-height: 40px;
      span.distImg {
        width: 40px;
        height: 40px;
        display: block;
        background: white;
        border-radius: 20px;
        margin: 0 12px 0 0;
      }
      .iconfont {
        color: rgba(81, 96, 188, 1);
        &.active,
        &:hover {
          color: rgba(101, 194, 150, 1);
        }
      }
    }
  }
}
</style>
