<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a target="_blank" class="user-icon">
        <span class="action">
          <i class="iconfont icon-question"></i>
        </span>
      </a>
      <notice-icon class="action"/>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu topMenu-name">
          <span>Hello，<i>{{ nickname() }}</i></span>
          <a-avatar class="avatar" size="small" :src="avatar()"/>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ path: '/home/userCenter' }">
              <i class="iconfont icon-userIcon" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <a href="javascript:" @click="handlePsw" >
              <a-icon type="lock" />
              <span>修改密码</span>
            </a>
          </a-menu-item>
          <a-menu-item key="2">
            <a href="javascript:" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <first-login
      :visibleData="pswDatas"
      @submit="handleOk"
    />
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import FirstLogin from './modules/FirstLogin'
export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,
    FirstLogin
  },
  data () {
    return {
      isShow: false,
      userList: {},
      pswDatas: {}
    }
  },
  mounted () {
    this.userList = this.$store.getters.userDatas
    if (this.$store.getters.userDatas.modifyPassword) {
      this.isShow = this.$store.getters.userDatas.modifyPassword
      this.pswDatas = {
        isModal: true,
        isFirst: true
      }
    } else {
      this.pswDatas = {
        isModal: false,
        isFirst: false
      }
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    handleOk (val) {
      this.pswDatas = {
        isModal: false,
        isFirst: false
      }
      if (val.password) {
        const params = {
          id: this.userList.id,
          password: val.password
        }
        // console.info('params', params)
        this.axios.post('user/modifyPassword', params).then((response) => {
          console.log('修改密码', response)
        }).catch((response) => {
          console.log(response)
        })
      }
    },
    handleLogout () {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            // console.info('1111')
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    handlePsw () {
      this.pswDatas = {
        isModal: true,
        isFirst: false
      }
    }
  }
}
</script>
<style lang="less">
  .content-box{
    line-height: 72px;
    @media (max-width:1440px) {
      line-height: 72px;
    }
    .topMenu-name{
      color: rgba(141, 156, 176, 1);
      font-size: 21px;
      font-family: 'PingFang SC';
      font-weight: normal;
      border-left: 1px solid rgba(205, 223, 252, 1);
      padding: 0 0 0 36px;
      i{
        color: rgba(17, 137, 249, 1);
        padding:0 24px 0 8px;
        font-style: normal;
      }
    }
    .user-icon{
      .action{
        @media (max-width:1440px) {
          height: 68px !important;
        }
        float: left;
        .iconfont{
          font-size: 32px;
          color: rgba(17, 137, 249, 1);
        }
      }
    }
    .user-dropdown-menu-wrapper.ant-dropdown-menu .ant-dropdown-menu-item{
      a{
        padding: 8px 0;
        .iconfont,.ant-icon{
          font-size: 18px;
          padding: 0 12px 0 0;
        }
      }
    }

  }
</style>
