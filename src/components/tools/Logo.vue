<template>
  <div class="logo">
    <!--    <router-link :to="{ path:'/home/homePage' }">-->
    <!--      <LogoSvg alt="logo" />-->
    <!--      &lt;!&ndash;<h1 v-if="showTitle">{{ title }}</h1>&ndash;&gt;-->
    <!--    </router-link>-->
    <span class="userWrap" @click="showDrawer">
      <i class="iconfont iconlogo"></i>
    </span>
    <change-cooper :drawData="coopData" @close="handleClose" />
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'
import UserSvg from '@/assets/userLogo.svg?inline'
import ChangeCooper from './modules/ChangeCooper'

export default {
  name: 'Logo',
  components: {
    LogoSvg,
    ChangeCooper,
    UserSvg
  },
  props: {
    title: {
      type: String,
      default: 'Ant Design Pro',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data() {
    return {
      coopData: {
        visible: false
      },
      userColor: '#fff'
    }
  },
  methods: {
    showDrawer() {
      this.coopData = {
        visible: true
      }
    },
    handleClose() {
      this.coopData = {
        visible: false
      }
    }
  }
}
</script>
<style lang="less">
.userWrap:hover {
  box-shadow: 0px 1px 11px rgba(172, 173, 183, 0.6);
}
.userWrap {
  width: 42px;
  height: 42px;
  margin: 20px auto;
  background: rgba(62, 77, 168, 1);
  display: block;
  border-radius: 50%;
  position: relative;
  .iconfont {
    color: white;
    font-size: 17px;
    line-height: 1;
    position: absolute;
    top: 11px;
    left: 7px;
  }
}
</style>
